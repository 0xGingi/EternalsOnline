const { loadFiles } = require('../../Functions/getFile')
const { dim, yellow } = require('colors')

async function loadEvents(client) {

    await client.events.clear()
    const files = loadFiles('Events')    

    files.forEach( (filePath) => {
        const eventFile = require(filePath)

        const eventName = eventFile.name
        const eventExecute = (...args) => eventFile.execute(...args, client)

        eventFile.once ? client.once(eventName, eventExecute) : client.on(eventName, eventExecute)
    })
    
    return console.log(`${dim('Events Status:')} ${yellow('Online')}`)
}

module.exports = { loadEvents }