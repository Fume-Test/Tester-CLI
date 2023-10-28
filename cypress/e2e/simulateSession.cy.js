const ActionLog = require("../../api/actionLog");
const Session = require("../../api/session");
require('cypress-xpath');

describe('Fume Test Suite', () => {
    const session_string = Cypress.env('session')
    const baseURL = Cypress.env('baseURL')
    const caseID = Cypress.env('caseID')
    const authToken = Cypress.env('authToken')
    const projectKey = Cypress.env('projectKey')
    const session = JSON.parse(session_string)
    const cookies = session.cookies.split("; ");
    const localStorage = session.localStorage;
    const events = session.events

    const pageURL = baseURL + events[0].detail.pathname + '?tracker_ignore=true&case_id=' + caseID

    it('My Test Case', () => {
        cy.visit(pageURL)

        // Iterate over each cookie and set it
        cookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        cy.setCookie(name, value);
        });

        cy.window().then((win) => {
            // Clear existing localStorage
            win.localStorage.clear();

            // Iterate over the object's keys and set each key-value pair in localStorage
            Object.keys(localStorage).forEach(key => {
                win.localStorage.setItem(key, localStorage[key]);
            });
        });

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
            let actionLog = new ActionLog(caseID, event.id, projectKey, authToken)
            cy.recreateUserAction(event);
            actionLog.save()
            cy.wait(250);
        });
    });
});