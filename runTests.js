const cypress = require('cypress');
const Project = require('./api/project.js')

async function runTests(url, projectKey, timeout, user) {

    var project = new Project(projectKey, user.token)
    await project.addTestGroup(user.id)
    console.log(project)
    project.getSessions().then(async result => {
        for (let e = 0; e < project.sessions.length; e++) {
            var session = project.sessions[e]
            await project.testGroup.addCase(session.id)
            await session.getEvents()
            var cypressOptions = {
                config: {
                    baseUrl: url,
                },
                env: {
                    session: JSON.stringify(project.sessions[e]),
                    caseID : project.testGroup.cases[e].id,
                    baseURL: url
                },
                headless: true,  // Run tests in headless mode
                browser: 'chrome'  // Specify the browser
            };

            // Run Cypress tests
            await cypress.run(cypressOptions)
                .then((results) => {
                    console.log(results);
                    project.testGroup.cases[e].updateStatus('Passed')
                })
                .catch((err) => {
                    console.error('Error running Cypress tests:', err);
                    project.testGroup.cases[e].updateStatus('Failed')
                    throw err
                });
        }
    }).catch(error => {
        throw error
    });


}

module.exports = { runTests };
