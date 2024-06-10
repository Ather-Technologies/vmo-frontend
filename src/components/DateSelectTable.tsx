import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from "./LoadingScreen";
import Pagination from "./Pagination";
import { ClipDate } from "../lib/types";
import apiFetch from "../lib/apiFetch";
import { ClipDateStateDataProp } from "../lib/types";

interface DSTProps {
    setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    CDStateData: ClipDateStateDataProp;
}

function DateSelectTable({CDStateData, setIsExpanded}: DSTProps) {
    const [dates, setDates] = useState<ClipDate[]>([]);
    // State for storing the loading status
    const [isLoading, setIsLoading] = useState(true);
    // State for storing the current items
    const [currentItems, setCurrentItems] = useState<ClipDate[]>([]);
    // Ref for the table row
    const tableRowRef = useRef<HTMLTableRowElement>(null);
    // State for storing the date key (id)
    const [dateKey, setDateKey] = [CDStateData.dateKey, CDStateData.setDateKey];

    useEffect(() => {
        // Add new highlight
        const row = document.getElementById("vmo-date-" + dateKey.toString());
        row?.classList.add("bg-slate-100");
        row?.classList.add("dark:bg-slate-700");
    }, [dateKey]);

    const onClick = (_dateKey: number) => {
        // Remove old highlight
        const oldRow = document.getElementById("vmo-date-" + dateKey.toString());
        oldRow?.classList.remove("bg-slate-100");
        oldRow?.classList.remove("dark:bg-slate-700");

        // Add new highlight
        const row = document.getElementById("vmo-date-" + _dateKey.toString());
        row?.classList.add("bg-slate-100");
        row?.classList.add("dark:bg-slate-700");

        // Set the _dateKey in the sibling component useState so the clips table can display the clips for the selected date
        if (_dateKey) {
            setDateKey(_dateKey);
        }

        setIsExpanded(false);
    }

    useEffect(() => {
        // Fetch dates from the database and update the state
        apiFetch(`/api/dates`)
            .then((response) => response.json())
            .then((data) => {
                const dates: ClipDate[] = data["clipDatesJson"].map((clipDate: any) => ({
                    id: clipDate.id,
                    agency: clipDate.agency,
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

                // Fix pagination by adding at least one item?
                // setCurrentItems(dates.slice(0, 1));
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
                        {currentItems.map((clipDateData) => (
                            <tr id={'vmo-date-' + clipDateData.id} onClick={() => onClick(clipDateData.id)} ref={tableRowRef} key={clipDateData.id}>
                                <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                                    {clipDateData.agency}
                                </td>
                                <td className="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                                    {clipDateData.date}
                                </td>
                                <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                                    {clipDateData.clipCount}
                                </td>
                                <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                                    {clipDateData.outageStatus !== '' ? (
                                        <FontAwesomeIcon icon={faCheckCircle} title="No outages" />
                                    ) : (
                                        <FontAwesomeIcon icon={faExclamationTriangle} title={clipDateData.outageStatus} />
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