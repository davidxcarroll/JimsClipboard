import { useState, useEffect } from 'react'

export function useTeamLogo(teamName) {
    const [logoUrl, setLogoUrl] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!teamName) {
            setLoading(false)
            return
        }

        const fetchLogo = async () => {
            try {
                // ESPN API endpoint for NFL teams
                const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams`)
                const data = await response.json()
                
                // Find the team in the response
                const team = data.sports[0].leagues[0].teams.find(
                    t => t.team.name.toLowerCase() === teamName.toLowerCase()
                )

                if (team) {
                    setLogoUrl(team.team.logos[0].href)
                }
            } catch (err) {
                console.error('Error fetching team logo:', err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchLogo()
    }, [teamName])

    return { logoUrl, loading, error }
}