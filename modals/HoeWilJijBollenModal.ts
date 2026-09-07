import { Locator, Page } from '@playwright/test';

export class HoeWilJijBollenModal {
    readonly modal: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        this.modal = page.getByRole('dialog', {
            name: /Hoe wil jij bollen?/i,
        });

        this.continueButton = this.modal.getByRole('button', {
            name: 'Doorgaan',
        });
    }

    async continue(): Promise<void> {
        await this.modal.waitFor({ state: 'visible' });
        await this.continueButton.click();
    }
}