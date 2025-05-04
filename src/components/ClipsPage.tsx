import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarDay, faBuilding, faVolumeHigh, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from "./LoadingScreen";
import Pagination from "./Pagination";
import { Clip, ClipDateStateDataProp, Tone } from '../lib/types'
import API_Interface from "../lib/InterfaceForAPI";

interface ClipsPageProps {
    CDStateData: ClipDateStateDataProp;
}

function ClipsPage({ CDStateData }: ClipsPageProps) {
    const [clips, setClips] = useState<Clip[]>([]);
    const [tones, setTones] = useState<Tone[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingText, setLoadingText] = useState<string | null>(null);
    const [currentItems, setCurrentItems] = useState<Clip[]>([]);
    const apiInterface = useMemo(() => new API_Interface(), []);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const initialLoadRef = useRef(true);
    const currentPageRef = useRef<number>(1);
    const prevDateIdRef = useRef<number | undefined>(undefined);

    // Shorthand the CDStateData values
    const [clip_id, setClipID, date_id] = [CDStateData.clip_id as number | null, CDStateData.setClipID as React.Dispatch<React.SetStateAction<number | null>>, CDStateData.date_id];

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
        if (clips.length > 0 && (clip_id === null || initialLoadRef.current)) {
            const firstClipId = clips[0]?.id;
            setClipID(firstClipId);
            initialLoadRef.current = false;
        }

        // Fix for race condition
        if (clips.length === 0) {
            setClipID(null);
            initialLoadRef.current = true;
        }
    }, [clips, clip_id, setClipID]);

    const getActiveClipsLength = useCallback(() => {
        // Get the length of the clips that are currently active
        return clips.length;
    }, [clips]);

    useEffect(() => {
        let isMounted = true; // Track if the component is mounted

        // If the date_id changed, reset clip selection and loading state
        if (prevDateIdRef.current !== date_id) {
            setClipID(NaN);
            setClips([]);
            setCurrentItems([]);
            setIsLoading(true);
            initialLoadRef.current = true;
            prevDateIdRef.current = date_id;
        }

        if (!date_id) {
            setClips([]); // Clear clips if no date selected
            setIsLoading(false);
            return;
        }

        const fetchClips = () => {
            setIsLoading(true); // Start loading before fetch
            apiInterface.getAllClipsByDateId(date_id).then((newClips: Clip[]) => {
                if (!isMounted) return; // Prevent state update if component is unmounted

                // if the clips are not a different length than the current clips, set the loading text
                if (newClips.length === getActiveClipsLength()) {
                    setIsLoading(false);
                    return;
                }
                setClips(newClips);
                setCurrentItems(newClips.slice(0, 1));
                setIsLoading(false);
            });
        };

        fetchClips();

        if (!intervalRef.current)
            intervalRef.current = setInterval(fetchClips, 30000);

        return () => {
            isMounted = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [date_id, setClipID, apiInterface, getActiveClipsLength]);

    // Fetch tones for the current source
    useEffect(() => {
        if (CDStateData.selectedDateFullData && CDStateData.selectedDateFullData.source &&
            CDStateData.selectedDateFullData.source.id) {
            const sourceId = CDStateData.selectedDateFullData.source.id;
            apiInterface.getAllTonesBySourceId(sourceId).then((tonesData: Tone[]) => {
                setTones(tonesData);
            });
        }
    }, [CDStateData.selectedDateFullData, apiInterface]);

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
            console.error("Error formatting date:", e);
            return '';
        }
    }, [CDStateData.selectedDateFullData]);

    // Function to determine if an item is the active clip
    const isActiveClip = useCallback((itemId: number) => {
        return itemId === clip_id;
    }, [clip_id]);

    // Function to check if a clip has processed tones
    const hasProcessedTones = useCallback((clip: Clip) => {
        return clip.tone_processed === true && clip.tones_id !== undefined && clip.tones_id !== null;
    }, []);

    // Function to get tone indicator styles for a clip
    const getToneIndicatorStyle = useCallback((clip: Clip) => {
        if (hasProcessedTones(clip)) {
            // Get the tone that matches the clip's tones_id
            const clipTone = tones.find(tone => tone.id === clip.tones_id);

            if (clipTone) {
                return {
                    borderColor: `#${clipTone.color}`,
                    borderLeftWidth: '4px',
                    // Add a slight background tint
                    backgroundColor: `#${clipTone.color}15` // Using 15% opacity
                };
            }
        }
        return {};
    }, [tones, hasProcessedTones]);

    // Render tones list
    const renderTones = useCallback(() => {
        if (tones.length === 0) return null;

        return (
            <div className="mt-4 mb-6 px-4 md:px-6">
                <h3 className="text-sm text-gray-400 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faVolumeHigh} className="mr-2" />
                    Available Tones
                </h3>
                <div className="flex flex-wrap gap-2">
                    {tones.map(tone => (
                        <div
                            key={tone.id}
                            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                            style={{ backgroundColor: `#${tone.color}30` }} // Using 30 opacity
                        >
                            <span
                                className="h-2 w-2 rounded-full mr-1.5"
                                style={{ backgroundColor: `#${tone.color}` }}
                            ></span>
                            <span className="capitalize" style={{ color: `#${tone.color}` }}>
                                {tone.name}
                            </span>
                            <span className="ml-1.5 text-gray-400 text-[10px]">
                                {tone.frequencies.join("hz, ") + "hz"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }, [tones]);

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
                {renderTones()}
            </div>
        );
    }

    return (
        <div className="rounded-lg overflow-hidden shadow-lg border border-gray-700/50 mb-16 md:mb-20">
            {/* Tones section */}
            {renderTones()}

            {/* Mobile View: Cards layout */}
            <div className="md:hidden">
                {/* Show all clips instead of just currentItems for mobile view */}
                {clips.map((clip, index) => (
                    <div
                        id={`vmo-clip-${clip.id}`}
                        key={clip.id}
                        x-vmo-clipidx={index}
                        onClick={() => onClick(clip.id)}
                        className={`p-4 border-b border-gray-700/50 transition-all duration-200 hover:bg-gray-700/30 cursor-pointer
                            ${isActiveClip(clip.id) ? 'bg-indigo-800/40 border-l-4 border-blue-500' : ''}`}
                        style={isActiveClip(clip.id) ? {} : getToneIndicatorStyle(clip)}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-indigo-900/20 mr-3">
                                    <FontAwesomeIcon icon={faClock} className="text-indigo-300" />
                                </div>
                                <span className="font-medium">{clip.time}</span>
                            </div>
                            {hasProcessedTones(clip) && (() => {
                                const clipTone = tones.find(t => t.id === clip.tones_id);
                                return (
                                    <span className="ml-2 inline-flex items-center">
                                        <FontAwesomeIcon
                                            icon={faCheckCircle}
                                            className="text-xs"
                                            style={{
                                                color: `#${clipTone?.color || '4ADE80'}`
                                            }}
                                        />
                                    </span>
                                );
                            })()}
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
                            {hasProcessedTones(clip) && (() => {
                                const clipTone = tones.find(t => t.id === clip.tones_id);
                                return (
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faVolumeHigh} className="text-green-300 mr-1" />
                                        <span className="capitalize" style={{
                                            color: `#${clipTone?.color || '4ADE80'}`
                                        }}>
                                            {clipTone?.name || 'Processed'}
                                        </span>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                ))}

                {/* Still keep the hidden pagination to track the selected page for desktop view */}
                <div className="hidden">
                    <Pagination
                        items={clips}
                        tableRowRef={tableRowRef}
                        setCurrentItems={setCurrentItems}
                        paginationTag="clips-mobile"
                        hideUI={true}
                        viewportPercentage={55}
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
                                <th className="px-6 py-3 text-left">Tone</th>
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
                                    style={isActiveClip(clip.id) ? {} : getToneIndicatorStyle(clip)}
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
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {hasProcessedTones(clip) ? (() => {
                                            const clipTone = tones.find(t => t.id === clip.tones_id);
                                            return (
                                                <div className="flex items-center">
                                                    <div className="h-2 w-2 rounded-full mr-2"
                                                        style={{
                                                            backgroundColor: `#${clipTone?.color || '4ADE80'}`
                                                        }}
                                                    />
                                                    <span className="capitalize text-sm" style={{
                                                        color: `#${clipTone?.color || '4ADE80'}`
                                                    }}>
                                                        {clipTone?.name || 'Processed'}
                                                    </span>
                                                </div>
                                            );
                                        })() : (
                                            <span className="text-gray-500 text-sm">—</span>
                                        )}
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