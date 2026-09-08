import { Locator, Page } from '@playwright/test';

export class JouwPrivacyvoorkeurenModal {
    readonly modal: Locator;
    readonly acceptAllButton: Locator;

    constructor(page: Page) {
        this.modal = page.getByRole('dialog', {
            name: 'Jouw privacyvoorkeuren',
        });

        this.acceptAllButton = this.modal.getByRole('button', {
            name: 'Alles accepteren',
        });
    }

    async acceptAllCookies(): Promise<void> {
        await this.modal.waitFor({ state: 'visible' });
        await this.acceptAllButton.click();
        await this.modal.waitFor({ state: 'hidden' });
    }
}