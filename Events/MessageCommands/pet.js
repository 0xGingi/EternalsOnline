const Discord = require('discord.js');
const { prefix } = require('../../App/config.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
// Import the necessary functions from other command files

const catchpet = require('./catch.js');
const trainpet = require('./train.js');
const mypet = require('./pets.js');
const namepet = require('./namepet.js');
const selectpet = require('./petselect.js');
const battlepet = require('./petbattle.js');
const petgive = require('./petgive.js');
const petrelease = require('./petrelease.js');
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

        if (commandName === 'pet' || commandName === 'pets') {
            const subCommand = args.shift()?.toLowerCase();
            
            switch (subCommand) {
                case undefined: 
                    await mypet.execute(message, args, 'pets');
                    break;
                case 'train':
                    await trainpet.execute(message, args, 'train');
                    break;
                case 'catch':
                    await catchpet.execute(message, args, 'catch');
                    break;
                case 'name':
                    await namepet.execute(message, args, 'namepet');
                    break;   
                case 'select':
                    await selectpet.execute(message, args, 'selectpet');
                    break;
                case 'battle':
                    var userInput = Array.from(message.mentions.users.values())[1];
                    await battlepet.execute(message, args, 'petbattle', userInput);
                    break;
                case 'give':
                    var userInput = Array.from(message.mentions.users.values())[1];
                    await petgive.execute(message, args, 'petgive', userInput);
                    break;
                case 'release':
                    await petrelease.execute(message, args, 'petrelease');
                    break;
    
    

                default:
                const embed = new EmbedBuilder()
                .setTitle('Pet Commands')
                .addFields(
                    { name: '@Eternals pet catch', value: 'catch a pet' },
                    { name: '@Eternals pet train <pet>', value: 'train a pet' },
                    { name: '@Eternals pet name <pet> <name>', value: 'name your pet' },
                    { name: '@Eternals pet select <pet>', value: 'select a pet'},
                    { name: '@Eternals pet battle <@Player> <Optional Wager>', value: 'Pet Battle with another player'},
                    { name: '@Eternals pet give <@Player> <pet>', value: 'Give a player a pet'},
                    { name: '@Eternals pet release <pet>', value: 'Release a pet back into the wild'}


                );
                message.reply({ embeds: [embed] });
                    break;
            }
        } }
    },
    info: {
        names: ['pet', 'pets'],
    }
};