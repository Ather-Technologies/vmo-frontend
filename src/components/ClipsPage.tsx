import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faClock, faCalendarDay, faBuilding } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from "./LoadingScreen";
import Pagination from "./Pagination";
import { Clip, ClipDateStateDataProp } from '../lib/types'
import API_Interface from "../lib/InterfaceForAPI";

interface ClipsPageProps {
    CDStateData: ClipDateStateDataProp;
}

function ClipsPage({ CDStateData }: ClipsPageProps) {
    const [clips, setClips] = useState<Clip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingText, setLoadingText] = useState<string | null>(null);
    const [currentItems, setCurrentItems] = useState<Clip[]>([]);
    const apiInterface = useMemo(() => new API_Interface(), []);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const initialLoadRef = useRef(true);
    const currentPageRef = useRef<number>(1);

    // Shorthand the CDStateData values
    const [clip_id, setClipID, date_id] = [CDStateData.clip_id, CDStateData.setClipID, CDStateData.date_id];

    const tableRowRef = useRef<HTMLTableRowElement>(null);

    // Simplified onClick handler - just update the state
    const onClick = useCallback((newClip_id: number) => {
        // Terminate early if the new clip_id is the same as the current clip_id
        if (newClip_id === clip_id) return;

        console.log(`Clicked on clip: ${newClip_id}`);

        // Just update the clip ID state - the CSS will handle the highlighting
        if (newClip_id) {
            setClipID(newClip_id);
        }
    }, [setClipID, clip_id]);

    // Update currentPageRef when pagination changes
    useEffect(() => {
        const paginationElement = document.getElementById("x-vmo-pagination");
        if (paginationElement) {
            const pageText = paginationElement.textContent;
            if (pageText) {
                const match = pageText.match(/(\d+)\/\d+/);
                if (match && match[1]) {
                    const pageNum = parseInt(match[1], 10);
                    currentPageRef.current = pageNum;
                }
            }
        }
    }, [currentItems]);

    useEffect(() => {
        // If clips are loaded and no clip is selected, set the first clip
        if (clips.length > 0 && (isNaN(clip_id) || initialLoadRef.current)) {
            const firstClipId = clips[0]?.id;
            setClipID(firstClipId);
            initialLoadRef.current = false;
        }

        // Fix for race condition
        if (clips.length === 0) {
            setClipID(NaN);
            initialLoadRef.current = true;
        }
    }, [clips, clip_id, setClipID]);

    useEffect(() => {
        // Set clip_id to NaN so the new clip can be loaded
        setClipID(NaN);
        initialLoadRef.current = true;

        // If clip_id or date_id is not set, terminate early
        if (!date_id) {
            setIsLoading(false);
            return;
        }

        // Fetch clips from the database and update the state
        const fetchClips = () => {
            console.log("Fetching clips for date_id: " + date_id);
            apiInterface.getAllClipsByDateId(date_id).then((clips: Clip[]) => {
                setClips(clips);
                setIsLoading(false);
                setCurrentItems(clips.slice(0, 1));
            });
        };

        fetchClips();

        // Set interval to fetch clips every 30 seconds
        if (!intervalRef.current)
            intervalRef.current = setInterval(fetchClips, 30000);

        // Clear interval on component unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [date_id, setClipID, apiInterface]);

    useEffect(() => {
        // If loading = false set loading text back to null
        if (isLoading === false)
            setLoadingText(null);
    }, [isLoading]);

    // Format date for display
    const formattedDate = useMemo(() => {
        try {
            return new Date(CDStateData.selectedDateFullData.date).toLocaleDateString('en-US',
                { month: '2-digit', day: '2-digit', year: '2-digit', timeZone: 'UTC' });
        } catch (e) {
            return '';
        }
    }, [CDStateData.selectedDateFullData]);

    // Function to determine if an item is the active clip
    const isActiveClip = useCallback((itemId: number) => {
        return itemId === clip_id;
    }, [clip_id]);

    if (isLoading) {
        return <LoadingScreen loadingText={loadingText ?? "Loading clips..."} />;
    }

    if (clips.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                <div className="text-gray-400 text-6xl mb-4">
                    <FontAwesomeIcon icon={faClock} className="opacity-30" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Clips Available</h3>
                <p className="text-gray-400 max-w-md">
                    There are no clips available for this date. Please select a different date or check back later.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-lg overflow-hidden shadow-lg border border-gray-700/50 mb-16 md:mb-20">
            {/* Mobile View: Cards layout */}
            <div className="md:hidden">
                {currentItems.map((clip, index) => (
                    <div
                        id={`vmo-clip-${clip.id}`}
                        key={clip.id}
                        x-vmo-clipidx={index}
                        onClick={() => onClick(clip.id)}
                        className={`p-4 border-b border-gray-700/50 transition-all duration-200 hover:bg-gray-700/30 cursor-pointer
                            ${isActiveClip(clip.id) ? 'bg-indigo-800/40 border-l-4 border-blue-500' : ''}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-indigo-900/20 mr-3">
                                    <FontAwesomeIcon icon={faClock} className="text-indigo-300" />
                                </div>
                                <span className="font-medium">{clip.time}</span>
                            </div>
                            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-900/20">
                                <FontAwesomeIcon icon={faPlay} className="text-green-400" />
                            </div>
                        </div>
                        <div className="flex flex-wrap text-xs text-gray-400 space-x-4">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faBuilding} className="text-blue-300 mr-1" />
                                <span>{CDStateData.selectedDateFullData.source.shorthand}</span>
                            </div>
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faCalendarDay} className="text-purple-300 mr-1" />
                                <span>{formattedDate}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Hidden pagination that still handles the logic */}
                <div className="hidden">
                    <Pagination
                        items={clips}
                        tableRowRef={tableRowRef}
                        setCurrentItems={setCurrentItems}
                        paginationTag="clips-mobile"
                        hideUI={true}
                        viewportPercentage={55} // Use 55% of viewport height on mobile
                    />
                </div>
            </div>

            {/* Desktop View: Table layout */}
            <div className="hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs uppercase tracking-wider text-gray-400 bg-gray-800/50">
                                <th className="px-6 py-3 text-left">Source</th>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Time</th>
                                <th className="px-6 py-3 text-left w-16"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((clip, index) => (
                                <tr
                                    id={`vmo-clip-${clip.id}`}
                                    key={clip.id}
                                    x-vmo-clipidx={index}
                                    onClick={() => onClick(clip.id)}
                                    ref={tableRowRef}
                                    className={`transition-all duration-200 hover:bg-gray-700/30 cursor-pointer
                                        ${isActiveClip(clip.id) ? 'bg-indigo-800/40 border-l-4 border-blue-500' : ''}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-900/20 mr-3">
                                                <FontAwesomeIcon icon={faBuilding} className="text-blue-300" />
                                            </div>
                                            <span>{CDStateData.selectedDateFullData.source.shorthand}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-purple-900/20 mr-3">
                                                <FontAwesomeIcon icon={faCalendarDay} className="text-purple-300" />
                                            </div>
                                            <span>{formattedDate}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-indigo-900/20 mr-3">
                                                <FontAwesomeIcon icon={faClock} className="text-indigo-300" />
                                            </div>
                                            <span>{clip.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-900/20">
                                            <FontAwesomeIcon icon={faPlay} className="text-green-400" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Visible pagination for desktop */}
                <div className="bg-gray-800/70 border-t border-gray-700/50">
                    <Pagination
                        items={clips}
                        tableRowRef={tableRowRef}
                        setCurrentItems={setCurrentItems}
                        paginationTag="clips-desktop"
                        viewportPercentage={85} // Higher percentage for desktop
                    />
                </div>
            </div>
        </div>
    );
}

export default ClipsPage;