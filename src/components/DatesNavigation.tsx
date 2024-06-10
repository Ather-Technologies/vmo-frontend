import { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';
import DateSelectTable from './DateSelectTable';
import { ClipDateStateDataProp } from '../lib/types';

interface DatesNavProp {
  CDStateData: ClipDateStateDataProp;
}

function DatesNavigation({ CDStateData }: DatesNavProp) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Just doing some shortening because I don't like refactoring everything
  const dateKey = CDStateData.dateKey;

  useEffect(() => {
    if (isNaN(dateKey)) {
      setIsExpanded(true);
    }
  }, [dateKey]);

  const handleButtonClick = () => {
    if (!isNaN(dateKey))
      setIsExpanded(!isExpanded);
  };

  return (
    <div className={`fixed bottom-0 left-0 w-full bg-scso-color transition-all duration-500 ${isExpanded ? 'h-full' : 'h-16'}`}>
      <div className={`p-4 mw-full flex justify-between items-end bg-gray-900 py-4 ${isExpanded ? '' : 'pb-8'}`}>
        <AudioPlayer CDStateData={CDStateData} />
        <button className="text-gray-500 text-sm" onClick={handleButtonClick}>
          {
            isExpanded ? (
              dateKey ? 'Close' : 'Please pick a date'
            ) : 'Open'}
        </button>
      </div>
      <DateSelectTable CDStateData={CDStateData} setIsExpanded={setIsExpanded} />
    </div>
  );
}

export default DatesNavigation;