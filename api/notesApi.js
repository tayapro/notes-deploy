import axios from 'axios'
import 'dotenv/config'

const myAxios = axios.create({
    withCredentials: true,
    baseURL: `${process.env.BASE_BE_URL}`,
})

async function addNote(accessToken, title, text) {
    try {
        const { status, data } = await myAxios({
            url: '/notes',
            method: 'post',
            data: {
                title,
                text,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        return {
            status,
            noteID: data,
        }
    } catch (e) {
        return { status: e.response.status }
    }
}

async function listNotes(accessToken) {
    try {
        const { status, data } = await myAxios({
            url: '/notes',
            method: 'get',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        return {
            status,
            notes: data,
        }
    } catch (e) {
        return { status: e.response.status }
    }
}

async function getNote(accessToken, noteID) {
    try {
        const { status, data } = await myAxios({
            url: `/notes/${noteID}`,
            method: 'get',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        return {
            status,
            note: data,
        }
    } catch (e) {
        return { status: e.response.status }
    }
}

async function deleteNote(accessToken, noteID) {
    try {
        const { status } = await myAxios({
            url: `/notes/${noteID}`,
            method: 'delete',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        return {
            status,
        }
    } catch (e) {
        return { status: e.response.status }
    }
}

async function updateNote(accessToken, noteID, updatedData) {
    try {
        const { status, data } = await myAxios({
            url: `/notes/${noteID}`,
            method: 'put',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            data: {
                title: updatedData.title,
                text: updatedData.text,
            },
        })
        return {
            status,
            note: data,
        }
    } catch (e) {
        return { status: e.response.status }
    }
}

export default {
    addNote,
    listNotes,
    getNote,
    deleteNote,
    updateNote,
}
