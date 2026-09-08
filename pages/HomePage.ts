import { expect, Locator, Page } from '@playwright/test';
import { JouwPrivacyvoorkeurenModal } from '../modals/JouwPrivacyvoorkeurenModal';
import { HoeWilJijBollenModal } from '../modals/HoeWilJijBollenModal';
import { SearchPage } from './SearchPage';

export class HomePage {
    readonly page: Page;
    readonly homePageLogo: Locator;
    readonly searchBar: Locator;
    readonly searchButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.homePageLogo = page.getByRole('link', { name: 'Bol.com homepage' });
        this.searchBar = page.getByRole('textbox', { name: 'Zoeken' });
        this.searchButton = page.getByRole('button', { name: 'Zoeken' });
    }

    async open(): Promise<void> {
        const jouwPrivacyvoorkeurenModal = new JouwPrivacyvoorkeurenModal(this.page);
        const hoeWilJijBollenModal = new HoeWilJijBollenModal(this.page);

        await this.page.goto('/');
        await jouwPrivacyvoorkeurenModal.acceptAllCookies();
        await hoeWilJijBollenModal.continue();
        await this.verifyPageIsLoaded();
    }

    async verifyPageIsLoaded(): Promise<void> {
        await expect(this.homePageLogo).toBeVisible();
    }

    async verifySearchBarIsLoaded(): Promise<void> {
        await expect(this.searchBar).toBeVisible();
    }

    async searchFor(searchTerm: string): Promise<void> {
        const searchPage = new SearchPage(this.page);

        await this.searchBar.fill(searchTerm);
        await this.searchButton.click();

        await searchPage.verifyPageIsLoaded(searchTerm);
    }
}