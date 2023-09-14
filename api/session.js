const axios = require('axios');
const config = require('./config.json');
//const { data } = require('cypress/types/jquery');
const Event = require('./event')

class Session {
    constructor(id, cookies, windowWidth, windowHeight, user, project, localStorage, clientIP, startTime,authToken) {
        this.id = id;
        this.cookies = cookies,
            this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        this.user = user;
        this.project = project;
        this.localStorage = localStorage;
        this.clientIP = clientIP;
        this.startTime = startTime;
        this.authToken = authToken
    }

    async getEvents() {
        let axios_config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: config.url + '/api/events?session_id=' + this.id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.authToken
            }
        };

        await axios.request(axios_config)
            .then((response) => {
                data = response.data
                this.events = []
                for (let e = 0; e < data.length; e++) {
                    this.events.push(Event(data[e]._id, data[e].eventType, data[e].detail, data[e].session, data[e].eventOrder, data[e].location, data[e].eventTime))
                }
            })
    }
}

module.exports = Session;