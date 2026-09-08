import { test } from '@playwright/test';
import { SearchPage } from "../pages/SearchPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import {ScreenshotHelper} from "../helpers/ScreenshotHelper";


test('QA-3 Verify that the product detail page displays the required product information and safely handles add to cart', async ({ page }) => {
    const searchPage = new SearchPage(page);

    await searchPage.open('Yu-gi-oh');
    const { productPage, productTitle, productUrl} = await searchPage.openProductInNewTab(0);
    const productDetailPage = new ProductDetailPage(productPage);
    await productDetailPage.verifyPageIsLoaded(productTitle, productUrl);
    await productDetailPage.verifyProductInformationIsVisible()
    await ScreenshotHelper.takeScreenshot(productPage, 'pdp-before-add-to-cart');
    await productDetailPage.clickAddToCartSafely();
    await ScreenshotHelper.takeScreenshot(productPage, 'pdp-after-add-to-cart');
});