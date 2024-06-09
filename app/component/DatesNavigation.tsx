"use client"

import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';
import DateSelectTable from './DateSelectTable'

const audioFile = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

function DatesNavigation() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`fixed bottom-0 left-0 w-full bg-gray-900 transition-all duration-500 ${isExpanded ? 'h-full' : 'h-16'}`}>
      <div className={`p-4 mw-full flex justify-between items-end py-4 ${isExpanded ? '' : 'pb-8'}`}>
        <AudioPlayer url={audioFile} />
        <button className="text-gray-500 text-sm" onClick={handleButtonClick}>
          {isExpanded ? 'Close' : 'Open'}
        </button>
      </div>
        <DateSelectTable />
    </div>
  );
}

export default DatesNavigation;