import {useState, useEffect} from 'react';
import { catchErrors } from '../utils';
import { getCurrentUserPlaylists } from '../spotify';
import { SectionWrapper, PlaylistsGrid } from '../Components';
import axios from 'axios';

const Playlists = () => {
    const [playlistData, setPlaylistsData] = useState(null);
    const [playlists, setPlaylists] = useState([]);

    //the playlist data (obj returned) from spotify endpoint 
    useEffect(() => {
        const fetchData = async () => {
          const userPlaylists = await getCurrentUserPlaylists();
          setPlaylistsData(userPlaylists.data);
        }
        catchErrors(fetchData());});

//when playlistsData updates, check if there qre more playlists to fetch
// then update the state variable
        useEffect(()=>{
        
        if(!playlistData){
            return ;
        }

        //playlist endpoint returns 20 playlists at a time
        // make sure we get all playlsist by fetchint the next set

        const fetchMoreData = async() => {
            if(playlistData.next){
                const {data} = await axios.get(playlistData.next)
                setPlaylistsData(data);
            }
        };

        //use functional update to udpate playlsts state variable and not make an infinite loop
        //

        setPlaylists(playlists => ( [
            ...playlists ? playlists: [],
            ...playlistData.items
        ]))

        catchErrors(fetchMoreData());


    },[playlistData])

    return(
    <main>
    <SectionWrapper title="Playlists" breadcrumbs={true}>
        {playlists && (
        <PlaylistsGrid playlists={playlists} />
        )}
    </SectionWrapper>
    </main>
    )
}

export default Playlists