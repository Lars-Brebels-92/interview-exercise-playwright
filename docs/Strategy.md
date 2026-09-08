# Hier leg je kort uit hoe je de tests hebt opgezet, welke risico’s je zag, en hoe je flaky tests vermeden hebt.

## Tijdelijke IP-blokkering tijdens ontwikkeling

Tijdens de ontwikkeling trad tijdelijk een IP-blokkering op bij het uitvoeren van geautomatiseerde tests tegen bol.com. Hierbij werd het Playwright-verkeer door bol.com als mogelijk geautomatiseerd verkeer gedetecteerd en werd in plaats van de reguliere website een blokkeringspagina weergegeven.

Een voorbeeld hiervan is opgenomen in `BolComBlokkeertIP.png`.

Omdat de tests tegen de live omgeving van bol.com worden uitgevoerd, is dit een extern risico waarop het testframework zelf beperkte invloed heeft.

De blokkering was tijdelijk en heeft de uiteindelijke uitvoering van de opdracht niet verhinderd. Alle gevraagde testscenario's konden uiteindelijk succesvol worden ontwikkeld en uitgevoerd.

Om onnodige belasting van de live omgeving te beperken, worden overbodige requests en onnodig parallel uitvoeren van tests zoveel mogelijk vermeden.

In een productieomgeving zou voor structurele end-to-end testautomatisatie bij voorkeur gebruikgemaakt worden van een geschikte testomgeving of een afgesproken oplossing waarbij geautomatiseerd testverkeer niet door botbeveiliging wordt geblokkeerd.

# Test Strategy

Dit document beschrijft kort hoe de geautomatiseerde tests zijn opgezet, welke keuzes hierbij zijn gemaakt, welke risico's tijdens de implementatie zijn geïdentificeerd en welke maatregelen zijn genomen om de tests zo stabiel mogelijk uit te voeren.

## Testopzet

De testautomatisatie is opgezet met Playwright, TypeScript en Node.js.

De tests zijn verdeeld over afzonderlijke testscenario's. Voor de structuur van het framework wordt gebruikgemaakt van het Page Object Model (POM). Paginaspecifieke locators en acties zijn ondergebracht in Page Objects, terwijl herbruikbare functionaliteit, zoals het maken van screenshots, in aparte helpers is geplaatst.

Hierdoor blijven de testcases zelf voornamelijk gericht op het testscenario en de bijbehorende verificaties, terwijl technische implementatiedetails zoveel mogelijk worden afgeschermd.

De basis-URL wordt geconfigureerd via de Playwright-configuratie en kan via de environment variable `BASE_URL` worden overschreven.

## Page Object Model

Voor de verschillende onderdelen van bol.com zijn aparte Page Objects en componenten gebruikt, bijvoorbeeld voor de homepage, zoekresultaten, productdetailpagina en modals.

Hiermee wordt voorkomen dat dezelfde locators en acties op meerdere plaatsen in de tests worden geïmplementeerd.

Een test kan hierdoor bijvoorbeeld op hoog niveau werken met acties zoals:

```ts
await searchPage.open('Digimon');
await searchPage.filterByPrice(0, 50);
await searchPage.sortByLowestPrice();
```

Wanneer de implementatie van een pagina verandert, hoeft de betreffende locator of actie in principe slechts op één centrale plaats aangepast te worden.

## Locator strategy

Voor het selecteren van elementen wordt waar mogelijk gebruikgemaakt van semantische Playwright-locators, voornamelijk `getByRole()` in combinatie met de accessible name.

Deze locators sluiten aan bij hoe een gebruiker de applicatie benadert en zijn doorgaans minder gevoelig voor wijzigingen in de HTML-structuur of styling dan selectors die afhankelijk zijn van CSS-klassen of gegenereerde IDs.

Tijdens de analyse van bol.com zijn ook verschillende `data-test` attributen aangetroffen. Deze lijken bedoeld te kunnen zijn voor testautomatisatie, maar omdat er geen bevestiging of documentatie beschikbaar is over het gebruik en de stabiliteit van deze attributen, worden ze binnen deze opdracht niet als primaire locatorstrategie gebruikt.

Indien bevestigd zou worden dat `data-test` een bewust aangeboden en stabiel automation-attribuut is, kan dit waar relevant gebruikt worden als stabiel contract tussen de applicatie en de geautomatiseerde tests.

Selectors die afhankelijk zijn van dynamisch gegenereerde IDs, styling classes of complexe XPath-constructies worden zoveel mogelijk vermeden.

## Voorkomen van flaky tests

Er wordt zoveel mogelijk gebruikgemaakt van de ingebouwde auto-waiting functionaliteit van Playwright en van assertions die wachten totdat de verwachte toestand bereikt is.

Vaste wachttijden zoals:

```ts
await page.waitForTimeout(2000);
```

worden bewust vermeden. Een vaste wachttijd maakt een test onnodig traag wanneer de applicatie snel reageert en kan alsnog onvoldoende zijn wanneer de applicatie trager reageert.

Voor acties waarbij bol.com de zoekresultaten dynamisch vernieuwt, zoals filtering, sortering en pagination, wordt waar relevant gewacht op de bijbehorende netwerkresponse.

Bij pagination wordt daarnaast niet alleen gecontroleerd of de URL gewijzigd is. De test wacht ook totdat de weergegeven productdata daadwerkelijk veranderd is voordat de assertions op de nieuwe resultaten worden uitgevoerd.

Hiermee wordt voorkomen dat assertions worden uitgevoerd terwijl de pagina nog oude resultaten toont.

