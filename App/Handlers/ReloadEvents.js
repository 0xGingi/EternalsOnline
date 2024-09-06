const { loadFiles } = require('../../Functions/getFile')
const { dim, yellow } = require('colors')


    client.removeAllListeners();
    await client.events.clear()
    const files = loadFiles('Events')    

    files.forEach((filePath) => {

        delete require.cache[require.resolve(filePath)];
        const eventFile = require(filePath)

        const eventName = eventFile.name
        const eventExecute = (...args) => eventFile.execute(...args, client)

        eventFile.once ? client.once(eventName, eventExecute) : client.on(eventName, eventExecute)
    })

    console.log(`${dim('Skill Reset Status:')} ${yellow('Reloaded')}`);
    return console.log(`${dim('Events Status:')} ${yellow('Reloaded')}`);