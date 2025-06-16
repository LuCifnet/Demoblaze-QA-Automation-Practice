
import Homepage from "./Homepage";
export class CartSection {
    private readonly cartSelector = '#cartur';


    clickCartNav(): void {
        cy.log('Checking Cart link functionality');
        cy.get(this.cartSelector).click({ force: true });
        cy.url().should('include', 'cart.html');
    }

    checkCartSection(products: { title: string; price: number; }[]): void {
        this.clickCartNav()
        cy.log('Checking Cart Section when no products are added');

        cy.get('#tbodyid tr').should('have.length', 0);

        cy.get('#totalp').should('have.text', '');

        cy.contains('button', 'Place Order')
            .should('be.visible')
            .and('not.be.disabled');
    }

    checkCartSectionAfterProductAdd(expectedItems: { title: string; price: number }[]): void {
    cy.log('Checking Cart Section with multiple products');

    // Ensure cart rows match expected item count
    cy.get('#tbodyid tr').should('have.length', expectedItems.length);

    // Check each product title and price
    expectedItems.forEach((item, index) => {
        cy.get(`#tbodyid tr:nth-child(${index + 1}) td:nth-child(2)`)
          .should('contain.text', item.title);

        cy.get(`#tbodyid tr:nth-child(${index + 1}) td:nth-child(3)`)
          .should('contain.text', item.price.toString());

        cy.get(`#tbodyid tr:nth-child(${index + 1}) td:nth-child(4) a`)
          .should('contain.text', 'Delete');
    });

    // Calculate and assert total price
    const expectedTotal = expectedItems.reduce((sum, item) => sum + item.price, 0);
    cy.get('#totalp').should('contain.text', expectedTotal.toString());

    // Check Place Order button
    cy.contains('button', 'Place Order')
      .should('be.visible')
      .and('not.be.disabled');
}


    








}

export default new CartSection;