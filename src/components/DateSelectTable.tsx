import { useState, useEffect, useRef, useMemo } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from "./LoadingScreen";
import Pagination from "./Pagination";
import { ClipDate } from "../lib/types";
import API_Interface from "../lib/InterfaceForAPI";
import { ClipDateStateDataProp } from "../lib/types";
import NoSleep from 'nosleep.js';

interface DSTProps {
    setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    CDStateData: ClipDateStateDataProp;
}

function DateSelectTable({ CDStateData, setIsExpanded }: DSTProps) {
    // List of dates
    const [clipDates, setClipDates] = useState<ClipDate[]>([]);
    // State for storing the loading status
    const [isLoading, setIsLoading] = useState(true);
    // State for storing the current items
    const [currentItems, setCurrentItems] = useState<ClipDate[]>([]);
    // Ref for the table row
    const tableRowRef = useRef<HTMLTableRowElement>(null);
    // State for storing the date key (id)
    const [date_id, setDateID] = [CDStateData.date_id, CDStateData.setDateID];
    // Api interface instance
    const apiInterface = useMemo(() => new API_Interface(), []);

    useEffect(() => {
        // Add new highlight
        const row = document.getElementById("vmo-date-" + date_id.toString());
        row?.classList.add("bg-slate-700");
    }, [date_id, currentItems]);

    const onClick = (newDate_id: number) => {
        const noSleep = new NoSleep();
        noSleep.disable();
        noSleep.enable();

        // Remove old highlight
        const oldRow = document.getElementById("vmo-date-" + date_id.toString());
        oldRow?.classList.remove("bg-slate-700");

        // Add new highlight
        const row = document.getElementById("vmo-date-" + newDate_id.toString());
        row?.classList.add("bg-slate-700");

        // Set the _dateKey in the sibling component useState so the clips table can display the clips for the selected date
        if (newDate_id) {
            apiInterface.getFullDateFromDateID(newDate_id).then((date) => CDStateData.setSelectedDateFullData(date));
            setDateID(newDate_id);
        }

        setIsExpanded(false);
    }

    useEffect(() => {
        const fetchDatesFromAPI = async () => {
            // Get all dates by source id
            const datesData = await apiInterface.getAllDatesBySourceId(1); // ----------------- TO:DO not hard code this way later on when I get multi source clips going.

            // Convert dates to locale format
            const formattedDates = datesData.map((dateData) => {
                const date = new Date(dateData.date);
                const formattedDate = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit', timeZone: "UTC" });
                return { ...dateData, date: formattedDate };
            });

            setClipDates(formattedDates);
            setIsLoading(false);

            // Fix pagination by adding at least one item?
            // setCurrentItems(dates.slice(0, 1));
        }

        // Fetch the dates from the API
        fetchDatesFromAPI();
    }, [apiInterface]);

    // If loading, return the loading screen
    if (isLoading) {
        return <LoadingScreen loadingText="Loading dates..." />;
    } else {
        // Render the table with the clip dates and the pagination
        return (
            <div>
                <table className="table-auto w-full">
                    <tbody className="bg-slate-800">
                        {currentItems.map((clipDateData) => (
                            <tr id={'vmo-date-' + clipDateData.id} onClick={() => onClick(clipDateData.id)} ref={tableRowRef} key={clipDateData.id}>
                                <td className="border-b border-slate-700 p-4 pl-8">
                                    {/* CDStateData.selectedDateFullData.source.name er somthin */"Sanders County Sheriff's Office"}
                                </td>
                                <td className="border-b border-slate-700 p-4">
                                    {clipDateData.date}
                                </td>
                                <td className="border-b border-slate-700 p-4 pr-8 hidden">
                                    {"DateID: " + clipDateData.id} {/* TO:DO count the # of clips for the date and display it here somehow :) */}
                                </td>
                                <td className="border-b border-slate-700 p-4 pr-8">
                                    {true ? ( // -------------------- TO:DO This also needs to be setup later with dynamic lookup of outage status preferably sent with dates from the API
                                        <FontAwesomeIcon icon={faCheckCircle} title="No outage detection setup" />
                                    ) : (
                                        <FontAwesomeIcon icon={faExclamationTriangle} title={'Yeah there was an outage.'} />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination items={clipDates} tableRowRef={tableRowRef} setCurrentItems={setCurrentItems} />
            </div>
        );
    }
}

// Exporting the component
export default DateSelectTable;