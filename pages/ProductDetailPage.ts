import { expect, Locator, Page } from '@playwright/test';

export class ProductDetailPage {
    readonly page: Page;
    readonly productTitle: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;
    readonly addToCartButton: Locator;


    constructor(page: Page) {
        this.page = page;

        this.productTitle = page.getByRole('heading', {
            level: 1,
        });
        this.productPrice = page.getByText(
            /De prijs van dit product is/i
        );
        this.productAvailability = page.getByText(
            /Op voorraad|Leverbaar|Niet leverbaar|Huidige voorraad bijna op bij deze verkoper/i
        );
        this.addToCartButton = page.getByRole('button', {
            name: 'In winkelwagen',
        }).first();
    }

    async verifyPageIsLoaded(
        expectedTitle: string,
        expectedProductUrl: string
    ): Promise<void> {
        await expect(this.page).toHaveURL(/\/nl\/nl\/p\//);
        await expect(this.productTitle).toBeVisible();
        await expect(this.productTitle).toHaveText(
            expectedTitle
        );
        const expectedPath = new URL(
            expectedProductUrl,
            'https://www.bol.com'
        ).pathname;
        await expect(this.page).toHaveURL(
            new RegExp(this.escapeRegExp(expectedPath))
        );
    }

    private escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    async verifyProductInformationIsVisible(): Promise<void> {
        await expect.soft(this.productTitle).toBeVisible();
        await expect.soft(this.productPrice).toBeVisible();
        await expect.soft(this.productAvailability).toBeVisible();
        await expect(this.addToCartButton).toBeVisible();
    }

    async blockCartAndCheckoutRequests(): Promise<void> {
            await this.page.route('**/api/graphql', async route => {
                const request = route.request();
                const postData = request.postData();
                if (!postData) {
                    await route.continue();
                    return;
                }
                const body = JSON.parse(postData);
                if (body.operationName === 'AddItem') {
                    await route.abort();
                    return;
                }
                await route.continue();
            });
    }

    async clickAddToCartSafely(): Promise<void> {
        await this.blockCartAndCheckoutRequests();
        const currentUrl = this.page.url();
        await this.addToCartButton.click();
        await expect(this.page).toHaveURL(currentUrl);
    }
}