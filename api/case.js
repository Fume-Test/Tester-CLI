const config = require('./config.json');
const axios = require('axios');

class Case {

  constructor(id, sessionID, status, testGroupID, startTime, authToken) {
    this.id = id;
    this.sessionID = sessionID
    this.status = status
    this.testGroupID = testGroupID
    this.startTime = startTime
    this.authToken = authToken
  }

  async updateStatus(status) {
    let data = JSON.stringify({
      "status": status
    });

    let axios_config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: config.url + '/api/cases?id=' + this.id,
      headers: {
        'Authorization': this.authToken,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(axios_config)
      .then((response) => {
        this.status = response.data.status
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async refresh() {
    let axios_config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: config.url + '/api/cases?id=' + this.id,
      headers: {
        'Authorization': this.authToken,
        'Content-Type': 'application/json'
      }
    };

    return axios.request(axios_config)
      .then((response) => {
        this.status = response.data.status;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = Case;
