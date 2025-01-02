import { useState, useEffect } from 'react'
import { espnApi } from '../services/espn/api'

export function useTeamLogo(teamName) {
    const [logoUrl, setLogoUrl] = useState(null)
    const [teamColors, setTeamColors] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!teamName) {
            setLoading(false)
            return
        }

        const fetchLogo = async () => {
            try {
                const data = await espnApi.get('/teams')

                const team = data.sports[0].leagues[0].teams.find(
                    t => t.team.displayName.toLowerCase() === teamName.toLowerCase()
                )

                if (team && team.team) {
                    if (team.team.logos) {
                        const defaultLogo = team.team.logos.find(logo =>
                            logo.rel.includes('default')
                        )
                        if (defaultLogo) {
                            setLogoUrl(defaultLogo.href)
                        }
                    }
                    
                    // Set team colors
                    setTeamColors({
                        primary: `#${team.team.color}`,
                        alternate: `#${team.team.alternateColor}`
                    })
                }
            } catch (err) {

                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchLogo()
    }, [teamName])

    return { logoUrl, teamColors, loading, error }
}