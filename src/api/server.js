const apicache = require('apicache')
const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware')
const request = require('request');
const cors = require('cors');
const app = express();

app.use(cors())

//db and cache
require('dotenv').config();
require("@aws-sdk/eventstream-marshaller");
const sqlite3 = require('sqlite3').verbose();
let cache = apicache.middleware;

//config
const PORT = 2000;
const HOST = "localhost";
const API_SERVICE_URL = process.env.get_userID;
var user_id = 0;
var user_followers = 0
var user_name = ''

//access token
const getToken = () => {
    const options = {
        json:true,
        url: process.env.get_token,
        body: {
            client_id: process.env.client_id,
            client_secret: process.env.client_secret,
            grant_type: 'client_credentials'
        }
    };

    request.post(options, (err,res,body) => {
        if (err){
            return console.log(err);
        }
        console.log(body);
    });
};
var accessToken = ''
getToken(process.env.get_token, (res) => {
    accessToken = res.body.access_token;
    return accessToken
})

//endpoint that proxies to twitch api to get user_id
app.use('/get_user_id', cache('5 minutes'), createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/get_user_id`]: '',
    },
    onProxyReq(proxyReq) {
        proxyReq.setHeader('Client-ID', process.env.client_id,);
        proxyReq.setHeader('Authorization', 'Bearer bni7kq2v4q29fjg91edlfwmrhyk359');
    },
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer) => {
                const response = JSON.parse(responseBuffer.toString('utf8')); //reads the response
                if (response.data){//if response
                    if (response.data[0]){//if there is a user id found
                        user_id = (response.data[0].id); //get the user id
                        user_name = (response.data[0].display_name);
                        return(user_id);
                    }
                    else{
                        return(user_id = "-1"); //if not
                    }
                }
                else{
                    console.log('Channel not found! :(');
                    user_name = "nobody :(";
                }
                
                return responseBuffer;
            })
}));

//endpoint that proxies to twitch api to get followers useing user_id
app.use('/get_followers', cache('5 minutes'), createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/get_followers`]: '',
    },
    onProxyReq(proxyReq) {
        proxyReq.setHeader('Client-ID', process.env.client_id,);
        proxyReq.setHeader('Authorization', 'Bearer bni7kq2v4q29fjg91edlfwmrhyk359');
    },
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer) => {
                const response = JSON.parse(responseBuffer.toString('utf8')); //reads the response
                if (response.data.length > -1){//if there is a channel found
                    user_followers = (response.total); //gets the amount of followers

                    let db = new sqlite3.Database('./database/channels.db'); //persist the data in an sqlite db
                    db.run(`SELECT DISTINCT Name FROM channels`); //removes duplicates 
                    db.run(`INSERT INTO channels (Name,Followers) VALUES ("${user_name}",${user_followers})`, function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
                        else{
                            console.log('row inserted!');
                            }
                    });
                    db.close();
                }
                else{
                    console.log('Channel not found! :(');
                    user_followers = 0;
                }
                return responseBuffer;
            })
}));


//start the proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
