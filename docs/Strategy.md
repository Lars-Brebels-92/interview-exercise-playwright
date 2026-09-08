# Hier leg je kort uit hoe je de tests hebt opgezet, welke risico’s je zag, en hoe je flaky tests vermeden hebt.

Probleem 1: IP-blokkering bij gebruik van Chromium

Bij het uitvoeren van de geautomatiseerde tests met Chromium detecteert bol.com het verkeer als geautomatiseerd verkeer, waardoor het gebruikte IP-adres wordt geblokkeerd. Hierdoor wordt de reguliere bol.com-website niet geladen en kunnen de tests niet verder worden uitgevoerd. Een voorbeeld van deze blokkering is opgenomen in BolComBlokkeertIP.png.
Als workaround zijn de tests uitgevoerd met Firefox. Tijdens het uitvoeren van dezelfde testscenario's met Firefox treedt deze IP-blokkering niet op. Daarom is Firefox gekozen als primaire browser voor de verdere uitvoering van de testautomatisatie.

Locator strategy

Voor het selecteren van elementen wordt waar mogelijk gebruikgemaakt van semantische Playwright-locators, voornamelijk getByRole() in combinatie met de accessible name. Deze locators sluiten aan bij hoe een gebruiker de applicatie benadert en zijn doorgaans minder gevoelig voor wijzigingen in de HTML-structuur of styling.

Tijdens de analyse van bol.com zijn ook verschillende data-test attributen aangetroffen. Deze lijken bedoeld te kunnen zijn voor testautomatisatie, maar omdat er geen bevestiging of documentatie beschikbaar is over het gebruik en de stabiliteit van deze attributen, worden ze binnen deze opdracht niet als primaire locatorstrategie gebruikt.

Indien bevestigd zou worden dat data-test een bewust aangeboden en stabiel automation-attribuut is, zou dit waar relevant de voorkeur kunnen krijgen boven role-based locators, omdat dergelijke testattributen specifiek als stabiel contract voor geautomatiseerde tests kunnen dienen.

Taal en lokalisatie

Voor deze testopdracht is Nederlands als standaardtaal gekozen. De huidige locators en assertions mogen daarom uitgaan van Nederlandstalige teksten en accessible names, bijvoorbeeld Zoeken, Doorgaan en Alle artikelen.

Wanneer de tests ook in andere talen uitgevoerd moeten worden, kunnen de taalafhankelijke teksten apart bijgehouden worden. De tests kunnen dan afhankelijk van de gekozen taal de juiste teksten gebruiken.

Voor deze opdracht is dit niet geïmplementeerd, omdat het testen van meerdere talen buiten de gevraagde scope valt.

CI/CD optimalisatie

De huidige pipeline installeert tijdens iedere run de benodigde Node.js dependencies en Playwright-browsers. Dit maakt de pipeline eenvoudig en zorgt ervoor dat de gebruikte versies vanuit het project worden bepaald.

In een grotere of vaker uitgevoerde pipeline kan de uitvoeringstijd verder geoptimaliseerd worden. Zo kan ervoor gekozen worden om alleen de browser-engine(s) te installeren waarop de tests daadwerkelijk uitgevoerd worden, in plaats van alle Playwright-browsers. Daarnaast kan gebruikgemaakt worden van een vooraf ingerichte CI-image waarin Node.js, Playwright en de benodigde browserdependencies al aanwezig zijn.

Hierdoor hoeft niet bij iedere pipeline-run de volledige omgeving opnieuw opgebouwd te worden, wat de totale uitvoeringstijd kan verkorten.

Naamgeving van testcases

Voor de naamgeving van de geautomatiseerde testcases wordt een vaste structuur gebruikt. Elke test begint met een uniek testcase-ID, bijvoorbeeld QA1. Dit ID kan gekoppeld worden aan de overeenkomstige testcase in een testmanagementtool zoals Xray of TestRail. Hierdoor blijft de traceerbaarheid tussen de geautomatiseerde test en de gedocumenteerde testcase behouden.