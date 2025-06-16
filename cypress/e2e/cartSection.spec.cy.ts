import cartSection from '../support/pages/CartSection'
import Homepage from '../support/pages/Homepage';

describe('Add Cart Test', () => {
    beforeEach(() => {
        cy.visitHomepage();
        Homepage.verifyAllProducts();
    })

    it('TC 001 | Title: Cart Button is working or not', () => {
        cartSection.clickCartNav()
    })

    it('TC 002 | Title: Verify the page show correct information', () => {
        cartSection.checkCartSection([]);
    })
    it('TC 003 | Title: Verify the product details showing correct information or not', () => {
        const products = [
            { title: 'Samsung galaxy s6', price: 360 },
            { title: 'Nokia lumia 1520', price: 820 }
        ];

        products.forEach((product) => {
            Homepage.addProductsInCart(product.title);
        });

        cartSection.clickCartNav();
        cartSection.checkCartSection(products);
    })
})