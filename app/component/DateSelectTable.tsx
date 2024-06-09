"use client"

// Imports
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from "./LoadingScreen";
import Pagination from "./Pagination";
import { ClipDate } from "../lib/types";

// Function to fetch clip dates from the API
async function fetchClipDates() {
    // Fetching data from the API
    const response = await fetch(`${process.env.API_HOST}/api/dates`, {
        headers: {
            "api-key": process.env.API_KEY ?? "set-api-key-in-dotenv", // Mostly just a development thing will be removed in production
        }
    });
    // Checking if the response is OK
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Parsing the response to JSON
    const data = await response.json();
    // Checking if the data is in the expected format
    if (!data || !data["clipDatesJson"]) {
        throw new Error("Unexpected data structure");
    }
    // Returning the clip dates
    return data["clipDatesJson"];
}

// Main component
function DateSelectTable() {
    // State for storing the clip dates
    const [dates, setDates] = useState<ClipDate[]>([]);
    // State for storing the loading status
    const [isLoading, setIsLoading] = useState(true);
    // State for storing the current items
    const [currentItems, setCurrentItems] = useState<ClipDate[]>([]);
    // Ref for the table row
    const tableRowRef = useRef<HTMLTableRowElement>(null);

    // Fetching the clip dates on component mount
    useEffect(() => {
        fetchClipDates()
            .then((clipDatesJson) => {
                // Mapping the data to the ClipDate type
                const dates: ClipDate[] = clipDatesJson.map((clipDate: any) => ({
                    id: clipDate.id,
                    source: clipDate.source,
                    // Formatting the date
                    date: new Date(clipDate.date).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "2-digit",
                    }),
                    clipCount: clipDate.clipCount + " Clips",
                    outageStatus: clipDate.outageStatus,
                }));
                // Setting the clip dates and the loading status
                setDates(dates);
                setIsLoading(false);
            })
            .catch((error) => {
                // Logging any potential error
                console.error("Fetch error: ", error);
            });
    }, []);

    // If loading, return the loading screen
    if (isLoading) {
        return <LoadingScreen loadingText="Loading dates..." />;
    } else {
        // Render the table with the clip dates and the pagination
        return (
            <div>
                <table className="table-auto w-full">
                    <tbody className="bg-white dark:bg-slate-800">
                        {currentItems.map(({ id, source, date, clipCount, outageStatus }) => (
                            <tr ref={tableRowRef} key={id}>
                                <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                                    {source}
                                </td>
                                <td className="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {date}
                                </td>
                                <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                                    {clipCount}
                                </td>
                                <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                                    {outageStatus === '' ? (
                                        <FontAwesomeIcon icon={faCheckCircle} title="No outages" />
                                    ) : (
                                        <FontAwesomeIcon icon={faExclamationTriangle} title={outageStatus} />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination items={dates} tableRowRef={tableRowRef} setCurrentItems={setCurrentItems} />
            </div>
        );
    }
}

// Exporting the component
export default DateSelectTable;