import { test } from '@playwright/test';
import { SearchPage } from "../pages/SearchPage";
import {ScreenshotHelper} from "../helpers/ScreenshotHelper";


test('QA-4 Verify that pagination displays unique products on the second page', async ({ page }) => {
    const searchPage = new SearchPage(page);

    await searchPage.open('Digimon');
    const pageOneTitles = await searchPage.getProductTitles(5);
    await ScreenshotHelper.takeScreenshot(page, 'pagination-page-1');
    await searchPage.goToNextPage();
    await searchPage.verifyPageNumber(2);
    const pageTwoTitles = await searchPage.getProductTitles(5);
    await searchPage.verifyProductTitlesAreUnique(pageOneTitles, pageTwoTitles);
    await ScreenshotHelper.takeScreenshot(page, 'pagination-page-2'
    );
});