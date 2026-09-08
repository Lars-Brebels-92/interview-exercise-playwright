import { test } from '@playwright/test';
import { SearchPage } from "../pages/SearchPage";
import {ScreenshotHelper} from "../helpers/ScreenshotHelper";


test('QA-2 Verify that filtered search results are sorted by lowest price', async ({ page }) => {
        const searchPage = new SearchPage(page);

        await searchPage.open('Pokemon');
        await searchPage.filterByPrice(0, 50);
        await searchPage.filterByEnglishLanguage()
        await searchPage.verifyEnglishLanguageFilterIsApplied()
        await searchPage.sortByLowestPrice()
        await searchPage.verifyPricesAreAscending(3)
        await ScreenshotHelper.takeScreenshot(page, 'filter-ascending-results');
});