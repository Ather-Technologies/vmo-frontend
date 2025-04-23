import { useState, useEffect, useRef, useMemo } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faCalendarAlt, faBuilding } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from "./LoadingScreen";
import Pagination from "./Pagination";
import { ClipDate } from "../lib/types";
import API_Interface from "../lib/InterfaceForAPI";
import { ClipDateStateDataProp } from "../lib/types";
import NoSleep from 'nosleep.js';

// Add this custom hook at the top of your file
function useMediaQuery(query: any) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);

        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
}

interface DSTProps {
    setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    CDStateData: ClipDateStateDataProp;
}

const DateSelectTable = ({ CDStateData, setIsExpanded }: DSTProps) => {
    const [clipDates, setClipDates] = useState<ClipDate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentItems, setCurrentItems] = useState<ClipDate[]>([]);
    const tableRowRef = useRef<HTMLTableRowElement>(null);
    const [date_id, setDateID] = [CDStateData.date_id, CDStateData.setDateID];
    const apiInterface = useMemo(() => new API_Interface(), []);
    const isMobile = useMediaQuery('(max-width: 767px)');

    useEffect(() => {
        // Add new highlight
        const row = document.getElementById("vmo-date-" + date_id.toString());
        if (row) {
            row.classList.add("bg-indigo-800/40");
            row.classList.add("border-l-4");
            row.classList.add("border-blue-500");
        }
    }, [date_id, currentItems]);

    const onClick = (newDate_id: number) => {
        const noSleep = new NoSleep();
        noSleep.disable();
        noSleep.enable();

        // Remove old highlight
        const oldRow = document.getElementById("vmo-date-" + date_id.toString());
        if (oldRow) {
            oldRow.classList.remove("bg-indigo-800/40");
            oldRow.classList.remove("border-l-4");
            oldRow.classList.remove("border-blue-500");
        }

        // Set the date in the context
        if (newDate_id) {
            apiInterface.getFullDateFromDateID(newDate_id).then((date) => CDStateData.setSelectedDateFullData(date));
            setDateID(newDate_id);
        }

        setIsExpanded(false);
    }

    useEffect(() => {
        const fetchDatesFromAPI = async () => {
            // Get all dates by source id
            const datesData = await apiInterface.getAllDatesBySourceId(1);

            // Convert dates to locale format
            const formattedDates = datesData.map((dateData) => {
                const date = new Date(dateData.date);
                const formattedDate = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit', timeZone: "UTC" });
                return { ...dateData, date: formattedDate };
            });

            setClipDates(formattedDates);
            setIsLoading(false);
        }

        // Fetch the dates from the API
        fetchDatesFromAPI();
    }, [apiInterface]);

    useEffect(() => {
        // Set a default number of items to show on initial load
        // This helps ensure we have rows to measure
        const initialItemCount = isMobile ? 4 : 6;

        // Use a smaller number than available to ensure we don't exceed total items
        const count = Math.min(initialItemCount, clipDates.length);

        // Set initial items for rendering
        if (clipDates.length > 0 && currentItems.length === 0) {
            setCurrentItems(clipDates.slice(0, count));
        }
    }, [clipDates, currentItems, isMobile]);

    if (isLoading) {
        return <LoadingScreen loadingText="Loading dates..." />;
    }

    if (clipDates.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                <div className="text-gray-400 text-6xl mb-4">
                    <FontAwesomeIcon icon={faCalendarAlt} className="opacity-30" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Dates Available</h3>
                <p className="text-gray-400 max-w-md">
                    There are no dates available. Please check back later.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto px-0.5 sm:px-1 py-0.5 md:px-2 max-w-6xl">
            <div className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg border border-gray-700/50">
                <div className="p-1 sm:p-2 border-b border-gray-700/50 flex justify-between items-center">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white">Select Date</h2>
                    <span className="text-xs text-gray-400">{clipDates.length} dates available</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        <colgroup>
                            {/* Wider source column to fit more text */}
                            <col className="w-[65%] md:w-[55%]" /> {/* Source column (wider on all screens) */}
                            <col className="w-[35%] md:w-[25%]" /> {/* Date column (narrower to give more space to source) */}
                            <col className="hidden md:table-cell w-[20%]" /> {/* Status column - hidden on mobile */}
                        </colgroup>
                        <thead>
                            <tr className="text-xs uppercase tracking-wider text-gray-400 bg-gray-800/70">
                                <th className="px-2 py-1.5 md:px-3 md:py-2 text-left text-[10px] sm:text-xs">Source</th>
                                <th className="px-2 py-1.5 md:px-3 md:py-2 text-left text-[10px] sm:text-xs">Date</th>
                                <th className="hidden md:table-cell px-2 py-1.5 md:px-3 md:py-2 text-left text-[10px] sm:text-xs">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((clipDateData) => (
                                <tr
                                    id={'vmo-date-' + clipDateData.id}
                                    onClick={() => onClick(clipDateData.id)}
                                    ref={tableRowRef}
                                    key={clipDateData.id}
                                    className="transition-all duration-200 hover:bg-gray-700/30 cursor-pointer"
                                >
                                    {/* Source column - with status icon on mobile and wrapped text */}
                                    <td className="px-2 py-2 md:px-3 md:py-2.5"> {/* Slightly increased padding for better spacing */}
                                        <div className="flex items-start"> {/* Changed to items-start for better wrapping alignment */}
                                            {/* Dynamic icon based on media query */}
                                            <div className={`flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-full mr-1.5 sm:mr-2 ${isMobile ? 'bg-green-900/20' : 'bg-blue-900/20'} mt-0.5`}>
                                                <FontAwesomeIcon
                                                    icon={isMobile ? faCheckCircle : faBuilding}
                                                    className={`text-xs sm:text-sm ${isMobile ? 'text-green-400' : 'text-blue-300'}`}
                                                    title={isMobile ? "Available" : "Source"}
                                                />
                                            </div>
                                            {/* Allow text to wrap instead of truncating */}
                                            <span className="text-xs sm:text-sm break-words">
                                                {"Sanders County Sheriff's Office"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Date column - made more compact */}
                                    <td className="px-2 py-2 md:px-3 md:py-2.5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-full bg-purple-900/20 mr-1.5 sm:mr-2">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-300 text-xs sm:text-sm" />
                                            </div>
                                            <span className="text-xs sm:text-sm">{clipDateData.date}</span>
                                        </div>
                                    </td>

                                    {/* Status column - hidden on mobile */}
                                    <td className="hidden md:table-cell px-2 py-2 md:px-3 md:py-2.5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {true ? (
                                                <>
                                                    <div className="flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-full bg-green-900/20 mr-1.5 sm:mr-2">
                                                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-xs sm:text-sm" title="No outage detected" />
                                                    </div>
                                                    <span className="text-green-400 text-xs sm:text-sm">Available</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-full bg-yellow-900/20 mr-1.5 sm:mr-2">
                                                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400 text-xs sm:text-sm" title="Outage detected" />
                                                    </div>
                                                    <span className="text-yellow-400 text-xs sm:text-sm">Partial</span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-gray-800/70 border-t border-gray-700/50">
                    <Pagination
                        items={clipDates}
                        tableRowRef={tableRowRef}
                        setCurrentItems={setCurrentItems}
                        paginationTag="dates"
                        viewportPercentage={95} // Use almost all available space
                    />
                </div>
            </div>
        </div>
    );
}

export default DateSelectTable;