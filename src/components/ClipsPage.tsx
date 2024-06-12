
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

    // Shorthand the CDStateData values
    const [clip_id, setClipID, date_id] = [CDStateData.clip_id, CDStateData.setClipID, CDStateData.date_id];

    const tableRowRef = useRef<HTMLTableRowElement>(null);

    const onClick = useCallback((newClip_id: number) => {
        // Remove old highlight
        const oldRow = document.getElementById("vmo-clip-" + clip_id.toString());
        oldRow?.classList.remove("bg-slate-100");
        oldRow?.classList.remove("dark:bg-slate-700");

        // Add new highlight
        const row = document.getElementById("vmo-clip-" + newClip_id.toString());
        row?.classList.add("bg-slate-100");
        row?.classList.add("dark:bg-slate-700");

        // Set the clip_id in the sibling component useState so the audio player can play the correct clip
        if (newClip_id) {
            setClipID(newClip_id);
        }
    }, [setClipID, clip_id]);

    useEffect(() => {
        // Set the clip_id to the oldest clip in the list
        if (!clip_id && clips.length > 0) {
            setClipID(clips[0]?.id + clips.length - 1);
        }
    }, [clips, clip_id, setClipID, onClick]);

    useEffect(() => {
        // If clip_id or date_id is not set, terminate early
        if (!date_id) {
            setIsLoading(false);
            return;
        }

        // Fetch clips from the database and update the state
        apiInterface.getAllClipsByDateId(date_id).then((clips: Clip[]) => {
            setClips(clips);
            setIsLoading(false);

            // Fix pagination by adding at least 1 item to allow pagination calculations
            setCurrentItems(clips.slice(0, 1));
        });
    }, [date_id, apiInterface]);

    // Add highlight if on load the cookie is set
    useEffect(() => {
        // Highlight that gentleman
        const row = document.getElementById("vmo-clip-" + clip_id.toString());
        row?.classList.add("bg-slate-100");
        row?.classList.add("dark:bg-slate-700");
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
                    <tbody className="bg-white dark:bg-slate-800">
                        {currentItems.map((clip, index) => (
                            <tr id={`vmo-clip-${clip.id}`} x-vmo-clipidx={index} onClick={() => onClick(clip?.id)} ref={tableRowRef} key={clip.id}>
                                <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                                    {CDStateData.selectedDateFullData.source.shorthand}
                                </td>
                                <td className="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {'06/10/24'/* clip.date_id  date here */}
                                </td>
                                <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
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