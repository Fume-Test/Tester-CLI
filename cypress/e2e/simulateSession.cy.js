const Session = require("../../api/session");
require('cypress-xpath');

describe('My Test Suite', () => {
    const session_string = Cypress.env('session')
    const baseURL = Cypress.env('baseURL')
    const caseID = Cypress.env('caseID')
    const session = JSON.parse(session_string)
    const events = session.events

    const pageURL = baseURL + events[0].detail.pathname + '?tracker_ignore=true&case_id=' + caseID

    it('My Test Case', () => {
        cy.visit(pageURL)

        cy.waitUntil(() =>
            cy.getCookie('test-ready').then(cookie => {
                return cookie && cookie.value === "true";  // Adjust according to the expected value of the cookie
            }),
            {
                interval: 500,  // Poll every 500ms
                timeout: 120000  // Wait up to 10 seconds for the condition to be true
            }
        ).then((result) => {
            if (!result) {
                throw new Error("Cookie 'test-ready' did not become true within the specified timeout");
            }
            cy.reload();
        });

        events.forEach(event => {
            cy.recreateUserAction(event);
            cy.wait(250)
        });
    });
});