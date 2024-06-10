import { useState, useEffect } from 'react';
import DatesNavigation from './components/DatesNavigation'; // Corrected import
import LoadingScreen from './components/LoadingScreen';
import ClipsPage from './components/ClipsPage';
import { Toaster } from 'react-hot-toast';
import { ClipDateStateDataProp } from './lib/types';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const [clipKey, setClipKey] = useState(NaN);
  const [dateKey, setDateKey] = useState(NaN);
  const CDStateData: ClipDateStateDataProp = { clipKey, dateKey, setClipKey, setDateKey };

  // const [cookies, setCookie, removeCookie] = useCookies(['clipKey', 'plays_remaining']);

  // useEffect(() => {
  //   if (!cookies?.clipKey) {
  //     setCookie('clipKey', clipKey, { path: '/' });
  //     // No clip send to dashboard?
  //   } else {
  //     setClipKey(cookies.clipKey);
  //   }

  //   // Remove plays_remaining cookie
  //   removeCookie('plays_remaining', { path: '/' });
  // }, [cookies.clipKey, setCookie, clipKey, removeCookie]);

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