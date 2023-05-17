require('dotenv').config();
const express = require('express');
const querystring = require('querystring');
const app = express();
const axios = require('axios');
const port = 8888;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get("/", (req, res) => {
  res.redirect('/login');
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
          res.redirect(`http://localhost:3000/?${queryParams}`);

          

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

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
