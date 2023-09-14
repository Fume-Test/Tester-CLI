const cypress = require('cypress');
const Project = require('./api/project.js')

async function runTests(url, projectKey, timeout, user) {

    var project = new Project(projectKey, user.token)
    project.getSessions().then(async result => {
        for (let e = 0; e < project.sessions.length; e++) {
            var session = project.sessions[e]
            await session.getEvents()
            var cypressOptions = {
                config: {
                    baseUrl: url,
                },
                env: {
                    session: project.sessions[e]
                },
                headless: true,  // Run tests in headless mode
                browser: 'chrome'  // Specify the browser
            };

            // Run Cypress tests
            await cypress.run(cypressOptions)
                .then((results) => {
                    //console.log(results);
                })
                .catch((err) => {
                    console.error('Error running Cypress tests:', err);
                    throw err
                });
        }
    }).catch(error => {
        throw error
    });


}

module.exports = { runTests };
