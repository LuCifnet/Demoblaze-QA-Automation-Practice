export class LoginPage {
  // ====================
  // Selectors
  // ====================
  private readonly loginModalOpenButtonSelector = '#login2';
  private readonly usernameInputSelector = '#loginusername';
  private readonly passwordInputSelector = '#loginpassword';
  private readonly loginButtonSelector = 'button.btn.btn-primary';
  private readonly welcomeUserSelector = '#nameofuser';

  // ====================
  // Navigation
  // ====================
  visitHomePage(): void {
    cy.visit('/');
  }

  openLoginModal(): void {
    cy.get(this.loginModalOpenButtonSelector).click();
  }

  // ====================
  // Actions - Typing
  // ====================
  typeUsername(username: string): void {
    if (username) {
      cy.get(this.usernameInputSelector)
        .clear()
        .type(username); // Add { log: false } to hide in logs if needed
    } else {
      cy.get(this.usernameInputSelector).clear();
    }
  }

  typePassword(password: string): void {
    if (password) {
      cy.get(this.passwordInputSelector)
        .clear()
        .type(password, { log: false }); // Hides password from Cypress logs
    } else {
      cy.get(this.passwordInputSelector).clear();
    }
  }

  // ====================
  // Actions - Click
  // ====================
  clickLoginButton(): void {
    cy.get(this.loginButtonSelector).contains('Log in').click();
  }

  // ====================
  // Alert Handling
  // ====================
  stubAlert(): void {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });
  }

  assertAlertMessage(expectedMessage: string): void {
    cy.get('@alert').should('have.been.calledWith', expectedMessage);
  }

  failOnUnexpectedAlert(): void {
    cy.on('window:alert', (message) => {
      throw new Error(`Unexpected alert detected: ${message}`);
    });
  }

  // ====================
  // Assertions
  // ====================
  assertLoginSuccess(username: string): void {
    cy.get(this.welcomeUserSelector, { timeout: 4000 })
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.contain(`Welcome ${username}`);
      });
  }
}

export default new LoginPage();
