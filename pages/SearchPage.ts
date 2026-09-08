import { expect, Locator, Page } from '@playwright/test';
import { JouwPrivacyvoorkeurenModal } from '../modals/JouwPrivacyvoorkeurenModal';
import { HoeWilJijBollenModal } from '../modals/HoeWilJijBollenModal';

export class SearchPage {
    readonly page: Page;
    readonly searchBar: Locator;
    readonly searchResultsTitle: Locator;
    readonly productTitles: Locator;
    readonly productPrices: Locator;
    readonly minimumPriceInput: Locator;
    readonly maximumPriceInput: Locator;
    readonly englishLanguageFilter: Locator;
    readonly englishFilterChip: Locator;
    readonly sortingSelect: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchBar = page.getByRole('textbox', {
            name: 'Zoeken',
        });
        this.searchResultsTitle = page.getByRole('heading', {
            name: /in Alle artikelen/i,
        });
        this.productTitles = page.getByRole('heading', {
            level: 2,
        });
        this.productPrices = page.getByText(
            /De prijs van dit product is/i
        );
        this.minimumPriceInput = page.getByRole('spinbutton', {
            name: /Minimaal/,
        });
        this.maximumPriceInput = page.getByRole('spinbutton', {
            name: /Maximaal/,
        });
        this.englishLanguageFilter = page.getByRole('checkbox', {
            name: /Engels/,
        });
        this.englishFilterChip = page.getByRole('button', {
            name: 'Engels',
            pressed: true,
        });
        this.sortingSelect = page
            .getByRole('combobox', {
                name: 'Sortering',
            })
            .first();
    }

    async open(searchTerm: string): Promise<void> {
        const jouwPrivacyvoorkeurenModal = new JouwPrivacyvoorkeurenModal(this.page);
        const hoeWilJijBollenModal = new HoeWilJijBollenModal(this.page);
        await this.page.goto(
            `/nl/nl/s/?searchtext=${encodeURIComponent(searchTerm)}`
        );
        await jouwPrivacyvoorkeurenModal.acceptAllCookies();
        await hoeWilJijBollenModal.continue();
        await this.verifyPageIsLoaded(searchTerm);
    }

    async verifyPageIsLoaded(searchTerm: string): Promise<void> {
        await expect(this.page).toHaveURL(/\/s\//);
        await this.verifySearchTerm(searchTerm);
    }

    async verifySearchTerm(searchTerm: string): Promise<void> {
        await expect(this.searchBar).toHaveValue(searchTerm);
        await expect(this.searchResultsTitle).toContainText(
            searchTerm
        );
    }

    async verifyProductsHaveTitleAndPrice(): Promise<void> {
        await expect(
            this.productTitles.first()
        ).toBeVisible();
        await expect(
            this.productPrices.first()
        ).toContainText(/euro/);
    }

    async filterByPrice(
        minimumPrice: number,
        maximumPrice: number
    ): Promise<void> {
        await this.minimumPriceInput.fill(
            minimumPrice.toString()
        );
        await this.maximumPriceInput.fill(
            maximumPrice.toString()
        );
        await this.waitForSearchDataResponse(async () => {
            await this.maximumPriceInput.press('Enter');
        });
    }

    async filterByEnglishLanguage(): Promise<void> {
        await this.waitForSearchDataResponse(async () => {
            await this.englishLanguageFilter.click();
        });
        await expect(
            this.englishLanguageFilter
        ).toBeChecked();
    }

    async verifyEnglishLanguageFilterIsApplied(): Promise<void> {
        await expect(
            this.englishLanguageFilter
        ).toBeChecked();
        await expect(
            this.englishFilterChip
        ).toBeVisible();
    }

    async sortByLowestPrice(): Promise<void> {
        const priceBeforeSorting = await this.productPrices.first().textContent();
        await this.waitForSearchDataResponse(
            async () => {
                await this.sortingSelect.selectOption(
                    'PRICE_ASC'
                );
            },
            'sort=price0'
        );
        await expect(
            this.sortingSelect
        ).toHaveValue('PRICE_ASC');
        await expect.poll(async () => {
            return await this.productPrices
                .first()
                .textContent();
        }).not.toBe(priceBeforeSorting);
    }

    async getPrices(amount: number): Promise<number[]> {
        const prices: number[] = [];
        for (let i = 0; i < amount; i++) {
            const priceText =
                await this.productPrices
                    .nth(i)
                    .textContent();
            if (!priceText) {
                throw new Error(
                    `Price text was not found for product ${i + 1}`
                );
            }
            prices.push(
                this.parsePrice(priceText)
            );
        }
        return prices;
    }

    async verifyPricesAreAscending(
        amount: number
    ): Promise<void> {
        const prices = await this.getPrices(amount);
        for (let i = 0; i < prices.length - 1; i++) {
            expect(prices[i]).toBeLessThanOrEqual(
                prices[i + 1]
            );
        }
    }

    private parsePrice(priceText: string): number {
        const match = priceText.match(
            /'(\d+)' euro en '(\d+)' cent/
        );
        if (!match) {
            throw new Error(
                `Could not parse price: ${priceText}`
            );
        }
        const euros = Number(match[1]);
        const cents = Number(match[2]);
        return euros + cents / 100;
    }

    private async waitForSearchDataResponse(
        action: () => Promise<void>,
        urlPart?: string
    ): Promise<void> {
        const responsePromise =
            this.page.waitForResponse(response =>
                response.url().includes('/s/_.data') &&
                (!urlPart ||
                    response.url().includes(urlPart)) &&
                response.status() === 200
            );
        await action();
        await responsePromise;
    }
}