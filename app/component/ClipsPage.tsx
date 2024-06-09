// Rework #1: Added error handling, better fetching, and general improvements

// Importing necessary libraries and components
import { useState, useEffect, useRef } from 'react';
import LoadingScreen from "./LoadingScreen";
import Pagination from "./Pagination";
import { Clip } from '../lib/types';

// Function to fetch clips from the API
async function fetchClips() {
    // Fetching data from the API
    const response = await fetch(`${process.env.API_HOST}/api/clips`, {
        headers: {
            "api-key": process.env.API_KEY ?? "set-api-key-in-dotenv", // Mostly just a development thing will be removed in production
        }
    });
    // Parsing the response to JSON
    const data = await response.json();
    // Mapping the data to the Clip type
    const clips: Clip[] = data["clipsJson"].map((clip: any) => ({
        id: clip.id,
        source: clip.source,
        // Formatting the date
        date: new Date(clip.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }),
        time: clip.time
    }));
    // Returning the clips
    return clips;
}

// Main component
function ClipsPage() {
    // State for storing the clips
    const [clips, setClips] = useState<Clip[]>([]);
    // State for storing the loading status
    const [isLoading, setIsLoading] = useState(true);
    // State for storing any potential error
    const [error, setError] = useState(null);
    // State for storing the current items
    const [currentItems, setCurrentItems] = useState<any[]>([]);

    // Ref for the table row
    const tableRowRef = useRef<HTMLTableRowElement>(null);

    // Fetching the clips on component mount
    useEffect(() => {
        fetchClips()
            .then(clips => {
                // Setting the clips and current items
                setClips(clips);
                setCurrentItems(clips.slice(0, 1));
                // Setting the loading status to false
                setIsLoading(false);
            })
            .catch(error => {
                // Setting the error and loading status
                setError(error);
                setIsLoading(false);
            });
    }, []);

    // If loading, return the loading screen
    if (isLoading) {
        return <LoadingScreen loadingText="Loading clips..." />;
    }

    // If there's an error, return an error message
    if (error) {
        return <div>Error: {(error as any).message}</div>;
    }

    // Render the table with the clips and the pagination
    return (
        <div>
            <table className="table-auto w-full">
                <tbody className="bg-white dark:bg-slate-800">
                    {currentItems.map((clip) => (
                        <tr ref={tableRowRef} key={clip.id}>
                            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{clip.source}</td>
                            <td className="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">{clip.date}</td>
                            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">{clip.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination items={clips} tableRowRef={tableRowRef} setCurrentItems={setCurrentItems} />
        </div>
    );
}

// Exporting the component
export default ClipsPage;