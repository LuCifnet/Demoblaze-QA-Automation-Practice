import loginPage from '../pages/LoginPage';
import { credentials } from '../support/credential';

describe('Login Test', () => {
  // This runs before each test to ensure the home page is loaded fresh
  beforeEach(() => {
    loginPage.visitHomePage();
  });

  it('TC_Login_001, Title: Valid Login', () => {
    // ✅ Test successful login with valid username and password
    loginPage.openLoginModal();
    loginPage.typeUsername(credentials.username);
    loginPage.typePassword(credentials.password);
    loginPage.clickLoginButton();
    loginPage.assertLoginSuccess(credentials.username);
  });

  it('TC_Login_002, Title: Invalid Password', () => {
    // ❌ Test login with valid username but incorrect password
    loginPage.openLoginModal();
    loginPage.typeUsername(credentials.username);
    loginPage.typePassword('wrongpass123');
    loginPage.stubAlert(); // Stub browser alert before clicking
    loginPage.clickLoginButton();
    loginPage.assertAlertMessage('Wrong password.');
  });

  it('TC_Login_003, Title: Empty Username and Password Fields', () => {
    // ⚠️ Test login with both username and password fields left blank
    loginPage.openLoginModal();
    loginPage.typeUsername('');
    loginPage.typePassword('');
    loginPage.stubAlert();
    loginPage.clickLoginButton();
    loginPage.assertAlertMessage('Please fill out Username and Password.');
  });

  it('TC_Login_004, Title: SQL Injection Attempt in Username', () => {
    // 🔐 Test login attempt using SQL Injection in username field
    loginPage.openLoginModal();
    loginPage.typeUsername("' OR 1=1 --");
    loginPage.typePassword(credentials.password);
    loginPage.stubAlert();
    loginPage.clickLoginButton();
    loginPage.assertAlertMessage('Wrong password.');
  });

  it('TC_Login_005, Title: Login with Unregistered User', () => {
    // ❌ Test login with a username that is not registered
    loginPage.openLoginModal();
    loginPage.typeUsername(credentials.fakeUser.username);
    loginPage.typePassword(credentials.fakeUser.password);
    loginPage.stubAlert();
    loginPage.clickLoginButton();
    loginPage.assertAlertMessage('User does not exist.');
  });

  it('TC_Login_006, Title: Username Case Sensitivity Check', () => {
    loginPage.openLoginModal();
    // Using uppercase username should fail if system is case-sensitive
    loginPage.typeUsername('KAPILTEST123');
    loginPage.typePassword(credentials.password);
    loginPage.stubAlert();
    loginPage.clickLoginButton();
    loginPage.assertAlertMessage('User does not exist.');
  });

  it('TC_Login_007, Title: XSS Attempt in Username', () => {
    loginPage.openLoginModal();
    loginPage.failOnUnexpectedAlert(); // catch any unexpected alerts (XSS)
    loginPage.typeUsername('<script>alert("XSS")</script>');
    loginPage.typePassword(credentials.password);
    loginPage.stubAlert();
    loginPage.clickLoginButton();
    loginPage.assertAlertMessage('Wrong password.');
  });


});
