# Hier leg je kort uit wat de installatie- en run-instructies zijn.

# Playwright Test Automation Assignment

Deze repository bevat de uitwerking van de Playwright testautomatisatie-opdracht voor bol.com. De tests zijn geschreven in TypeScript met Playwright.

## Vereisten

Voor het uitvoeren van de tests zijn de volgende tools vereist:

- Node.js
- npm
- Git

## Installatie

Clone eerst de repository en navigeer naar de projectmap.

Installeer vervolgens de dependencies:

```bash
npm ci
```

Installeer daarna de benodigde Playwright browsers:

```bash
npx playwright install
```

Indien ook de benodigde systeemdependencies geïnstalleerd moeten worden, bijvoorbeeld in een CI-omgeving:

```bash
npx playwright install --with-deps
```

## Tests uitvoeren

Alle tests uitvoeren:

```bash
npx playwright test
```

Alle tests uitvoeren met een zichtbare browser:

```bash
npx playwright test --headed
```

Eén specifieke testfile uitvoeren:

```bash
npx playwright test tests/opdracht1.spec.ts
```

## Testresultaten

Na het uitvoeren van de tests kan het Playwright HTML-rapport geopend worden met:

```bash
npx playwright show-report
```

Screenshots die tijdens de testscenario's worden gemaakt, worden opgeslagen in de `screenshots` directory.

## Configuratie

De basis-URL kan via de environment variable `BASE_URL` worden ingesteld.

Wanneer deze niet is opgegeven, wordt standaard de geconfigureerde bol.com URL gebruikt.

