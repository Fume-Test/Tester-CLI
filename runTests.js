#!/usr/bin/env node

const path = require('path');
const execSync = require('child_process').execSync;

// Determine the directory of the current npm package
const packageDirectory = path.dirname(require.resolve('./package.json'));

// Construct the path to the cypress.json file inside the package
const cypressConfigPath = path.join(packageDirectory, 'cypress.config.js');

const cypress = require('cypress');
const Project = require('./api/project.js');

const supportFilePath = path.join(packageDirectory, 'cypress', 'support', 'e2e.js');
const integrationsFilePath = path.join(packageDirectory, 'cypress', 'e2e');

async function runTests(url, projectKey, testCount, user) {

    var project = new Project(projectKey, user.token)
    await project.addTestGroup(user.id)
    project.getSessions(testCount).then(async result => {
        for (let e = 0; e < project.sessions.length; e++) {
            var session = project.sessions[e]
            await project.testGroup.addCase(session.id)
            await session.getEvents()
            var cypressOptions = {
                projectId: '2kxu2f',
                e2e: {
                    supportFile: supportFilePath,
                    specPattern: `${integrationsFilePath}/**/*.cy.{js,jsx,ts,tsx}`,
                    setupNodeEvents(on, config) {
                        on('task', {
                            logMessage(message) {
                                console.log(message);
                                return null; // Important: always return something to signify task completion
                            }
                        });

                        // Keep any other configurations or listeners you may have
                    },
                },
                config: {
                    baseUrl: url,
                    video: true  // Enable video recording
                },
                env: {
                    session: JSON.stringify(project.sessions[e]),
                    caseID: project.testGroup.cases[e].id,
                    baseURL: url
                },
                headless: true,  // Run tests in headless mode
                browser: 'chrome',  // Specify the 
                record: true,  // Enable recording
                key: '11ee67f1-3142-44c9-a024-4ad48e3306e1'
            };

            try {
                const results = await cypress.run(cypressOptions);
                await project.testGroup.cases[e].refresh();
                if (results.totalFailed > 0) {
                    project.testGroup.cases[e].updateStatus('Failed');
                } else {
                    project.testGroup.cases[e].updateStatus('Passed');
                }
            } catch (err) {
                console.error('Error running Cypress tests:', err);
                project.testGroup.cases[e].updateStatus('Failed');
                throw err;
            }
        }
        project.testGroup.updateStatus("Complete");
    }).catch(error => {
        throw error
    });


}

module.exports = { runTests };
