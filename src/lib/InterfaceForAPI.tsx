import { ClipDate, Clip, FullClipDate } from './types';
import { InterfaceForAPI_DemoData } from './DemoData';

// Interface for standardizing API calls
export default class API_Interface {
    // GET /clips/one/latest/date_id/:date_id
    // GET /clips/many/date_id/:date_id
    // GET /dates/many/source_id/:source_id
    // GET /dates/one/date_id/:dateKey

    // TO:DO: ---------- Impliment state storage for the actual date object including the whole source object.

    // Fetch fulll data from db with the date_id
    getFullDateFromDateID = async (dateId: number): Promise<FullClipDate> =>
        process.env.REACT_APP_DEMO ? InterfaceForAPI_DemoData.getFullDateFromDateID(dateId) : (await this.makeApiFetch(`/dates/one/date_id/${dateId}`))?.date;

    // Fetch all the clips with the date_id
    getAllClipsByDateId = async (dateId: number): Promise<Clip[]> =>
        process.env.REACT_APP_DEMO ? InterfaceForAPI_DemoData.getAllClipsByDateId(dateId) : (await this.makeApiFetch(`/clips/many/date_id/${dateId}`));

    // Fetch all dates that have a source id of sourceId.
    getAllDatesBySourceId = async (sourceId: number): Promise<ClipDate[]> =>
        process.env.REACT_APP_DEMO ? InterfaceForAPI_DemoData.getAllDatesBySourceId(sourceId) : (await this.makeApiFetch(`/dates/many/source_id/${sourceId}`));

    async makeApiFetch(url: string): Promise<any> {
        let result;
        try {
            result = await fetch(`${process.env.REACT_APP_API_HOST}/api${url}`.replaceAll('"', ''), {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
        }
        catch (e) {
            console.error(e);
        }

        // If the result is undefined, return an empty array
        if (!result) return [];

        // Parse the result as JSON
        const json = await result.json();

        console.log(json);

        // cast the result as an array of Clip objects
        return json;
    }
}
