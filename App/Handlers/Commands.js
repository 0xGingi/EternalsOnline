 const { loadFiles } = require('../../Functions/getFile');
const { dim, yellow } = require('colors');
const path = require('path')

async function loadCommands(client) {
    await client.commands.clear();
    let CommandsArray = [];
    const commandsPath = path.resolve(__dirname, '../../commands');
    const files = loadFiles(commandsPath);


    files.forEach((file) => {
        const command = require(file);
        if (command.info && Array.isArray(command.info.names)) {
            command.info.names.forEach((name) => {
            client.commands.set(name, command);
            CommandsArray.push({ name, ...command.data });
            //CommandsArray.push(JSON.stringify(command.data));
            });
        }
    }) 

    client.application.commands.set(CommandsArray);
    return console.log(`${dim('Commands Status:')} ${yellow('Online')}`);
}

module.exports = { loadCommands };
