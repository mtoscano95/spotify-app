import { useState, useEffect } from 'react';
import { accessToken, logout } from './spotify';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import styled from 'styled-components';
import { GlobalStyle } from './styles';
import { Login, Profile, TopArtists, TopTracks, Playlists, Playlist} from './pages';


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

  useEffect(() => {
    //set the token once we receive an access token
    setToken(accessToken);    
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
          <Route path="/top-artists" element={<TopArtists/>}/>
          <Route path="/top-tracks" element={<TopTracks/>}/>
          <Route path="/playlists/:id" element={<Playlist/>}/>
          <Route path="/playlists" element={<Playlists/>}/>
          <Route path="/" element={<Profile/>}/>
        </Routes>
      </Router>
    </div>
  );
}
export default App;