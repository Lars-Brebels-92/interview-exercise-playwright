import { test } from '@playwright/test';
import { HomePage } from "../pages/HomePage";
import { SearchPage } from "../pages/SearchPage";
import {ScreenshotHelper} from "../helpers/ScreenshotHelper";

test('QA-1 Verify search that results contain a title and price', async ({ page }) => {
    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);

    await homePage.open();
    await homePage.verifySearchBarIsLoaded();
    await homePage.searchFor('Dragonball Z');
    await searchPage.verifyProductsHaveTitleAndPrice();
    await ScreenshotHelper.takeScreenshot(page, 'search-results');
});