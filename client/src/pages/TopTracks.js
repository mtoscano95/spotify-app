import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getTopTracks } from '../spotify';
import { SectionWrapper, TrackList, TimeRangeButtons } from '../Components';

const TopTracks = () => {
    const [topTracks, setTopTracks] = useState(null);
    //add active range to get buttons for top artists since long term short term and med term are time ranges sent over. Make the short the default
    const [activeRange, setActiveRange] = useState("short");
  
    useEffect(() => {
      const fetchData = async () => {
          //add the active range as whats passed folloed by term 
        const userTopTracks = await getTopTracks(`${activeRange}_term`);
        setTopTracks(userTopTracks.data);
  
      };
      catchErrors(fetchData());
      // we will want to add activeRange as a dependency too
    }, [activeRange]);
  
  
    //breadcrumb = true helps with navigation
    //added onClick  using setActiveRange to set the button clicks to go to each top artists per time range
    //added classname of "active" conditionally if the activeRange is short med or long
    return (
      <main>
      {topTracks && (
            <SectionWrapper title="Top Tracks" breadcrumb={true}>
            <TimeRangeButtons activeRange={activeRange} setActiveRange={setActiveRange}/>
              <TrackList tracks={topTracks.items} />
            </SectionWrapper>
        )}
      </main>
    )
}

export default TopTracks;