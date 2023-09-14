const axios = require('axios');
const config = require('./config.json');
const Session = require('./session');


class Project{

    constructor(id, authToken){
        this.id = id
        this.authToken = authToken
    }

    async getSessions(){

        let axios_config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: config.url + '/api/sessions?project_id='+ this.id,
            headers: { 
              'Authorization': this.authToken
            }
          };
          
         await axios.request(axios_config)
          .then((response) => {
            const data = response.data
            this.sessions = []
            for (let e = 0; e < data.length; e++) {
                this.sessions.push(new Session(data[e]._id, data[e].cookies, data[e].windowWidth, data[e].windowHeight, data[e].user, data[e].project, data[e].localStorage,data[e].clientIP, data[e].startTime, this.authToken))
            }
          })
          .catch((error) => {
            throw error
          });
          
    }

}

module.exports = Project