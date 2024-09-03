const Discord = require('discord.js');
const { prefix } = require('../../App/config.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
// Import the necessary functions from other command files
const start = require('./startTournament.js');
const create = require('./createguildtournament.js');
const join = require('./joinguildTournament.js');
const guild = require('./guildtournament.js');
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
        // Check if the command is guild and has subcommands

        if (commandName === 'tournament') {
            const subCommand = args.shift()?.toLowerCase();
            
            switch (subCommand) {
                case 'view': 
                    await guild.execute(message, args, 'guildtournament');
                    break;
                case 'create':
                    await create.execute(message, args, 'createguildtournament');
                    break;
                case 'join':
                    await join.execute(message, args, 'joinguildtournament');
                    break;
                case 'start':
                    await start.execute(message, args, 'starttournament');
                    break;

                default:
                                       
                const embed = new EmbedBuilder()
                .setTitle('Guild Tournament Commands')
                .addFields(
                    { name: '@Eternals tournament create <name>', value: 'create a tournament' },
                    { name: '@Eternals tournament join <name>', value: 'join a tournament' },
                    { name: '@Eternals tournament view <name>', value: 'view tournament' },
                    { name: '@Eternals tournament start <name>', value: 'start tournament' },
                );
                message.reply({ embeds: [embed] });
                    break;
            }
        } }
    },
    info: {
        names: ['tournament'],
    }
};