import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getTopArtists } from '../spotify';
import { SectionWrapper, ArtistsGrid, TimeRangeButtons, Loader } from '../Components';

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);
  //add active range to get buttons for top artists since long term short term and med term are time ranges sent over. Make the short the default
  const [activeRange, setActiveRange] = useState("short");

  useEffect(() => {
    const fetchData = async () => {
        //add the active range as whats passed folloed by term 
      const userTopArtists = await getTopArtists(`${activeRange}_term`);
      setTopArtists(userTopArtists.data);

    };
    catchErrors(fetchData());
    // we will want to add activeRange as a dependency too
  }, [activeRange]);


  //breadcrumb = true helps with navigation
  //added onClick  using setActiveRange to set the button clicks to go to each top artists per time range
  //added classname of "active" conditionally if the activeRange is short med or long
  return (
    <main>
    {topArtists ? (
          <SectionWrapper title="Top artists" breadcrumb={true}>
            <TimeRangeButtons activeRange={activeRange} setActiveRange={setActiveRange}/>
            <ArtistsGrid artists={topArtists.items} />
          </SectionWrapper>
      ):(
        <Loader/>
      )}
    </main>
  )
};

export default TopArtists;