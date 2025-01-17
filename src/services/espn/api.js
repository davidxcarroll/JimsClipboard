const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl'

export const espnApi = {
    async get(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`ESPN API error: ${response.status}`);
            }

            const data = await response.json();
            
            // Debug API response in development
            if (import.meta.env.DEV) {
                console.debug('🏈 ESPN API Response:', {
                    endpoint,
                    data
                });
            }
            
            return data;
        } catch (error) {
            console.error('ESPN API error:', error);
            throw error;
        }
    }
}