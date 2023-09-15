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

        cy.logToTerminal('Page URL : ' + pageURL)

        cy.visit(pageURL)

        events.forEach(event => {
            cy.recreateUserAction(event)
        });

        // Use the projectKey or any other env variables in your tests
    });
});