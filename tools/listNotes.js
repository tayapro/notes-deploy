import idApi from '../api/idApi.js'
import notesApi from '../api/notesApi.js'

const username = process.argv[2]
const password = process.argv[3]

const user = await idApi.login(username, password)
const notes = await notesApi.listNotes(user.accessToken)
console.log(notes)
