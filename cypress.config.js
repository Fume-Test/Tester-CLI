const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '2kxu2f',
  e2e: {
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
