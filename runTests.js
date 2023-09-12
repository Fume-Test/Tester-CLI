const cypress = require('cypress');

function runTests(url, projectKey, timeout, user) {

    // Configure Cypress with the provided options
    const cypressOptions = {
        config: {
            baseUrl: url,
            // Any other configuration options you'd like to set
        },
        env: {
            projectKey: projectKey
        },
        headless: true,  // Run tests in headless mode
        browser: 'chrome'  // Specify the browser
    };

    // Run Cypress tests
    cypress.run(cypressOptions)
        .then((results) => {
            //console.log(results);
        })
        .catch((err) => {
            console.error('Error running Cypress tests:', err);
        });
}

module.exports = { runTests };
