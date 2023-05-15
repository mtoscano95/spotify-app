import { useState, useEffect } from 'react';
import { catchErrors } from './utils';
import { accessToken, logout, getCurrentUserProfile } from './spotify';
import './App.css';

const App = () => {
  //set a token and set token from our state
  const [token, setToken] = useState(null);
// set this state up so we can work with the user profile
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    //set the token once we receive an access token
    setToken(accessToken);

    //make a function to fetch user profile data and set the setProfile as that profile data
    const fetchData = async() => {
        const {data} = await getCurrentUserProfile();
        setProfile(data);
    }

    //always call fetchData
    // we will wrap fetch data into our HOF of catchErrors which will handle async/await errors
    catchErrors(fetchData());
    
  }, []);



  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a className="App-link" href="http://localhost:8888/login">
            Log in to Spotify
          </a>
        ) : (
          <>
          <h1>Logged in!</h1>
          <button onClick={logout}>Log Out</button>
          { profile && (
            <div>
            <h1>{profile.display_name}</h1>
            <p>{profile.followers.total}</p>
            {profile.images.length && profile.images[0].url && (
              <img src={profile.images[0].url} alt="Avatar"/>
            )}
            </div>
          )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;


/*
localstorage gameplan

localstorage will have access token, refresh toke, access token expiore time and timestamp of when access token currently in use if fetch and stored

1) once they first visit and log in, well store tokens from query params  in our local storage

2) store timestamp in local storage
- update callback handler to include expires in value of query params  of rredirect URL
- update how we retrieve spotify access token by adding the localstorage keys and values in our spotify.js file
- add local key and value pairs in the spotify.js file that will help us retriueve the token and store it locally
- 

3) w next API Call check for stored tokens

4) use stored timestamp to make sure tokens are not expired
- if valid, use that in our APO req
- if exp, use refresh token to hit /refresh_token
- store new tokens in locla storage and update timing







*/
