import axios from 'axios'
import 'dotenv/config'

const myAxios = axios.create({
    baseURL: `${process.env.BASE_ID_URL}/api`,
})

async function login(username, password) {
    try {
        const { status, data } = await myAxios({
            url: '/login',
            method: 'post',
            data: {
                username,
                password,
            },
        })
        return {
            status,
            refreshToken: data.refreshToken,
            accessToken: data.accessToken,
        }
    } catch (e) {
        return { status: e.response.status, refreshToken: '', accessToken: '' }
    }
}

async function register(username, password) {
    try {
        const { status, data } = await myAxios({
            url: '/register',
            method: 'post',
            data: {
                username,
                password,
            },
        })
        return {
            status,
            refreshToken: data.refreshToken,
            accessToken: data.accessToken,
        }
    } catch (e) {
        return { status: e.response.status, refreshToken: '', accessToken: '' }
    }
}

async function refresh(refreshToken) {
    try {
        const { status, data } = await myAxios({
            url: '/refresh',
            method: 'post',
            data: {
                refreshToken,
            },
        })
        return {
            status,
            username: data.username,
            refreshToken: data.refreshToken,
            accessToken: data.accessToken,
        }
    } catch (e) {
        return { status: e.response.status, refreshToken: '', accessToken: '' }
    }
}

export default {
    login,
    register,
    refresh,
}
