import { faker } from '@faker-js/faker';

export class SignupPage {
    // ========================
    // Selectors
    // ========================
    private readonly signupModalOpenButtonSelector = '#signin2';
    private readonly usernameInputSelector = '#sign-username';
    private readonly passwordInputSelector = '#sign-password';
    private readonly signupButtonSelector = 'button';
    private readonly welcomeUserSelector = '#nameofuser';

    // ========================
    // Stored Credentials
    // ========================
    private generatedCred: { username: string; password: string } = {
        username: '',
        password: '',
    };

    // ========================
    // Credential Generation
    // ========================

    /**
     * Generate fake username and password using faker
     */
    generateFakeCreds(): void {
        this.generatedCred.username = `${faker.internet.userName()}_${Date.now()}`;
        this.generatedCred.password = faker.internet.password({ length: 15 });
    }

    /**
     * Generate very long username and password for boundary testing
     */
    generateLongCreds(): void {
        const baseUsername = faker.internet.userName();
        const basePassword = faker.internet.password({ length: 10 });
        this.generatedCred.username = (baseUsername + '_').padEnd(105, 'x');
        this.generatedCred.password = (basePassword + '_').padEnd(254, 'w');
    }

    // ========================
    // Form Filling
    // ========================

    /**
     * Fill the signup form fields.
     * If username or password is undefined, generate fake credentials.
     * If empty strings are passed, clear inputs without typing.
     */
    fillSignupForm(username?: string, password?: string): void {
        if (username === undefined || password === undefined) {
            this.generateFakeCreds();
        }

        const finalUsername = username ?? this.generatedCred.username;
        const finalPassword = password ?? this.generatedCred.password;

        this.generatedCred.username = finalUsername;
        this.generatedCred.password = finalPassword;

        cy.get(this.usernameInputSelector).clear();
        if (finalUsername.length > 0) {
            cy.get(this.usernameInputSelector).type(finalUsername);
        }

        cy.get(this.passwordInputSelector).clear();
        if (finalPassword.length > 0) {
            cy.get(this.passwordInputSelector).type(finalPassword);
        }
    }

    randomCred(): void {
        const randomSpaces = ' '.repeat(70 + Math.floor(Math.random() * 20));
        const randomPassword = faker.internet.password({ length: 8, memorable: true });

        this.generatedCred.username = randomSpaces;
        this.generatedCred.password = randomPassword;
    }

    generateXssCred(): void {
        const timestamp = Date.now();
        const xssPayload = `<script>alert('XSS_${timestamp}')</script>`;
        const randomPassword = faker.internet.password({ length: 12 });

        this.generatedCred.username = xssPayload;
        this.generatedCred.password = randomPassword;
    }

    /**
     * Generate credentials with special characters in the username
     */
    specialChar(): void {
        // Example special characters
        const specialChars = "!@#$%^&*()_+-=[]{}|;':,.<>/?";
        const baseUsername = faker.internet.userName();
        // Insert special characters into the username
        const specialUsername = `${baseUsername}_${specialChars}`;
        const password = faker.internet.password({ length: 12 });

        this.generatedCred.username = specialUsername;
        this.generatedCred.password = password;
    }

    // ========================
    // Navigation
    // ========================

    /**
     * Visit the homepage
     */
    visitHomepage(): void {
        cy.visit('/');
    }

    /**
     * Open the signup modal and wait for username input to be visible
     */
    openSignupModal(): void {
        cy.get(this.signupModalOpenButtonSelector).click();
        cy.get(this.usernameInputSelector).should('be.visible');
    }

    // ========================
    // Click Actions
    // ========================

    /**
     * Click on the "Sign up" button
     */
    clickSignupButton(): void {
        cy.contains(this.signupButtonSelector, 'Sign up').click();
    }

    // ========================
    // Alert Handling
    // ========================

    /**
     * Stub the window alert to spy on alert messages
     */
    stubAlert(): void {
        cy.window().then((win) => {
            cy.stub(win, 'alert').as('alert');
        });
    }

    /**
     * Assert alert message is as expected
     * @param expectedMessage expected alert message text
     */
    assertAlertMessage(expectedMessage: string): void {
        cy.get('@alert').should('have.been.calledWith', expectedMessage);
    }

    // ========================
    // Assertions
    // ========================

    /**
     * Assert that signup was successful by checking welcome text
     */
    assertSignupSuccess(): void {
        cy.get(this.welcomeUserSelector, { timeout: 4000 })
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                expect(text.trim()).to.contain(`Welcome ${this.generatedCred.username}`);
            });
    }

    /**
 * Assert the current value of the signup form fields
 * @param expectedUsername Expected username input value
 * @param expectedPassword Expected password input value
 */
    assertSignupFields(expectedUsername: string, expectedPassword: string): void {
        cy.get(this.usernameInputSelector).should('have.value', expectedUsername);
        cy.get(this.passwordInputSelector).should('have.value', expectedPassword);
    }


    // ========================
    // Utilities
    // ========================

    /**
     * Get the currently generated credentials for external use
     */
    getCredentials(): { username: string; password: string } {
        return this.generatedCred;
    }

    failOnUnexpectedAlert(): void {
        cy.on('window:alert', (message) => {
            throw new Error(`Unexpected alert detected: ${message}`);
        });
    }

}

export default new SignupPage();
