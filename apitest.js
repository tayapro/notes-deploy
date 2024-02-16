import idApi from './api/idApi.js'
import notesApi from './api/notesApi.js'

function randomString() {
    return (Math.random() + 1).toString(36).substring(3)
}

/////////////////

async function testID() {
    const username = `T_${randomString()}`
    const password = randomString()

    const testLogin400 = await idApi.login(username, password)
    if (testLogin400.status !== 400) {
        return {
            result: false,
            message: `FAILED: testID: unexpected login code ${testLogin400.status}, expected 400`,
        }
    }

    const testRegister200 = await idApi.register(username, password)
    if (testRegister200.status !== 200) {
        return {
            result: false,
            message: `FAILED: testID: unexpected register code ${testRegister200.status}, expected 200`,
        }
    }

    const testLogin200 = await idApi.login(username, password)
    if (testLogin200.status !== 200) {
        return {
            result: false,
            message: `FAILED: testID: unexpected login code ${testLogin200.status}, expected 200`,
        }
    }

    return {
        result: true,
        message: 'PASSED: testID',
        username,
        password,
        accessToken: testLogin200.accessToken,
    }
}

async function testAddNote(token) {
    const testBadToken = await notesApi.addNote('BAD_TOKEN', 'bla', 'bla')
    if (testBadToken.status !== 400) {
        return {
            result: false,
            message: `FAILED: testAddNote: unexpected bad token code ${testBadToken.status}, expected 400`,
        }
    }

    const testGoodToken = await notesApi.addNote(
        token,
        `title ${randomString()}`,
        `0123456789 ${randomString()} ${randomString()} ${randomString()}`
    )
    if (testGoodToken.status !== 200) {
        return {
            result: false,
            message: `FAILED: testAddNote: unexpected good token code ${testGoodToken.status}, expected 200`,
        }
    }

    return {
        result: true,
        message: 'PASSED: testAddNote',
        noteID: testGoodToken.noteID,
    }
}

async function testListNotes(token, expectedNumberOfNotes) {
    const testBadToken = await notesApi.listNotes('BAD_TOKEN')
    if (testBadToken.status !== 400) {
        return {
            result: false,
            message: `FAILED: testListNotes: unexpected bad token code ${testBadToken.status}, expected 400`,
        }
    }

    const testGoodToken = await notesApi.listNotes(token)
    if (testGoodToken.status !== 200) {
        return {
            result: false,
            message: `FAILED: testListNotes: unexpected good token code ${testGoodToken.status}, expected 200`,
        }
    }
    const numNotes = testGoodToken.notes.length
    if (numNotes !== expectedNumberOfNotes) {
        return {
            result: false,
            message: `FAILED: testListNotes: unexpected number of notes ${numNotes}, expected ${expectedNumberOfNotes}`,
        }
    }

    return {
        result: true,
        message: 'PASSED: testListNotes',
        notes: testGoodToken.notes,
    }
}

async function testGetNote(token, noteID, expectedTitle, expectedText) {
    const testBadToken = await notesApi.getNote('BAD_TOKEN', 'bla', 'bla')
    if (testBadToken.status !== 400) {
        return {
            result: false,
            message: `FAILED: testGetNote: unexpected bad token code ${testBadToken.status}, expected 400`,
        }
    }

    const testGoodToken = await notesApi.getNote(token, noteID)
    if (testGoodToken.status !== 200) {
        return {
            result: false,
            message: `FAILED: testGetNote: unexpected good token code ${testGoodToken.status}, expected 200`,
        }
    }

    if (testGoodToken.note.title !== expectedTitle) {
        return {
            result: false,
            message: `FAILED: testGetNote: unexpected title of note ${testGoodToken.note.title}, expected ${expectedTitle}`,
        }
    }

    if (testGoodToken.note.text !== expectedText) {
        return {
            result: false,
            message: `FAILED: testGetNote: unexpected text of note ${testGoodToken.note.text}, expected ${expectedText}`,
        }
    }

    return {
        result: true,
        message: 'PASSED: testGetNote',
        noteID,
    }
}

async function testDeleteNote(token, noteID) {
    const testBadToken = await notesApi.deleteNote('BAD_TOKEN', 'bla', 'bla')
    if (testBadToken.status !== 400) {
        return {
            result: false,
            message: `FAILED: testDeleteNote: unexpected bad token code ${testBadToken.status}, expected 400`,
        }
    }

    const testGoodToken = await notesApi.deleteNote(token, noteID)
    if (testGoodToken.status !== 200) {
        return {
            result: false,
            message: `FAILED: testDeleteNote: unexpected good token code ${testGoodToken.status}, expected 200`,
        }
    }

    return {
        result: true,
        message: 'PASSED: testDeleteNote',
    }
}

async function testUpdateNote(token, noteID, updatedData) {
    const testBadToken = await notesApi.updateNote(
        'BAD_TOKEN',
        noteID,
        updatedData
    )
    if (testBadToken.status !== 400) {
        return {
            result: false,
            message: `FAILED: testUpdateNote: unexpected bad token code ${testBadToken.status}, expected 400`,
        }
    }

    const testGoodToken = await notesApi.updateNote(token, noteID, updatedData)
    if (testGoodToken.status !== 200) {
        return {
            result: false,
            message: `FAILED: testUpdateNote: unexpected good token code ${testGoodToken.status}, expected 200`,
        }
    }

    return {
        result: true,
        message: 'PASSED: testUpdateNote',
        noteID,
    }
}

/////////////////

const testIDOutput = await testID()
if (!testIDOutput.result) {
    console.log(testIDOutput.message)
    process.exit(1)
}

console.log(`Username: ${testIDOutput.username}`)
console.log(`Password: ${testIDOutput.password}`)

for (let i = 0; i < 10; i++) {
    const testAddNoteOutput = await testAddNote(testIDOutput.accessToken)
    if (!testAddNoteOutput.result) {
        console.log(testAddNoteOutput.message)
        process.exit(1)
    }
}

let testListNotesOutput = await testListNotes(testIDOutput.accessToken, 10)
if (!testListNotesOutput.result) {
    console.log(testListNotesOutput.message)
    process.exit(1)
}

for (let n of testListNotesOutput.notes) {
    const testGetNoteOutput = await testGetNote(
        testIDOutput.accessToken,
        n.id,
        n.title,
        n.text
    )
    if (!testGetNoteOutput.result) {
        console.log(testGetNoteOutput.message)
        process.exit(1)
    }
}

for (let n of testListNotesOutput.notes) {
    const testUpdateNoteOutput = await testUpdateNote(
        testIDOutput.accessToken,
        n.id,
        { text: 'updated_text_' + n.text }
    )
    if (!testUpdateNoteOutput.result) {
        console.log(testUpdateNoteOutput.message)
        process.exit(1)
    }
}

for (let n of testListNotesOutput.notes) {
    const testGetNoteOutput = await testGetNote(
        testIDOutput.accessToken,
        n.id,
        n.title,
        'updated_text_' + n.text
    )
    if (!testGetNoteOutput.result) {
        console.log(testGetNoteOutput.message)
        process.exit(1)
    }
}

for (let n of testListNotesOutput.notes) {
    const testDeleteNoteOutput = await testDeleteNote(
        testIDOutput.accessToken,
        n.id,
        n.title,
        n.text
    )
    if (!testDeleteNoteOutput.result) {
        console.log(testDeleteNoteOutput.message)
        process.exit(1)
    }
}

testListNotesOutput = await testListNotes(testIDOutput.accessToken, 0)
if (!testListNotesOutput.result) {
    console.log(testListNotesOutput.message)
    process.exit(1)
}
