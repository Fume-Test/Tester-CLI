#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { runTests } = require('./runTests')
const User = require('./api/user.js')
 
const argv = yargs(hideBin(process.argv))
  .command('run', 'Run the fume command', (yargs) => {
    yargs
      .option('url', {
        describe: 'URL to connect to',
        type: 'string',
        demandOption: true,
      })
      .option('projectKey', {
        describe: 'Project key',
        type: 'string',
        demandOption: true,
      })
      .option('timeout', {
        describe: 'Timeout in seconds',
        type: 'number',
        default: 300,
      });
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv;

if (argv._[0] === 'run') {
  console.log(`Running with the following options:`);
  console.log(`URL: ${argv.url}`);
  console.log(`Project Key: ${argv.projectKey}`);
  console.log(`Timeout: ${argv.timeout} seconds`);
  const user = new User(argv.projectKey)
  user.login()
  .then(result => {
    runTests(argv.url, argv.projectKey, argv.timeout, user);
  })
  .catch(error => {
    console.log(error)
  });
  
}
