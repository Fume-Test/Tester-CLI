const axios = require('axios');
const config = require('./config.json');
 
class User {
    
    constructor(username, password){
        this.username = username
        this.password = password
    }

    async login(){
        let data = JSON.stringify({
            "username": this.username,
            "password": this.password
          });
          
          let axios_config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: config.url +'/api/auth/login',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
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
    }
        

}



module.exports = User;