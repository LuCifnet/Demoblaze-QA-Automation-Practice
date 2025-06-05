export class LoginPage {
  // ====================
  // Selectors
  // ====================
  private readonly loginModalOpenButtonSelector = '#login2';
  private readonly usernameInputSelector = '#loginusername';
  private readonly passwordInputSelector = '#loginpassword';
  private readonly loginButtonSelector = 'button.btn.btn-primary';
  private readonly welcomeUserSelector = '#nameofuser';
  private readonly closeButtonSelector = 'button';
  private readonly loginModalSelector = '#logInModal';

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
    const input = cy.get(this.usernameInputSelector).clear();
    if (username) {
      input.type(username);
    }
  }

  typePassword(password: string): void {
    const input = cy.get(this.passwordInputSelector).clear();
    if (password) {
      input.type(password, { log: false });
    }
  }

  // ====================
  // Actions - Clicking
  // ====================
  clickLoginButton(): void {
    cy.get(this.loginButtonSelector).contains('Log in').click();
  }

  clickCloseButton(): void {
    cy.contains(this.closeButtonSelector, 'Close').click({ force: true });
  }




  // ====================
  // Modal Assertions
  // ====================
  assertLoginModalVisible(): void {
    cy.get(this.loginModalSelector).should('be.visible');
  }

  assertLoginModalClosed(): void {
    cy.get(this.loginModalSelector).should('not.be.visible');
    cy.url().should('eq', 'https://demoblaze.com/');
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
