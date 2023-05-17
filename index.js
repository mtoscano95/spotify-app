require('dotenv').config();
const express = require('express');
const querystring = require('querystring');
const app = express();
const axios = require('axios');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;
const PORT = process.env.PORT || 8888;
 
app.get("/", (req, res) => {
    const data = {
        name: "Brittany",
        isAwesome: true
    }
    res.json(data);
})

const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  
  const stateKey = 'spotify_auth_state';
  
  app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    const scope = [
      'user-read-private',
      'user-read-email',
      'user-top-read'
    ].join(" ")
  
    const queryParams = querystring.stringify({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      state: state,
      scope: scope,
    });
  
    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
  });


  app.get('/callback', (req, res) => {
    const code = req.query.code || null;
  
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    })
      .then(response => {
        if (response.status === 200) {
          const { access_token, refresh_token, expires_in } = response.data;
  
          const queryParams = querystring.stringify({
            access_token,
            refresh_token,
            expires_in
          });

          //redirect to react app
          res.redirect(`${FRONTEND_URI}${queryParams}`);

          

        } else {
          //send an error, redirect to error query
          res.redirect(`/?${querystring.stringify({ error: 'invalid_token' })}`);
        }
      })
      .catch(error => {
        res.send(error);
      });
  });


  app.get('/refresh_token', (req, res) => {
    // we will need to pull a refresh token from the url
    const { refresh_token } = req.query;
  
    // well set up a get route to reequest the refresh token
    axios.get(`http://localhost:8888/refresh_token?refresh_token=${refresh_token}`)
    .then(response => {
      res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
    })
    .catch(error => {
      res.send(error);
    });

  });

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})


/* FuLLY WORKING URL

http://localhost:3000/callback?code=AQDB76l8Vvf9tSI0Lda94FeYfzS5smd4feCVTZflaXlbyfwnMUaZC_omSKCJoldPUAf_-JK2c14s3f_2GG9kRONd8dv-8baiWoIHL_dH1WWonOJTf8BNwoxr4TG_9B97RSPlAk2uQt9QNLeZ3HzghABZWSUo-ts04D6vE2QdZZs9K6DHPM9MPoyziSkrfhYqOrbxDui2Dj2EotTH5aaLXMxxuMDADA&state=LG8BvdrOYaM13ZzB

*/

/*JSON DATA LESSON
//Imporant lesson
// if we want to send a specific page that reads "Brittany is Really Awesome", we would need to set up the get route
//then we would need to set the name and isAwesome data obj key value pairs as req query (string manipulation)
//once we do that we would send the page with this info
// we will need to parse is awesome since query is jsut string and isAwesome is boolean
app.get("/awesome-generator", (req, res) => {
    const {name, isAwesome} = req.query;
    res.send(`${name} is ${JSON.parse(isAwesome) ? 'Really' : 'Not'} awesome`);
})

*/

/*1st iteration of callback to check if theres an access token

app.get('/callback', (req, res) => {
    //we store code variable (auth code) in the query params
    const code = req.query.code || null;

    //post call
    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        //req body params and what they need
        data: querystring.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI
        }),
        //2 headers, the content type and authorization, required
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
      })
      //since axios is promise based, we use then and catch callback to handle what is returned
        .then(response => {
            //if its sucessful we send the stringified data
          if (response.status === 200) {
            //return stringified response data from axios response. axios stores data it gets back in requests in data property of resposne obejct (not on resp obj itself)
            //below just makes it look nice in the browser  (the json data)
            res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
          } else {
            //if not then just send what the response is
            res.send(response);
          }
        })
        //if theres an error it comes here
        .catch(error => {
          res.send(error);
        });
  })

*/