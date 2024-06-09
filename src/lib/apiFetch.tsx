export default function apiFetch(url: string, options: RequestInit = {}): Promise<any> {
    let fetchPromise: Promise<any> = new Promise(() => {});
    try {
        fetchPromise =  fetch(process.env.REACT_APP_API_HOST + url, { 
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json', 
                'api-key': process.env.REACT_APP_API_KEY ?? ''
            } 
        });
    } catch (fetchError) {
        console.error(fetchError);
    }
    return fetchPromise;
} // Api-key is just a development POC, it will be removed in production. The user will have to authenticate with a username and password.