import { SignupPage } from "../pages/SignupPage";

export const assertHelpers = {
    assertWelcomeMessage(expectedUsername: string): void {
        const signupPage = new SignupPage();
        cy.get(signupPage.getWelcomeUserSelector(), { timeout: 4000 })
          .should('be.visible')
          .invoke('text')
          .then(text => {
            expect(text.trim()).to.contain(`Welcome ${expectedUsername}`);
          });
    },

    assertInputValue(selector: string, expectedValue: string): void {
        cy.get(selector).should('have.value', expectedValue);
    },

    stubAlert(): void {
        cy.window().then(win => {
            cy.stub(win, 'alert').as('alert');
        });
    },

    assertAlertMessage(expectedMessage: string): void {
        cy.get('@alert').should('have.been.calledWith', expectedMessage);
    },

    failOnUnexpectedAlert(): void {
        cy.on('window:alert', (message) => {
            throw new Error(`Unexpected alert detected: ${message}`);
        });
    }
};
