const axios = require('axios');
const config = require('./config.json');

class User {

  constructor(projectKey , apiKey) {
    this.projectKey = projectKey, 
    this.apiKey = apiKey
  }

  async login() {
    let data = JSON.stringify({
      "project": this.projectKey,
      "apiKey": this.apiKey
    });

    let axios_config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: config.url + '/api/auth/loginWithAPIKey',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    await axios.request(axios_config)
      .then((response) => {
        console.log(response.data)
        data = response.data
        this.token = data.token
      })
      .catch((error) => {
        throw error
      });

      
  }


}



module.exports = User;