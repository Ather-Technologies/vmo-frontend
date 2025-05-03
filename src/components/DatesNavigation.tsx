import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import AudioPlayer from './AudioPlayer';
import DateSelectTable from './DateSelectTable';
import { ClipDateStateDataProp } from '../lib/types';

interface DatesNavProp {
  CDStateData: ClipDateStateDataProp;
}

function DatesNavigation({ CDStateData }: DatesNavProp) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const date_id = CDStateData.date_id;
  const selectedDate = CDStateData.selectedDateFullData;

  // Track mobile state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (isNaN(date_id)) {
      setIsExpanded(true);
    }
  }, [date_id]);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = () => {
    if (!isNaN(date_id)) {
      setIsExpanded(!isExpanded);
    }
  };

  const formatCurrentSelection = () => {
    if (isNaN(date_id)) return null;

    try {
      const formattedDate = new Date(selectedDate.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      });
      return (
        <div className="flex items-center font-medium">
          {/* Hide icon on very small screens */}
          <div className={`hidden xs:flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-900/40 mr-2 sm:mr-3`}>
            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-blue-300 truncate max-w-[120px] sm:max-w-none">{selectedDate.source.shorthand}</span>
            <span className="text-sm whitespace-nowrap">{formattedDate}</span>
          </div>
        </div>
      );
    } catch (e) {
      return null;
    }
  };

  return (
    <div
      id="datesnavbackground"
      className={`fixed bottom-0 left-0 w-full transition-all duration-300 ease-in-out z-50
        backdrop-blur-md shadow-xl border-t border-indigo-900/30
        ${isExpanded ? 'h-full bg-gray-900/90' : 'h-auto bg-gray-900/95'}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>

      {/* Header with audio controls and toggle button */}
      <div ref={headerRef} className={`rounded-t-xl px-1 sm:px-2 py-1.5 sm:py-2 md:px-4 md:py-3`}>
        <div className="flex flex-col md:flex-row w-full gap-1 sm:gap-2 md:gap-3">
          {/* Top row with status information */}
          <div className="flex justify-between w-full items-center">
            <div className="flex-1 min-w-0"> {/* Add min-w-0 to allow children to shrink below flex parent */}
              {formatCurrentSelection()}
            </div>

            <button
              className={`flex-shrink-0 flex items-center justify-center px-1.5 sm:px-2 py-1 md:px-3 md:py-1.5 rounded-lg 
                text-xs md:text-sm font-medium active:scale-95 transform duration-150
                ${isExpanded
                  ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-200'
                  : 'bg-blue-700/70 hover:bg-blue-600/70 text-white'}`}
              onClick={handleToggle}
              disabled={isNaN(date_id)}
            >
              <span className="mr-1 md:mr-2">
                {isExpanded ? 'Close' : isMobile ? 'Select' : 'Select Date'}
              </span>
              <FontAwesomeIcon
                icon={isExpanded ? faChevronDown : faChevronUp}
                className={isExpanded ? 'text-gray-300' : 'text-blue-300'}
              />
            </button>
          </div>

          {/* Bottom row with audio player */}
          <div className="flex-1 md:flex-grow-0">
            <AudioPlayer CDStateData={CDStateData} />
          </div>
        </div>
      </div>

      {/* Content area with date selection - optimized for better screen utilization */}
      <div
        className={`transition-all duration-300 ease-in-out
          ${isExpanded
            ? 'opacity-100 overflow-auto'
            : 'h-0 opacity-0 overflow-hidden'}`}
        style={{
          height: isExpanded ? `calc(100% - ${headerHeight}px)` : '0px',
          maxHeight: isExpanded ? `calc(100vh - ${headerHeight}px)` : '0px',
          // Adjust padding based on device
          paddingTop: isMobile ? '2px' : '4px',
          paddingBottom: isMobile ? '4px' : (window.innerHeight > 800 ? '16px' : '8px')
        }}
      >
        <DateSelectTable
          CDStateData={CDStateData}
          setIsExpanded={setIsExpanded}
        />
      </div>
    </div>
  );
}

export default DatesNavigation;