const Discord = require('discord.js');
const { prefix } = require('../../App/config.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, StringSelectMenuBuilder } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
// Import the necessary functions from other command files
const listFish = require('./fishes.js');
const listLogs = require('./logs.js');
const listMobs = require('./mobs.js');
const listFood = require('./food.js');
const listItem = require('./allitem.js');
const listArea = require('./areas.js');
const listDungeon = require('./dungeons.js');
const listWeapon = require('./allweapon.js');
const listMagic = require('./allmagic.js');
const listArmor = require('./allarmor.js');
const listRaid = require('./raids.js');
const listOre = require('./ore.js');
const listBars = require('./bars.js');
const listSmith = require('./smithlist.js');
const listpets = require('./listpets.js');
const listTotems = require('./totems.js');
const listCourses = require('./courses.js');
const listPartyDungeon = require('./partydungeons.js');
const listSeeds = require('./seeds.js');
const listCrops = require('./crops.js');
const listPotions = require('./potions.js');
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

        if (commandName === 'list') {
            const subCommand = args.shift()?.toLowerCase();
            
            switch (subCommand) {
                case 'fish':
                    await listFish.execute(message, args, 'fishes');
                    break;
                case 'logs':
                    await listLogs.execute(message, args, 'logs');
                    break;
                case 'mobs':
                    await listMobs.execute(message, args, 'mobs');
                    break;
                case 'food':
                    await listFood.execute(message, args, 'food');
                    break;
                case 'weapon':
                    await listWeapon.execute(message, args, 'allweapon');
                    break;
                case 'weapons':
                    await listWeapon.execute(message, args, 'allweapon');
                    break;
                case 'magic':
                    await listMagic.execute(message, args, 'allmagic');
                    break;
                case 'armor':
                    await listArmor.execute(message, args, 'allarmor');
                    break;
                case 'monsters':
                    await listMobs.execute(message, args, 'mobs');
                    break;
                case 'areas':
                    await listArea.execute(message, args, 'areas');
                    break;
                case 'dungeons':
                    await listDungeon.execute(message, args, 'dungeons');
                    break;
                case 'raids':
                    await listRaid.execute(message, args, 'raids');
                    break;
                case 'ore':
                    await listOre.execute(message, args, 'ore');
                    break;
                case 'bars':
                    await listBars.execute(message, args, 'bars');
                    break;
                case 'smithing':
                    await listSmith.execute(message, args, 'smithlist');
                    break;
                case 'pets':
                    await listpets.execute(message, args, 'listpets');
                    break;
                case 'crafting':
                    await listTotems.execute(message, args, 'totems');
                    break;
                case 'courses':
                    await listCourses.execute(message, args, 'courses');
                    break;
                case 'partydungeons':
                    await listPartyDungeon.execute(message, args, 'partydungeons');
                    break;
                case 'seeds':
                    await listSeeds.execute(message, args, 'seeds');
                    break;
                case 'crops':
                    await listCrops.execute(message, args, 'crops');
                    break;
                case 'potions':
                    await listPotions.execute(message, args, 'potions');
                    break;
    
                default:

                const embed = new EmbedBuilder()
                .setTitle('List Commands')
                .addFields(
                    { name: '@FlipMMO list fish', value: 'list all fish' },
                    { name: '@FlipMMO list food', value: 'list all food' },
                    { name: '@FlipMMO list potions', value: 'list all potions'},
                    { name: '@FlipMMO list ore', value: 'list all ore' },
                    { name: '@FlipMMO list bars', value: 'list all smithing bars' },
                    { name: '@FlipMMO list smithing', value: 'list all smithable items' },
                    { name: '@FlipMMO list crafting', value: 'list all craftable items' },
                    { name: '@FlipMMO list logs', value: 'list all logs' },
                    { name: '@FlipMMO list seeds', value: 'list all seeds' },
                    { name: '@FlipMMO list crops', value: 'list all crops' },
                    { name: '@FlipMMO list mobs', value: 'list all monsters' },
                    { name: '@FlipMMO list weapons', value: 'list all weapons' },
                    { name: '@FlipMMO list armor', value: 'list all armor' },
                    { name: '@FlipMMO list magic', value: 'list all magic items' },
                    { name: '@FlipMMO list dungeons', value: 'list all dungeons' },
                    { name: '@FlipMMO list raids', value: 'list all raids' },
                    { name: '@FlipMMO list areas', value: 'list all areas' },
                    { name: '@FlipMMO list pets', value: 'list all pets' },
                    { name: '@FlipMMO list courses', value: 'list all agility courses' },
                    { name: '@FlipMMO list partydungeons', value: 'list all party dungeons' },
                );
                message.reply({ embeds: [embed] });
                    break;  
            }


            
        } }
    },
    info: {
        names: ['list', 'l'],
    }
};