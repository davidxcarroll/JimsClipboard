import { espnApi } from './api'

export const teamService = {
    async getAllTeams() {
        const data = await espnApi.get('/teams')
        return data.sports[0].leagues[0].teams
    },

    async getTeamById(id) {
        return await espnApi.get(`/teams/${id}`)
    },

    async getTeamSchedule(id) {
        return await espnApi.get(`/teams/${id}/schedule`)
    }
}