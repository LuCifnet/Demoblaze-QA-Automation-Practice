import { credGenerator, Creds } from '../helpers/credGenerator';
import { assertHelpers } from '../helpers/assertHelpers';

export class SignupPage {
    // Selectors
    private readonly signupModalOpenButtonSelector = '#signin2';
    private readonly usernameInputSelector = '#sign-username';
    private readonly passwordInputSelector = '#sign-password';
    private readonly signupButtonSelector = 'button';
    private readonly welcomeUserSelector = '#nameofuser';

    // Stored credentials
    private generatedCred: Creds = { username: '', password: '' };

    // Public getter methods
    public getWelcomeUserSelector(): string {
        return this.welcomeUserSelector;
    }
    public getUsernameInputSelector(): string {
        return this.usernameInputSelector;
    }
    public getPasswordInputSelector(): string {
        return this.passwordInputSelector;
    }
    public getSignupButtonSelector(): string {
        return this.signupButtonSelector;
    }
    public getSignupModalOpenButtonSelector(): string {
        return this.signupModalOpenButtonSelector;
    }

    // Credential generators
    generateFakeCreds(): void {
        this.generatedCred = credGenerator.generateFakeCreds();
    }
    generateLongCreds(): void {
        this.generatedCred = credGenerator.generateLongCreds();
    }
    specialChar(): void {
        this.generatedCred = credGenerator.generateSpecialCharCreds();
    }
    randomCred(): void {
        this.generatedCred = credGenerator.generateRandomSpaceCreds();
    }
    generateXssCred(): void {
        this.generatedCred = credGenerator.generateXssCreds();
    }

    // Navigation & Modal
    openSignupModal(): void {
        // Click the button to open the signup modal forcibly (handles overlays or disabled states)
        cy.get(this.signupModalOpenButtonSelector).click();

        // Ensure the modal is visible and inputs are ready
        cy.get('#signInModal')
            .should('have.class', 'show')
            .and('be.visible');

        cy.get(this.usernameInputSelector).should('be.visible').and('not.be.disabled');
        cy.get(this.passwordInputSelector).should('be.visible').and('not.be.disabled');
    }

    // Form Interaction
    fillSignupForm(username?: string, password?: string): void {
        if (username == null || password == null) {  // covers undefined and null
            this.generateFakeCreds();
        }

        const finalUsername = username != null ? username : this.generatedCred.username;
        const finalPassword = password != null ? password : this.generatedCred.password;

        this.generatedCred = { username: finalUsername, password: finalPassword };

        // Handle username input: clear first
        cy.get(this.usernameInputSelector)
            .should('be.visible')
            .and('not.be.disabled')
            .clear({ force: true });

        // Type or set empty value safely
        if (finalUsername.length > 0) {
            cy.get(this.usernameInputSelector).type(finalUsername, { force: true });
        } else {
            cy.get(this.usernameInputSelector).invoke('val', '');
        }

        // Handle password input: clear first
        cy.get(this.passwordInputSelector)
            .should('be.visible')
            .and('not.be.disabled')
            .clear({ force: true });

        if (finalPassword.length > 0) {
            cy.get(this.passwordInputSelector).type(finalPassword, { force: true });
        } else {
            cy.get(this.passwordInputSelector).invoke('val', '');
        }
    }

    clickSignupButton(): void {
        cy.contains(this.signupButtonSelector, 'Sign up').click({ force: true });
    }

    // Assertions
    assertSignupSuccess(): void {
        assertHelpers.assertWelcomeMessage(this.generatedCred.username);
    }
    assertSignupFields(expectedUsername: string, expectedPassword: string): void {
        assertHelpers.assertInputValue(this.usernameInputSelector, expectedUsername);
        assertHelpers.assertInputValue(this.passwordInputSelector, expectedPassword);
    }
    stubAlert(): void {
        assertHelpers.stubAlert();
    }
    assertAlertMessage(expectedMessage: string): void {
        assertHelpers.assertAlertMessage(expectedMessage);
    }
    failOnUnexpectedAlert(): void {
        assertHelpers.failOnUnexpectedAlert();
    }

    // Utility
    getCredentials(): Creds {
        return this.generatedCred;
    }
}

export default new SignupPage();
