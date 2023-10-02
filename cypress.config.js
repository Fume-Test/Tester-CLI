const { defineConfig } = require("cypress");
const path = require('path');
const execSync = require('child_process').execSync;

// Determine the directory of the current npm package
const packageDirectory = path.dirname(require.resolve('./package.json'));

const supportFilePath = path.join(packageDirectory, 'cypress', 'support', 'e2e.js');
const integrationsFilePath = path.join(packageDirectory, 'cypress', 'e2e');

module.exports = defineConfig({
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
});
