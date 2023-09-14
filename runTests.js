const cypress = require('cypress');
const Project = require('./api/project.js')

async function runTests(url, projectKey, timeout, user) {
    console.log(user)

    var project = new Project(projectKey, user.token)
    console.log(project)
    project.getSessions().then(result => {
        console.log(project)

    
    for (let e = 0; e < project.sessions.length; e++) {
        var cypressOptions = {
            config: {
                baseUrl: url,
                // Any other configuration options you'd like to set
            },
            env: {
                session : project.sessions[e]
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
                throw err
             });
    }}).catch(error => {
        throw error
      });


}

module.exports = { runTests };
