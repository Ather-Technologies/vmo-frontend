import { ClipDate, Clip } from './types';

// Interface for standardizing API calls
export default class API_Interface {
    // GET /clips/one/latest/date_id/:date_id
    // GET /clips/many/date_id/:date_id
    // GET /dates/many/source_id/:source_id
    // GET /dates/one/date_id/:dateKey

    // TO:DO: ---------- Impliment state storage for the actual date object including the whole source object.

    // Fetch all the clips with the date_id
    getAllClipsByDateId = async (dateId: number): Promise<Clip[]> =>
        await this.makeApiFetch(`/clips/many/date_id/${dateId}`);

    // Fetch all dates that have a source id of sourceId.
    getAllDatesBySourceId = async (sourceId: number): Promise<ClipDate[]> =>
        await this.makeApiFetch(`/dates/many/source_id/${sourceId}`);

    async makeApiFetch(url: string): Promise<any> {
        const result = await fetch(`${process.env.REACT_APP_API_HOST}/api${url}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        // If the result is undefined, return an empty array
        if (!result) return [];

        // Parse the result as JSON
        const json = await result.json();

        // cast the result as an array of Clip objects
        return json;
    }
}
