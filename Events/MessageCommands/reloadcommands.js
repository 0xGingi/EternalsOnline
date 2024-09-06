const { loadEvents } = require('../../App/Handlers/Events');
const { Events } = require('discord.js');
const {client} = require('../../App/index.js');

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {
            var user = message.author
            if(user.id == '351859727568994314' || user.id == '919048526518960198' || user.id == '217025723573993474'){
                try {
                    await loadEvents(client);
                    await message.reply('Commands have been reloaded successfully!');
                } catch (error) {
                    console.error('Error reloading commands:', error);
                    await message.reply('An error occurred while reloading commands.');
                }

            }else{
                return message.reply({ content: `You are not allowed to use this command!` });
            }
        }
    },
    info: {
        names: ['reload']
    }
}