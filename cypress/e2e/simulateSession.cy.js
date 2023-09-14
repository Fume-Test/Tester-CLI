const Session = require("../../api/session");

describe('My Test Suite', () => {
    const session = Cypress.env('session')

    it('My Test Case', () => {
        cy.logToTerminal(`Session value: ${session.events}`);

        // Use the projectKey or any other env variables in your tests
    });
});