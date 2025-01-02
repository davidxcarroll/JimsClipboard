const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl'

export const espnApi = {
    async get(endpoint) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Origin': window.location.origin
            },
            mode: 'cors'  // Try with cors first
        }).catch(async (error) => {
            // If cors fails, try without cors
            return await fetch(`${BASE_URL}${endpoint}`, {
                method: 'GET',
                mode: 'no-cors'
            });
        });

        const data = await response.json();
        return data;
    }
}