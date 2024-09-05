const { loadFiles } = require('../../Functions/getFile')
const { dim, yellow } = require('colors')
const resetSkillCD = require('../../scripts/resetskillcd');
const battleGround = require('../../scripts/bg');

async function loadEvents(client) {

    await client.events.clear()
    const files = loadFiles('Events')    

    files.forEach( (filePath) => {
        const eventFile = require(filePath)

        const eventName = eventFile.name
        const eventExecute = (...args) => eventFile.execute(...args, client)

        eventFile.once ? client.once(eventName, eventExecute) : client.on(eventName, eventExecute)
    })

    await resetSkillCD();
    console.log(`${dim('Skill Reset Status:')} ${yellow('Online')}`);
    await battleGround();
    console.log(`${dim('Battleground Status:')} ${yellow('Online')}`);
    return console.log(`${dim('Events Status:')} ${yellow('Online')}`);
}

module.exports = { loadEvents }