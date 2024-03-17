import idApi from '../api/idApi.js'

const refreshToken = process.argv[2]

const result = await idApi.refresh(refreshToken)
console.log(result)
