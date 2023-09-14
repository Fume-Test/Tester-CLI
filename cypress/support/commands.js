// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

require('cypress-xpath');

Cypress.Commands.add('findTarget', (xpath, tagName, id = null, innerHTML = null, placeholder = null) => {
    // If an ID is provided, try to locate the element by ID first
    if (id) {
        cy.get(`#${id}`).then($el => {
            if ($el.length) return $el;
        });
    }

    // If the element wasn't found by ID, use the provided XPath
    cy.xpath(xpath).then($elements => {
        // If there's only one match, return it
        if ($elements.length === 1) {
            return $elements[0];
        }
        // If there's more than one match, filter by innerHTML or placeholder
        else if ($elements.length > 1) {
            if (tagName === 'input' && placeholder) {
                // For input elements, filter by placeholder
                $elements = $elements.filter((index, el) => {
                    return el.getAttribute('placeholder') === placeholder;
                });
            } else if (innerHTML) {
                // For other elements, filter by innerHTML
                $elements = $elements.filter((index, el) => {
                    return el.innerHTML === innerHTML;
                });
            }

            // After filtering, if there's at least one match, return it
            if ($elements.length) return $elements[0];
        }
    });

    // If the element wasn't found by any method, return null
    return null;
});

Cypress.Commands.add('recreateUserAction', (userEvent) => {
    // Extract the required details from the user event object
    const { eventType, detail } = userEvent;
    const { id, xPath, tag_name, inner_HTML, placeholder, value } = detail;

    // Locate the target element using the findTarget command
    cy.findTarget(xPath, tag_name, id, inner_HTML, placeholder).then($el => {
        // Check if the element is found
        if ($el) {
            switch (eventType) {
                case 'focusout':
                    $el.trigger('focusout');
                    break;
                case 'input':
                    // For input events, update the value first and then trigger the event
                    $el.val(value).trigger('input');
                    break;
                case 'wheel':
                    // Trigger the wheel event
                    $el.trigger('wheel');
                    break;
                case 'click':
                    // Trigger the click event
                    $el.click();
                    break;
                case 'dblclick':
                    // Trigger the double-click event
                    $el.dblclick();
                    break;
                default:
                    cy.log(`Unknown event type: ${eventType}`);
            }
        } else {
            cy.log('Element not found');
        }
    });
});

Cypress.Commands.add('logToTerminal', (message) => {
    cy.task('logMessage', message);
});