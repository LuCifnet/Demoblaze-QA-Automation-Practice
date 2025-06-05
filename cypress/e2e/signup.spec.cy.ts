
import signupPage from '../pages/SignupPage';

describe('Signup Test Suite', () => {
    beforeEach(() => {
        signupPage.visitHomepage();
        signupPage.openSignupModal();
        signupPage.stubAlert();
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
    })

    it('TC_Signup_005 | Title: Sign-Up with Only Spaces in Username', () => {
        signupPage.randomCred(); // Generates username with only spaces and random password
        const { username, password } = signupPage.getCredentials();

        signupPage.fillSignupForm(username, password);
        signupPage.clickSignupButton();

        signupPage.assertAlertMessage('Sign up successful.');
    });

    it('TC_Signup_006 | Title: Sign-Up with Script Injection in Username Field', () => {
        signupPage.generateXssCred(); // generate unique XSS username
        const { username, password } = signupPage.getCredentials();

        signupPage.fillSignupForm(username, password);
        signupPage.clickSignupButton();
        signupPage.assertAlertMessage('Sign up successful.');
        signupPage.failOnUnexpectedAlert();
    });

    it('TC_Signup_007 | Title: Sign-Up with Special Characters in Username', () => {
        signupPage.specialChar();
        const { username, password } = signupPage.getCredentials();

        signupPage.fillSignupForm(username, password);
        signupPage.clickSignupButton();
        signupPage.assertAlertMessage('Sign up successful.')
    })

    it('TC_Signup_008 | Title: Sign-Up with Duplicate Username', () => {
        signupPage.fillSignupForm(
            Cypress.env('DEFAULT_USER')
        );
        signupPage.clickSignupButton();
        signupPage.assertAlertMessage('This user already exist.');
    })

    it.only('TC_Signup_012 | Refresh Page Midway During Sign-Up', () => {
        signupPage.visitHomepage();

        signupPage.openSignupModal();

         signupPage.fillSignupForm(
            Cypress.env('DEFAULT_USER'),
            Cypress.env('DEFAULT_PASSWORD')
        );

        signupPage.assertSignupFields( 
            Cypress.env('DEFAULT_USER'),
            Cypress.env('DEFAULT_PASSWORD')
        );

        cy.reload();

  
        signupPage.openSignupModal();

        signupPage.assertSignupFields('', '');
    });




});
