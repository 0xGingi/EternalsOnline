const { SlashCommandBuilder } = require('discord.js');
const { client } = require('../App/index.js');

module.exports = {
    info: {
        names: ['mmo']
    },
    data: new SlashCommandBuilder()
        .setName('mmo')
        .setDescription('Display a help message'),
    async execute(interaction) {
        await interaction.reply({ content: `Hello! To interact with me tag me and type a command! For example **<@1157454837861056552> start** | **<@1157454837861056552> tutorial** | **<@1157454837861056552> help**\n\n**Eternals Server** - https://discord.gg/ywdfj3qbrF\n\n**Eternals Invite** - https://discord.com/api/oauth2/authorize?client_id=1234552588339511439&permissions=139586792512&scope=applications.commands+bot\n\n`, ephemeral: true });
    },
};