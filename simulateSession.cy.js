const Session = require("./api/session");
require('cypress-xpath');
require('cypress-wait-until');

require('cypress-xpath');
require('cypress-wait-until');

Cypress.Commands.add('findTarget', (criteria) => {
    return cy.document().then((doc) => {
        let maxScore = -1;
        let bestMatch = null;

        // Weights for each criterion
        const weights = {
            id: 5,
            xPath: 4,
            placeholder: 3,
            inner_HTML: 3,
            classes: 2,
            tag_name: 1
        };

        // Start with all elements or just the elements with the provided tag name
        let initialElements = criteria.tag_name ? doc.querySelectorAll(criteria.tag_name) : doc.querySelectorAll('*');

        initialElements.forEach((element) => {
            let score = 0;

            if (criteria.xpath && document.evaluate(criteria.xPath, doc, null, XPathResult.ANY_TYPE, null).iterateNext() === element) {
                score += weights.xPath;
            }
            if (criteria.id && element.id === criteria.id) {
                score += weights.id;
            }
            if (criteria.classes && element.classList.contains(criteria.classes)) {
                score += weights.classes;
            }
            if (criteria.inner_HTML && element.innerHTML.includes(criteria.inner_HTML)) {
                score += weights.inner_HTML;
            }
            if (criteria.placeholder && element.placeholder === criteria.placeholder) {
                score += weights.placeholder;
            }

            if (score > maxScore) {
                maxScore = score;
                bestMatch = element;
            }
        });

        if (bestMatch) {
            return cy.wrap(bestMatch);
        } else {
            return null
        }
    });
});

Cypress.Commands.add('recreateUserAction', (userEvent) => {
    // Extract the required details from the user event object
    const supportedActions = ['focusout', 'input', 'click', 'dbclick']

    const { eventType, detail } = userEvent;
    const { id, xPath, tag_name, inner_HTML, placeholder, value, classes } = detail;

    if (!supportedActions.includes(eventType)) {
        return
    }

    // Locate the target element using the findTarget command
    cy.findTarget({ xPath, tag_name, id, inner_HTML, placeholder, classes }).then($el => {
        // Check if the element is found
        if ($el) {
            switch (eventType) {
                case 'focusout':
                    // For input events, update the value first and then trigger the event
                    if ((tag_name === "INPUT" || tag_name === "TEXTAREA") && value) {
                        cy.wrap($el).clear();
                        cy.wrap($el).type(value, { delay: 100 });
                    }
                    break;
                case 'click':
                    // Trigger the click event
                    $el.click();
                    break;
                case 'dbclick':
                    // Trigger the double-click event
                    $el.dblclick();
                    break;
                default:
                    cy.log(`Unknown event type: ${eventType}`);
            }
            cy.wait(100)
        } else {
            cy.log('Element not found');
        }
    });
});

Cypress.Commands.add('logToTerminal', (message) => {
    cy.task('logMessage', message);
});

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
            cy.wait(500);
        });
    });
});