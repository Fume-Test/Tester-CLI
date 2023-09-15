const config = require('./config.json');
const axios = require('axios');
const Case = require('./case.js');

class TestGroup{
    constructor(id,userID,status,projectID,startTime,authToken){
        this.id = id 
        this.userID = userID
        this.status = status
        this.projectID = projectID
        this.startTime = startTime
        this.authToken = authToken
        this.cases = []
    }

    async addCase(sessionID){
        let data = JSON.stringify({
            "session": sessionID,
            "test": this.id
          });
          
          let axios_config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: config.url + '/api/cases',
            headers: { 
              'Authorization': this.authToken, 
              'Content-Type': 'application/json', 
              'Cookie': 'sessionID=' + sessionID
            },
            data : data
          };
          
          await axios.request(axios_config)
          .then((response) => {
            const data = response.data
            const test_case = new Case(data._id,data.session,data.status,data.test,data,data.startTime,this.authToken)
            this.cases.push(test_case)
            return test_case
          })
          .catch((error) => {
            console.log(error);
          });
    }
}

module.exports = TestGroup;