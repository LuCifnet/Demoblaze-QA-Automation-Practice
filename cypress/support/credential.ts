export const credentials = {
  username: Cypress.env('DEFAULT_USER'),
  password: Cypress.env('DEFAULT_PASSWORD'),

  // Fake (unregistered) user for negative test cases
  fakeUser: {
    username: 'unknownUser123',
    password: 'abc123!@#'
  }
};
