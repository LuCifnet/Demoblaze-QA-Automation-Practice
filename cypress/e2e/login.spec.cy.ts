import loginPage from '../pages/LoginPage';

describe('Login Test', () => {
  beforeEach(() => {
    loginPage.visitHomePage();
  });

  it('TC_Login_001, Title: Valid Login', () => {
    loginPage.openLoginModal();
    loginPage.typeUsername(Cypress.env('DEFAULT_USER'));
    loginPage.typePassword(Cypress.env('DEFAULT_PASSWORD'));
    loginPage.clickLoginButton();
    loginPage.assertLoginSuccess(Cypress.env('DEFAULT_USER'));
  });

  it('TC_Login_002, Title: Invalid Password', () => {
    loginPage.openLoginModal();
    loginPage.typeUsername(Cypress.env('DEFAULT_USER'));
    loginPage.typePassword('wrongpass123');
    loginPage.stubAlert();
    loginPage.clickLoginButton();
    loginPage.assertAlertMessage('Wrong password.');
  });

  it('TC_Login_003, Title: Empty Username and Password Fields', () => {
    loginPage.openLoginModal();
    loginPage.typeUsername('');
    loginPage.typePassword('');
    loginPage.stubAlert();
    loginPage.clickLoginButton();
    loginPage.assertAlertMessage('Please fill out Username and Password.');
  });

  it('TC_Login_004, Title: SQL Injection Attempt in Username', () => {
    loginPage.openLoginModal();
    loginPage.typeUsername("' OR 1=1 --");
    loginPage.typePassword(Cypress.env('DEFAULT_PASSWORD'));
    loginPage.stubAlert();
    loginPage.clickLoginButton();
    loginPage.assertAlertMessage('Wrong password.');
  });

  it('TC_Login_005, Title: Login with Unregistered User', () => {
    loginPage.openLoginModal();
    loginPage.typeUsername(Cypress.env('FAKE_USER_USERNAME'));
    loginPage.typePassword(Cypress.env('FAKE_USER_PASSWORD'));
    loginPage.stubAlert();
    loginPage.clickLoginButton();
    loginPage.assertAlertMessage('User does not exist.');
  });

  it('TC_Login_006, Title: Username Case Sensitivity Check', () => {
    loginPage.openLoginModal();
    loginPage.typeUsername(Cypress.env('DEFAULT_USER').toUpperCase());
    loginPage.typePassword(Cypress.env('DEFAULT_PASSWORD'));
    loginPage.stubAlert();
    loginPage.clickLoginButton();
    loginPage.assertAlertMessage('User does not exist.');
  });

  it('TC_Login_007, Title: XSS Attempt in Username', () => {
    loginPage.openLoginModal();
    loginPage.failOnUnexpectedAlert();
    loginPage.typeUsername('<script>alert("XSS")</script>');
    loginPage.typePassword(Cypress.env('DEFAULT_PASSWORD'));
    loginPage.stubAlert();
    loginPage.clickLoginButton();
    loginPage.assertAlertMessage('Wrong password.');
  });
});
