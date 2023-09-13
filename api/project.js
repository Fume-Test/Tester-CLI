const axios = require('axios');
const config = require('./config.json');
const Session = require('./session');
const { data } = require('cypress/types/jquery');

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
          
          axios.request(axios_config)
          .then((response) => {
            data = response.data
            this.sessions = []
            for (let e = 0; e < data.length; e++) {
                this.sessions.push(Session(data[e]._id, data[e].cookies, data[e].windowWidth, data[e].windowHeights,data[e].user, data[e].project, data[e].localStorage,data[e].clientIP, data[e].startTime))
            }
          })
          .catch((error) => {
            throw error
          });
          
    }

}

module.exports = Project