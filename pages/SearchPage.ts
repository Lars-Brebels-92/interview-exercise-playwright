import { expect, Locator, Page } from '@playwright/test';

export class SearchPage {
    readonly page: Page;
    readonly searchBar: Locator;
    readonly searchResultsTitle: Locator;
    readonly productTitles: Locator;
    readonly productPrices: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchBar = page.getByRole('textbox', {
            name: 'Zoeken',
        });
        this.searchResultsTitle = page.getByRole('heading', {
            name: /in Alle artikelen/i,
        });
        this.productTitles = page.getByRole('heading', { level: 2 });
        this.productPrices = page.getByText(/De prijs van dit product is/i);
    }

    async verifyPageIsLoaded(searchTerm: string): Promise<void> {
        await expect(this.page).toHaveURL(/\/s\//); //Look for s in the url to reflect we are on the searchpage
        await this.verifySearchTerm(searchTerm)
    }

    async verifySearchTerm(searchTerm: string): Promise<void> {
        await expect(this.searchBar).toHaveValue(searchTerm);
        await expect(this.searchResultsTitle).toContainText(searchTerm);
    }

    async verifyProductsHaveTitleAndPrice(): Promise<void> {
        await expect(this.productTitles.first()).toBeVisible();
        await expect(this.productPrices.first()).toBeAttached();
    }
}