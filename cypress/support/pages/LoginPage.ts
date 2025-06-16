import { assertHelpers } from "../helpers/assertHelpers";

export class LoginPage {
  private readonly loginModalOpenButtonSelector = '#login2';
  private readonly usernameInputSelector = '#loginusername';
  private readonly passwordInputSelector = '#loginpassword';
  private readonly loginButtonSelector = 'button.btn.btn-primary';
  private readonly welcomeUserSelector = '#nameofuser';
  private readonly closeButtonSelector = 'button';
  private readonly loginModalSelector = '#logInModal';

  openLoginModal(): void {
    cy.get(this.loginModalOpenButtonSelector).click();
  }

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

  clickLoginButton(): void {
    cy.get(this.loginButtonSelector).contains('Log in').click();
  }

  clickCloseButton(): void {
    cy.contains(this.closeButtonSelector, 'Close').click({ force: true });
  }

  assertLoginModalVisible(): void {
    cy.get(this.loginModalSelector).should('be.visible');
  }

  assertLoginModalClosed(): void {
    cy.get(this.loginModalSelector).should('not.be.visible');
    cy.url().should('eq', 'https://demoblaze.com/');
  }

  assertLoginSuccess(username: string): void {
    cy.get(this.welcomeUserSelector, { timeout: 4000 })
      .should('be.visible')
      .invoke('text')
      .then(text => {
        expect(text.trim()).to.contain(`Welcome ${username}`);
      });
  }

  loginWithCredentials(username: string, password: string): void {
    this.typeUsername(username);
    this.typePassword(password);
    this.clickLoginButton();
  }

  loginExpectSuccess(): void {
    this.loginWithCredentials(Cypress.env('DEFAULT_USER'), Cypress.env('DEFAULT_PASSWORD'));
    assertHelpers.assertWelcomeMessage(Cypress.env('DEFAULT_USER'));
  }

  loginExpectFailure(username: string, password: string, alertMessage: string): void {
    assertHelpers.stubAlert();
    this.loginWithCredentials(username, password);
    assertHelpers.assertAlertMessage(alertMessage);
  }
}

export default new LoginPage();
