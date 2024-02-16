import idApi from '../api/idApi.js'

const username = process.argv[2]
const password = process.argv[3]

const result = await idApi.login(username, password)
console.log(result)
