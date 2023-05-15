import { useState, useEffect } from 'react';
import { catchErrors } from './utils';
import { accessToken, logout, getCurrentUserProfile } from './spotify';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import styled from 'styled-components';
import { GlobalStyle } from './styles';
import { Login, Profile } from './pages';

const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0,0,0,.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


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
      <GlobalStyle /> 
      <header className="App-header">
      {!token ? 
          <div>
            <Login/>
          </div>
        :
        <div>
        <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
        </div>}
      </header>
      <Router>
        <ScrollToTop/>
        <Routes>
          <Route path="/top-artists"/>
          <Route path="/top-tracks"/>
          <Route path="/playlists/:id"/>
          <Route path="/playlists"/>
          <Route path="/" element={<Profile/>}/>
        </Routes>
      </Router>
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




        <button onClick={logout}>Log Out</button>

        {profile && (
          <div>
            <h1>{profile.display_name}</h1>
            <p>{profile.followers.total} Followers</p>
            {profile.images.length && profile.images[0].url && (
              <img src={profile.images[0].url} alt="Avatar"/>
            )}
          </div>
        )}
    )


*/


/* How to make the homepage have the 



*/
