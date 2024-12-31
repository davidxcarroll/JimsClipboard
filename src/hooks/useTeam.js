import { useState, useEffect } from 'react'
import { teamService } from '../services/espn/teams'

export function useTeam(teamName) {
    const [teamData, setTeamData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!teamName) {
            setLoading(false)
            return
        }

        async function fetchTeamData() {
            try {
                console.log('Fetching team data for:', teamName)
                const teams = await teamService.getAllTeams()
                console.log('Sample team structure:', teams[0])
                
                const team = teams.find(t => t.team.displayName === teamName)
                if (team) {
                    console.log('Found team:', team)
                    setTeamData({
                        name: team.team.displayName,
                        logo: team.team.logos?.[0]?.href,
                        abbreviation: team.team.abbreviation,
                        colors: {
                            primary: team.team.color,
                            secondary: team.team.alternateColor
                        }
                    })
                } else {
                    console.log('No team found for:', teamName)
                }
            } catch (err) {
                console.error('Error fetching team data:', err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchTeamData()
    }, [teamName])

    return { teamData, loading, error }
}