import signupPage from '../support/pages/SignupPage';

describe('Signup Test Suite', () => {
    beforeEach(() => {
        cy.visitHomepage();
        signupPage.openSignupModal();
        signupPage.stubAlert();
        signupPage.failOnUnexpectedAlert();
    });

    it('TC_Signup_001 | Title: Valid Sign-Up', () => {
        signupPage.fillSignupForm();
        signupPage.clickSignupButton();
        signupPage.assertAlertMessage('Sign up successful.');
    });

    it('TC_Signup_002 | Title: Sign-Up with Long Username/Password', () => {
        signupPage.generateLongCreds();
        const { username, password } = signupPage.getCredentials();
        signupPage.fillSignupForm(username, password);
        signupPage.clickSignupButton();
        signupPage.assertAlertMessage('Sign up successful.');
    });

    it('TC_Signup_003 | Title: Sign-Up with Empty Fields', () => {
        signupPage.fillSignupForm('', '');
        signupPage.clickSignupButton();
        signupPage.assertAlertMessage('Please fill out Username and Password.');
    });

    it('TC_Signup_004 | Title: Sign-Up with Incomplete Fields', () => {
        signupPage.fillSignupForm('incompleteUser', '');
        signupPage.clickSignupButton();
        signupPage.assertAlertMessage('Please fill out Username and Password.');
    });

    it('TC_Signup_005 | Title: Sign-Up with Only Spaces in Username', () => {
        // This may fail if the app incorrectly accepts space-only usernames
        signupPage.randomCred();
        const { username, password } = signupPage.getCredentials();
        signupPage.fillSignupForm(username, password);
        signupPage.clickSignupButton();
        signupPage.assertAlertMessage('Sign up successful.');
    });

    it('TC_Signup_006 | Title: Sign-Up with Script Injection in Username Field', () => {
        signupPage.generateXssCred();
        const { username, password } = signupPage.getCredentials();
        signupPage.fillSignupForm(username, password);
        signupPage.clickSignupButton();
        signupPage.assertAlertMessage('Sign up successful.');
    });

    it('TC_Signup_007 | Title: Sign-Up with Special Characters in Username', () => {
        signupPage.specialChar();
        const { username, password } = signupPage.getCredentials();
        signupPage.fillSignupForm(username, password);
        signupPage.clickSignupButton();
        signupPage.assertAlertMessage('Sign up successful.');
    });

    it('TC_Signup_008 | Title: Sign-Up with Duplicate Username', () => {
        signupPage.fillSignupForm(
            Cypress.env('DEFAULT_USER'),
            Cypress.env('DEFAULT_PASSWORD')
        );
        signupPage.clickSignupButton();
        signupPage.assertAlertMessage('This user already exist.');
    });

    it('TC_Signup_009 | Title: Refresh Page Midway During Sign-Up', () => {

        // Fill the signup form with env credentials
        signupPage.fillSignupForm(
            Cypress.env('DEFAULT_USER'),
            Cypress.env('DEFAULT_PASSWORD')
        );

        // Assert the form fields have the entered credentials
        signupPage.assertSignupFields(
            Cypress.env('DEFAULT_USER'),
            Cypress.env('DEFAULT_PASSWORD')
        );
        cy.reload();
        cy.wait(1000);
        // After reload, open the signup modal again
        signupPage.openSignupModal();

        // Assert that the signup form fields are cleared after reload
        signupPage.assertSignupFields('', '');
    });

});
