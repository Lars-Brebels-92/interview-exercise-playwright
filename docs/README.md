# Hier leg je kort uit wat de installatie- en run-instructies zijn.

Installatie stappen:
- npm init -y
- npm init playwright@latest
    - Typescript
    - tests
    - Github actions => No
    - Browser => Yes

Run instructies:
- npx playwright test
- npx playwright show-report
- npx playwright test --headed
- npx playwright test tests/opdracht1.spec.ts --project=chromium --headed
- npx playwright test --project=firefox --headed
- npx playwright test --project=chromium --headed
- npx playwright codegen --browser=firefox https://www.bol.com
