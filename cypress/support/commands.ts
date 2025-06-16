export {}; 

declare global {
  namespace Cypress {
    interface Chainable {
      visitHomepage(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('visitHomepage', () => {
  cy.visit('/');
});