## Live testdata

De tests worden uitgevoerd tegen de live omgeving van bol.com. Hierdoor is de beschikbare testdata niet volledig onder controle van de testautomatisatie.

Producten, prijzen, beschikbaarheid, zoekresultaten en het aantal resultaten kunnen in de loop van de tijd veranderen.

De tests vermijden daarom waar mogelijk assertions op vaste productnamen, prijzen of aantallen. In plaats daarvan wordt het gedrag gecontroleerd, bijvoorbeeld:

- of zoekresultaten een titel en prijs bevatten;
- of prijzen oplopend gesorteerd zijn;
- of een gekozen filter actief wordt;
- of pagination nieuwe producten toont;
- of de productdetailpagina overeenkomt met het geselecteerde zoekresultaat.

Hierdoor zijn de tests minder afhankelijk van specifieke live testdata.

## Veilig testen van winkelwagenfunctionaliteit

De opdracht wordt uitgevoerd tegen een live webshop. Daarom is het belangrijk dat de tests geen echte bestellingen of ongewenste wijzigingen veroorzaken.

Voor het add-to-cart scenario wordt de relevante netwerkrequest onderschept voordat op de knop `In winkelwagen` wordt geklikt.

Bol.com gebruikt hiervoor een GraphQL-endpoint dat ook voor andere functionaliteit gebruikt wordt. Daarom wordt niet het volledige GraphQL-endpoint geblokkeerd. Alleen de GraphQL-operatie `AddItem` wordt onderschept en afgebroken.

Hierdoor kan de gebruikersinteractie met de knop getest worden zonder daadwerkelijk een product aan de winkelwagen toe te voegen.

De test controleert vervolgens dat de relevante request werd onderschept en dat de gebruiker op de productdetailpagina blijft.

## Taal en lokalisatie

Voor deze testopdracht is Nederlands als standaardtaal gekozen.

De huidige locators en assertions mogen daarom uitgaan van Nederlandstalige teksten en accessible names, bijvoorbeeld `Zoeken`, `Doorgaan` en `Alle artikelen`.

Wanneer de tests ook in andere talen uitgevoerd moeten worden, kunnen taalafhankelijke teksten centraal bijgehouden worden. De tests kunnen dan afhankelijk van de gekozen taal de juiste teksten gebruiken.

Voor deze opdracht is dit niet geïmplementeerd, omdat het testen van meerdere talen buiten de gevraagde scope valt.

## Naamgeving van testcases

Voor de naamgeving van de geautomatiseerde testcases wordt een vaste structuur gebruikt.

Elke test begint met een uniek testcase-ID, bijvoorbeeld:

```text
QA1
QA2
QA3
QA4
```

Dit ID kan gekoppeld worden aan de overeenkomstige testcase in een testmanagementtool zoals Xray of TestRail. Hierdoor blijft de traceerbaarheid tussen de geautomatiseerde test en de gedocumenteerde testcase behouden.

Na het testcase-ID wordt de naam opgebouwd volgens de structuur `Verify that ...`.

Bijvoorbeeld:

```ts
test('QA1 - Verify that searching for a product displays results with a title and price', async ({ page }) => {
    // Test implementation
});
```

Deze conventie zorgt voor consistente en herkenbare testnamen en maakt het eenvoudiger om testresultaten terug te koppelen naar een testmanagementtool.

## Screenshots en rapportage

Voor de gevraagde scenario's worden screenshots gemaakt en opgeslagen in de `screenshots` directory.

Daarnaast wordt gebruikgemaakt van het Playwright HTML-report voor de rapportage van de testresultaten.

Bij uitvoering via CI worden de relevante testresultaten, rapporten en screenshots als artifacts beschikbaar gesteld zodat deze ook na de pipeline-run bekeken kunnen worden.

## CI/CD

De tests kunnen via GitHub Actions automatisch uitgevoerd worden.

De pipeline:

1. checkt de repository uit;
2. configureert Node.js;
3. installeert de projectdependencies;
4. installeert de benodigde Playwright browserdependencies;
5. voert de Playwright-tests uit;
6. publiceert het HTML-report, screenshots en testresultaten als artifacts.

De `BASE_URL` wordt via een environment variable aan de testconfiguratie doorgegeven.

### CI/CD optimalisatie

De huidige pipeline installeert tijdens iedere run de benodigde Node.js dependencies en Playwright-browsers. Dit houdt de pipeline eenvoudig en zorgt ervoor dat de gebruikte versies vanuit het project worden bepaald.

In een grotere of vaker uitgevoerde pipeline kan de uitvoeringstijd verder geoptimaliseerd worden.

Er kan bijvoorbeeld voor gekozen worden om alleen de browser-engine(s) te installeren waarop de tests daadwerkelijk uitgevoerd worden. Daarnaast kan gebruikgemaakt worden van een vooraf ingerichte CI-image waarin Node.js, Playwright en de benodigde browserdependencies al aanwezig zijn.

Bij gebruik van een dergelijke image is het belangrijk dat de Playwright-versie en browserversies aansluiten bij de versie die door het project gebruikt wordt.

## Codekwaliteit

In een productieproject zou ik aanvullend linting en formatting configureren, bijvoorbeeld met ESLint en eventueel Prettier.

Hiermee kunnen codeconventies automatisch gecontroleerd worden en blijft de code consistent wanneer meerdere developers aan hetzelfde automation framework werken.

Voor deze opdracht is dit niet verder geïmplementeerd, omdat dit niet expliciet onderdeel was van de gevraagde scope.