import 'cypress-real-events';
import 'cypress-real-events/support';


export class HeaderSection {
    // Selectors
    private readonly logoSelector = '#nava';
    private readonly homeSelector = 'a.nav-link[href="index.html"]';
    private readonly contactSelector = 'a.nav-link[data-target="#exampleModal"]';
    private readonly aboutSelector = 'a.nav-link[data-target="#videoModal"]';
    private readonly cartSelector = '#cartur';
    private readonly loginSelector = 'a.nav-link[data-target="#logInModal"]';
    private readonly signupSelector = 'a.nav-link[data-target="#signInModal"]';
    private readonly navLinksSelector = 'a.nav-link';
    private readonly expectedHoverColor = 'rgb(33, 232, 203)';



    // Reusable generic checker
    private checkNavLink(selector: string, expectedText: string, label: string): void {
        cy.log(`Checking if ${label} navigation link is visible and correct`);
        cy.get(selector).should('contain.text', expectedText).and('be.visible');
    }

    // One combined method to check all
    verifyAllNavLinks(): void {
        this.checkNavLink(this.logoSelector, 'PRODUCT STORE', 'Logo');
        this.checkNavLink(this.homeSelector, 'Home', 'Home');
        this.checkNavLink(this.contactSelector, 'Contact', 'Contact');
        this.checkNavLink(this.aboutSelector, 'About us', 'About Us');
        this.checkNavLink(this.cartSelector, 'Cart', 'Cart');
        this.checkNavLink(this.loginSelector, 'Log in', 'Login');
        this.checkNavLink(this.signupSelector, 'Sign up', 'Signup');
    }

    verifyAllNavLinksFunctionality(): void {
        cy.log('Checking Home link functionality');
        cy.get(this.homeSelector).click();
        cy.url().should('include', 'index.html');

        cy.log('Checking Contact link functionality');
        cy.get(this.contactSelector).click();
        cy.get('#exampleModal').should('have.class', 'show').and('be.visible');
        cy.wait(300);
        cy.get('#exampleModal').find('button').contains('Close').click({ force: true });
        cy.get('#exampleModal').should('not.be.visible');

        cy.log('Checking About Us link functionality');
        cy.get(this.aboutSelector).click();
        cy.get('#videoModal').should('have.class', 'show').and('be.visible');
        cy.wait(500);
        cy.get('#videoModal .modal-footer button').contains('Close').click({ force: true });
        cy.get('#videoModal').should('not.be.visible');

        cy.log('Checking Cart link functionality');
        cy.get(this.cartSelector).click({ force: true }); // Now it's safe to force-click
        cy.url().should('include', 'cart.html');
        cy.go('back');

        cy.log('Checking Log in link functionality');
        cy.get(this.loginSelector).click();
        cy.get('#logInModal').should('have.class', 'show').and('be.visible');
        cy.wait(300);
        cy.get('#logInModal').find('button').contains('Close').click({ force: true });
        cy.get('#logInModal').should('not.be.visible');

        cy.log('Checking Sign up link functionality');
        cy.get(this.signupSelector).click();
        cy.get('#signInModal').should('have.class', 'show').and('be.visible');
        cy.wait(300);
        cy.get('#signInModal').find('button').contains('Close').click({ force: true });
        cy.get('#signInModal').should('not.be.visible');
    }

    //     verifyContact(): void {
    //     cy.log('Checking Contact link functionality');

    //     // Click contact link to open modal
    //     cy.get(this.contactSelector).click();

    //     // Check modal is visible and has 'show' class
    //     cy.get('#exampleModal').should('have.class', 'show').and('be.visible');

    //     // Assert modal title is visible and contains text "Contact"
    //     cy.get('#exampleModal').find('.modal-title').should('be.visible').and('contain.text', 'New message');

    //     // Example: Assert input fields are visible (update selectors as needed)
    //     cy.get('#exampleModal').find('input#recipient-email').should('be.visible');
    //     cy.get('#exampleModal').find('textarea#message-text').should('be.visible');

    //     // Assert buttons are visible and have correct labels
    //     cy.get('#exampleModal').find('button').contains('Close').should('be.visible');
    //     cy.get('#exampleModal').find('button').contains('Send message').should('be.visible');

    //     // Optionally assert placeholders or labels for inputs if needed
    //     cy.get('#exampleModal').find('label[for="recipient-name"]').should('contain.text', 'Email');
    //     cy.get('#exampleModal').find('label[for="message-text"]').should('contain.text', 'Message');

    //     // Close the modal forcibly
    //     cy.wait(300);
    //     cy.get('#exampleModal').find('button').contains('Close').click({ force: true });
    //     cy.get('#exampleModal').should('not.be.visible');
    // }

    verifyNavLinkHoverEffects(): void {
        cy.get(this.navLinksSelector)
            .filter(':visible') // only test visible links
            .each(($link) => {
                cy.wrap($link).realHover();
                cy.wait(100); // small delay to allow hover effect to apply
                cy.wrap($link).should('have.css', 'color', this.expectedHoverColor);
            });
    }


}
export default new HeaderSection();
