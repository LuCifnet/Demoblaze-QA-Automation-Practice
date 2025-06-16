import homePage from '../pages/Homepage';

describe('Home Page Tests', () => {

    beforeEach(() => {
        cy.visitHomepage();
        homePage.verifyHomePageElement();
    });

    it('TC001 | Title: Verify Homepage Loads Correctly', () => {
        homePage.verifyHomePageElement();
    });

    it('TC002 | Title: Should display the product list and validate each item', () => {
        homePage.verifyAllProducts();
    });

    it('TC003 | Title: Should filter products by category and update product list accordingly', () => {
        homePage.clickCategoryAndVerifyListChanged('Laptops');
        homePage.clickCategoryAndVerifyListChanged('Monitors');
        homePage.clickCategoryAndVerifyListChanged('Phones');
    });
    it('TC004 | Title: Product Links Open Correct Page', () => {
        homePage.clickProductLinkOpenCorrectPage('Samsung galaxy s6');
    });

    it('TC005 | Title: Verify "Next" Button Functionality', () => {
        homePage.checkNextButtonWork();
    });
    it('TC006 | Title: Verify "Previous" Button Functionality', () => {
        homePage.checkPrevButtonWork();
    });
    it('TC007 | Title: Verify Hero Image Loads on Homepage', () =>{
        homePage.verifyHeroImage();
    })
    it('TC008 | Title: Verify Next Button in Hero Carousel ', ()=>{
        homePage.verifyCarouselNextButton()
    })
    it('TC009 | Title: Verify Prev Button in Hero Carousel ', ()=>{
        homePage.verifyCarouselPrevButton()
    })
    
    it('TC010 | Title: Homepage Refresh Preserves State', ()=>{
        homePage.verifyCategoryNotPreservedAfterRefresh();
    })
    it.only('TC011 | Title: Add Product', () =>{
        homePage.addProductsInCart('Samsung galaxy s6')
    })
    


});
