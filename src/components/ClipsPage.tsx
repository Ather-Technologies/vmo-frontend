
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import LoadingScreen from "./LoadingScreen";
import Pagination from "./Pagination";
import { Clip, ClipDateStateDataProp } from '../lib/types'
import API_Interface from "../lib/InterfaceForAPI";

// Represents the properties for the clips page
interface ClipsPageProps {
    // Function to set the clip_id in the sibling component useState
    CDStateData: ClipDateStateDataProp;
}

function ClipsPage({ CDStateData }: ClipsPageProps) {
    const [clips, setClips] = useState<Clip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingText, setLoadingText] = useState<string | null>(null);
    const [currentItems, setCurrentItems] = useState<Clip[]>([]);
    const apiInterface = useMemo(() => new API_Interface(), []);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Shorthand the CDStateData values
    const [clip_id, setClipID, date_id] = [CDStateData.clip_id, CDStateData.setClipID, CDStateData.date_id];

    const tableRowRef = useRef<HTMLTableRowElement>(null);

    const onClick = useCallback((newClip_id: number) => {
        // Terminate early if the new clip_id is the same as the current clip_id
        if (newClip_id === clip_id)
            return;

        // Remove old highlight
        const oldRow = document.getElementById("vmo-clip-" + clip_id.toString());
        oldRow?.classList.remove("bg-slate-700");

        // Set the clip_id in the sibling component useState so the audio player can play the correct clip
        if (newClip_id) {
            setClipID(newClip_id);
        }
    }, [setClipID, clip_id]);

    useEffect(() => {
        // Set the clip_id to the oldest clip in the list
        if (isNaN(clip_id) && clips.length > 0) {
            setClipID(clips[0]?.id);
        }
        
        // Heres a bug fix lol.. 
        // So basically it would set the clip_id before the clips were loaded causing a 
        // race condition where you would change the date and the old clip would play if that date was without any clips
        // I could also just add a check to see if the clips[0].date_id is the same as the current date_id
        if (clips.length === 0) { 
            setClipID(NaN);
        }
    }, [clips, clip_id, setClipID, onClick]);

    useEffect(() => {
        // Set clip_id to NaN so the new clip can be loaded
        setClipID(NaN);

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

                // Fix pagination by adding at least 1 item to allow pagination calculations
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

    // Add highlight if on load if clip_id is set
     useEffect(() => {
         // Highlight that gentleman
         const row = document.getElementById("vmo-clip-" + clip_id.toString());
         row?.classList.add("bg-slate-700");
    }, [clip_id, currentItems]);

    useEffect(() => {
        // If loading = false set loading text back to null
        if (isLoading === false)
            setLoadingText(null);
    }, [isLoading]);

    if (isLoading) {
        return <LoadingScreen loadingText={loadingText ?? "Loading clips..."} />;
    } else {
        return (
            <div>
                <table className="table-auto w-full">
                    <tbody className="bg-slate-800">
                        {currentItems.map((clip, index) => (
                            <tr id={`vmo-clip-${clip.id}`} x-vmo-clipidx={index} onClick={() => onClick(clip?.id)} ref={tableRowRef} key={clip.id}>
                                <td className="border-b border-slate-700 p-4 pl-8">
                                    {CDStateData.selectedDateFullData.source.shorthand}
                                </td>
                                <td className="border-b border-slate-700 p-4">
                                    {new Date(CDStateData.selectedDateFullData.date).toLocaleDateString('en-US',
                                        { month: '2-digit', day: '2-digit', year: '2-digit', timeZone: 'UTC' },)}
                                </td>
                                <td className="border-b border-slate-700 p-4 pr-8">
                                    {clip.time}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination items={clips} tableRowRef={tableRowRef} setCurrentItems={setCurrentItems} paginationTag={'clips'} />
            </div>
        );
    }
}

// Exporting the component
export default ClipsPage;