import { useState, useEffect } from 'react';
import DatesNavigation from './components/DatesNavigation'; // Corrected import
import LoadingScreen from './components/LoadingScreen';
import ClipsPage from './components/ClipsPage';
import { Toaster } from 'react-hot-toast';
import { ClipDateStateDataProp } from './lib/types';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const [clip_id, setClipID] = useState(NaN);
  const [date_id, setDateID] = useState(NaN);
  const CDStateData: ClipDateStateDataProp = { clip_id: clip_id, date_id: date_id, setClipID, setDateID };

  // const [cookies, setCookie, removeCookie] = useCookies(['clip_id', 'plays_remaining']);

  // useEffect(() => {
  //   if (!cookies?.clip_id) {
  //     setCookie('clip_id', clip_id, { path: '/' });
  //     // No clip send to dashboard?
  //   } else {
  //     setClipID(cookies.clip_id);
  //   }

  //   // Remove plays_remaining cookie
  //   removeCookie('plays_remaining', { path: '/' });
  // }, [cookies.clip_id, setCookie, clip_id, removeCookie]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <main className='overflow-hidden'>
      {
        isLoading ? <LoadingScreen loadingText='Loading...' /> : <>
          { /*<FloatingMenu />  Haha not right now lol*/}
          <ClipsPage CDStateData={CDStateData} />
          <DatesNavigation CDStateData={CDStateData} />
        </>
      }
      <Toaster
        position='top-center'
        reverseOrder={true}
      />
    </main>
  );
}

export default App;