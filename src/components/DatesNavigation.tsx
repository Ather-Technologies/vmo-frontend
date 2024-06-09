"use client"

import React, { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';
import DateSelectTable from './DateSelectTable';
import { useCookies } from 'react-cookie';

// NavigationFooterProps with clipKey as a number
interface NavigationFooterProps {
  clipKey: number;
  setClipKey: React.Dispatch<React.SetStateAction<number>>;
}

function DatesNavigation({ clipKey, setClipKey }: NavigationFooterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [ cookies ] = useCookies(['dateKey']);

  useEffect(() => {
    if (!cookies?.dateKey) {
      setIsExpanded(true);
    }
  }, [cookies?.dateKey]);

  const handleButtonClick = () => {
    if (cookies.dateKey)
      setIsExpanded(!isExpanded);
  };

  return (
    <div className={`fixed bottom-0 left-0 w-full bg-scso-color transition-all duration-500 ${isExpanded ? 'h-full' : 'h-16'}`}>
      <div className={`p-4 mw-full flex justify-between items-end bg-gray-900 py-4 ${isExpanded ? '' : 'pb-8'}`}>
        <AudioPlayer clipKey={clipKey} setClipKey={setClipKey} />
        <button className="text-gray-500 text-sm" onClick={handleButtonClick}>
          {isExpanded ? 'Close' : 'Open'}
        </button>
      </div>
        <DateSelectTable setIsExpanded={setIsExpanded} />
    </div>
  );
}

export default DatesNavigation;