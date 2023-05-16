import axios from 'axios';

// Map for localStorage keys. Helps us refer to keys for key/value pair of localstorage
const LOCALSTORAGE_KEYS = {
    accessToken: 'spotify_access_token',
    refreshToken: 'spotify_refresh_token',
    expireTime: 'spotify_token_expire_time',
    timestamp: 'spotify_token_timestamp',
  }
  
  // Map to retrieve localStorage values
  const LOCALSTORAGE_VALUES = {
    accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
    refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
    expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
    timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
  };


// Clear out all localStorage items we've set and reload the page
export const logout = () => {
    // Clear all localStorage items
    for (const property in LOCALSTORAGE_KEYS) {
      window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
    }
    // Navigate to homepage
    window.location = window.location.origin;
  };



  // Checks if the amount of time that has elapsed between the timestamp in localStorage


  const hasTokenExpired = () => {
    const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
    if (!accessToken || !timestamp) {
      return false;
    }
    // and now is greater than the expiration time of 3600 seconds (1 hour).

    const millisecondsElapsed = Date.now() - Number(timestamp);

    // returns boolean Whether or not the access token in localStorage has expired

    return (millisecondsElapsed / 1000) > Number(expireTime);
  };


  // Use the refresh token in localStorage to hit the /refresh_token endpoint in our Node app, then update values in localStorage with data from response.

const refreshToken = async () => {
    try {
      // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
      if (!LOCALSTORAGE_VALUES.refreshToken ||
        LOCALSTORAGE_VALUES.refreshToken === 'undefined' ||
        (Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000) < 1000
      ) {
        console.error('No refresh token available');
        logout();
      }
  
      // Use `/refresh_token` endpoint from our Node app
      const { data } = await axios.get(`/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`);
  
      // Update localStorage values
      window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
      window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
  
      // Reload the page for localStorage updates to be reflected
      window.location.reload();
  
    } catch (e) {
      console.error(e);
    }
  };


  //created the function below in order to grab the access token to use for our App.js file
//update this to store tokens in local storage first time user logs in and opulls it next time theyre available
const getAccessToken = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const queryParams = {
      [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
      [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
      [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
    };
    const hasError = urlParams.get('error');
  
    // if theres an error OR the token in localStorage has expired, refresh the token
    if (hasError || hasTokenExpired() || LOCALSTORAGE_VALUES.accessToken === 'undefined') {
      refreshToken();
    }
  
    // if there is a valid access token in localStorage, use that
    if (LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== 'undefined') {
      return LOCALSTORAGE_VALUES.accessToken;
    }
  
    // If there is a token in the URL query params, user is logging in for the first time
    if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
      // Store the query params in localStorage
      for (const property in queryParams) {
        window.localStorage.setItem(property, queryParams[property]);
      }
      // Set timestamp
      window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
      // Return access token from query params
      return queryParams[LOCALSTORAGE_KEYS.accessToken];
    }
  
    // we shouldnt get here really
    return false;
  };

  export const accessToken = getAccessToken();


//axios global req headers
//https://github.com/axios/axios#global-axios-defaults

//spotify where we'll get all profile/user data from
// https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
axios.defaults.baseURL = 'https://api.spotify.com/v1';
//accesstoken in local storage
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
//spotity default
axios.defaults.headers['Content-Type'] = 'application/json';


//since we set baseUrl globally, we dont need to spell out the link. we can export a function to grab the user profile 
// now this goes to the App.js file
export const getCurrentUserProfile = () =>  axios.get('/me');

// We will add get current user olaylist function that hits /me /playlsit spotify API endpoint
//https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-a-list-of-current-users-playlists

export const getCurrentUserPlaylists = (limit = 5) => {
    return axios.get(`/me/playlists?limit=${limit}`);
  };

// We will add a get top artists function, pass in short term time range (4 weeks)
//https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  export const getTopArtists = (time_range = 'short_term') => {
    return axios.get(`/me/top/artists?time_range=${time_range}`);
  };

  export const getTopTracks = (time_range = 'short_term') => {
    return axios.get(`/me/top/tracks?time_range=${time_range}`);
  };


