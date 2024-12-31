const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl'

export const espnApi = {
    async get(endpoint) {
        const response = await fetch(`${BASE_URL}${endpoint}`)
        const data = await response.json()
        return data
    }
}