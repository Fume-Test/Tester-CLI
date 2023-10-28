const config = require('./config.json');
const axios = require('axios');

class ActionLog {
    constructor(caseID, eventID, projectID, authToken) {
        this.caseID = caseID;
        this.eventID = eventID;
        this.authToken = authToken;
        this.projectID = projectID;
    }

    async save() {

        let body = {
            "project": this.projectID,
            "caseID": this.caseID,
            "eventID": this.eventID
        }

        let headers = {
            'Content-Type': 'application/json',
            'Authorization': this.authToken
        }

        await axios.post(config.url + '/api/actionLogs', body, {headers})
    }
}

module.exports = ActionLog