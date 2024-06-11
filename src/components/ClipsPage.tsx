
import { useState, useEffect, useRef, useCallback } from 'react';
import LoadingScreen from "./LoadingScreen";
import Pagination from "./Pagination";
import { Clip, ClipDateStateDataProp } from '../lib/types'
import apiFetch from "../lib/APIInterface";

// Represents the properties for the clips page
interface ClipsPageProps {
    // Function to set the clip_id in the sibling component useState
    CDStateData: ClipDateStateDataProp;
}

function ClipsPage({ CDStateData }: ClipsPageProps) {
    const [clips, setClips] = useState<Clip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingText, setLoadingText] = useState<string | null>(null);
    const [currentItems, setCurrentItems] = useState<any[]>([]);

    // Shorthand the CDStateData values
    const [clip_id, setClipID, date_id] = [CDStateData.clip_id, CDStateData.setClipID, CDStateData.date_id];

    const tableRowRef = useRef<HTMLTableRowElement>(null);

    const onClick = useCallback((clip_id: number) => {
        // Remove old highlight
        const oldRow = document.getElementById("vmo-clip-" + clip_id.toString());
        oldRow?.classList.remove("bg-slate-100");
        oldRow?.classList.remove("dark:bg-slate-700");

        // Add new highlight
        const row = document.getElementById("vmo-clip-" + clip_id?.toString());
        row?.classList.add("bg-slate-100");
        row?.classList.add("dark:bg-slate-700");

        // Set the clip_id in the sibling component useState so the audio player can play the correct clip
        if (clip_id) {
            setClipID(clip_id);
        }
    }, [setClipID]);

    useEffect(() => {
        // If clip_id or date_id is not set, terminate early
        if (!clip_id || !date_id) {
            setIsLoading(false);
            return;
        }


        // Termintate if the date_id is not set
        if (!date_id)
            return;
        // Fetch clips from the database and update the state
        apiFetch(`/api/clips/${date_id ?? 1}`)
            .then(response => response.json())
            .then(data => {
                const clips: Clip[] = data["clipsJson"];

                setClips(clips);
                setIsLoading(false);

                // Fix pagination by adding at least 1 item to allow pagination calculations
                setCurrentItems(clips.slice(0, 1));

                if (clip_id >= clips[0]?.id && clip_id <= clips[0]?.id + clips.length - 1)
                    onClick(clip_id);
                //else // Set the clip_id to the oldest clip in the list
                //  onClick(clips[0]?.id + clips.length - 1);
            });

    }, [date_id, clip_id, onClick]);


    useEffect(() => { /// TODO------------------------------------------------------------------------------------------------------------------- CHECK DATE KEY TO SEE IF IT IS TODAY OTHERWISE DON'T PLAY ANYMORE OKEY??
        let interval: any;
        if (!date_id) // No sense in looking if there is no date selected
            return;

        // If the clip_id doesn't exist in the list of clips
        if (isNaN(clip_id) || !clips.some(clip => clip.id === clip_id)) {
            // Make api calls every 5 seconds to update clips list until the clip_id exists in the list of clips
            interval = setInterval(() => {
                setLoadingText('Checking for new clips...');
                setIsLoading(true);

                apiFetch(`/api/clips/${date_id ?? 1}`)
                    .then(response => response.json())
                    .then(data => {
                        const _clips: Clip[] = data["clipsJson"];

                        if (!clips?.length)
                            return false;

                        // Check if clips is the exact same as the current clips state by checking if _clips contains the clip_id
                        if (clips?.length === _clips?.length) {
                            setIsLoading(false);
                            console.log(clip_id, _clips)
                            return;
                        } else {
                            // Get that clippy guy
                            const newClipID = _clips[(_clips.findIndex(clip => clip.id === clips[0].id) - 1)].id;

                            console.log(newClipID);

                            // Set new list
                            setClips(_clips);

                            // Fix pagination by adding at least 1 item to allow pagination calculations
                            setCurrentItems(clips.slice(0, 1));

                            setIsLoading(false);

                            onClick(newClipID);

                            return () => clearInterval(interval);

                            // Woo now load that because I can't be bothered to make it work without a reload
                            //window.location.reload();
                        }
                    });
            }, 10000);
        }

        // If the clip_id does not exist in currentItems but exists in clips, and if current page is not 1 then make the page change
        if (currentItems.length > 0 && !currentItems.some(clip => clip.id === clip_id)) {
            // Get the attribute value x-vmo-itemsperpage from the pagination element where the attribute x-vmo-ptag === 'clips'
            const itemsPerPage = Number(document.querySelector(`[x-vmo-ptag="clips"]`)?.getAttribute('x-vmo-itemsperpage'));

            // Calculate the index of the clip_id in the list of all items.
            const clipKeyIndex = clips.findIndex(clip => clip.id === clip_id);
            // Calculate the page number that the clip_id is on based on the index and the number of items per page. Add 1 to get the actuall page number.
            const currentPage = Math.floor(clipKeyIndex / itemsPerPage) + 1;

            // Get elements by <a> tag and id === currentPage use the one with x-vmo-ptag === 'clips' and click it
            const pageButton = document.querySelector(`a[id="${currentPage}"][x-vmo-ptag="clips"]`) as HTMLAnchorElement;
            pageButton?.click();
        }

        return () => clearInterval(interval);
    }, [clip_id, clips, currentItems, date_id, onClick]);

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
                                <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{clip.source}</td>
                                <td className="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">{clip.date}</td>
                                <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">{clip.time}</td>
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