import loginPage from '../support/pages/LoginPage';
import { assertHelpers } from '../support/helpers/assertHelpers';

describe('Login Test', () => {
  beforeEach(() => {
    cy.visitHomepage();
    loginPage.openLoginModal();
  });

  it('TC_Login_001, Title: Valid Login', () => {
    loginPage.loginExpectSuccess();
  });

  it('TC_Login_002, Title: Invalid Password', () => {
    loginPage.loginExpectFailure(
      Cypress.env('DEFAULT_USER'),
      'wrongpass123',
      'Wrong password.'
    );
  });

  it('TC_Login_003, Title: Empty Username and Password Fields', () => {
    loginPage.loginExpectFailure('', '', 'Please fill out Username and Password.');
  });

  it('TC_Login_004, Title: SQL Injection Attempt in Username', () => {
    loginPage.loginExpectFailure("' OR 1=1 --", Cypress.env('DEFAULT_PASSWORD'), 'Wrong password.');
  });

  it('TC_Login_005, Title: Login with Unregistered User', () => {
    loginPage.loginExpectFailure(
      Cypress.env('FAKE_USER_USERNAME'),
      Cypress.env('FAKE_USER_PASSWORD'),
      'User does not exist.'
    );
  });

  it('TC_Login_006, Title: Username Case Sensitivity Check', () => {
    loginPage.loginExpectFailure(
      Cypress.env('DEFAULT_USER').toUpperCase(),
      Cypress.env('DEFAULT_PASSWORD'),
      'User does not exist.'
    );
  });

  it('TC_Login_007, Title: XSS Attempt in Username', () => {
    assertHelpers.failOnUnexpectedAlert(); // Ensure test fails if XSS alert pops
    loginPage.loginExpectFailure('<script>alert("XSS")</script>', Cypress.env('DEFAULT_PASSWORD'), 'Wrong password.');
  });

  it('TC_Login_008, Title: Close Button should close the modal', () => {
    loginPage.clickCloseButton();
    loginPage.assertLoginModalClosed();
  });
});
