const axios = require('axios');
const config = require('./config.json');

class User {

  constructor(projectKey) {
    this.projectKey = projectKey
  }

  async login() {
    let data = JSON.stringify({
      "projectKey": this.projectKey
    });

    let axios_config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: config.url + '/api/auth/loginWithProjectKey',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    await axios.request(axios_config)
      .then((response) => {

        data = response.data
        this.token = data.token
        this.id = data.user._id
        this.permissions = data.user.permissions
        this.__v = data.user.__v
      })
      .catch((error) => {
        throw error
      });

      console.log(this)
  }


}



module.exports = User;