const Discord = require('discord.js');
const { prefix } = require('../../App/config.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
// Import the necessary functions from other command files
const guildJoin = require('./guildjoin.js');
const guildLeave = require('./guildleave.js');
const guildBan = require('./guildban.js');
const myGuild = require('./myguild.js');
const guildAttack = require('./guildattack.js');
const guildGive = require('./guildgive.js');
const guildReward = require('./guildreward.js');
const upgradebossGuild = require('./upgradebossGuild.js');
const createguild = require('./createguild.js');
const listGuild = require('./allguild.js')
const deleteGuild = require('./guilddelete.js')
const raidFight = require('./raidfight.js');
const guildloot = require('./guildloot.js');
const guildinv = require('./guildinv.js');
const guildview = require('./viewguild.js');
const guildkick = require('./guildkick.js');
const guildunban = require('./guildunban.js');
const guildbanned = require('./guildbanned.js');
const promote = require('./promote.js');
const demote = require('./demote.js');
const leaderboard = require('./guildleaderboard.js');
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

        if (commandName === 'guild') {
            const subCommand = args.shift()?.toLowerCase();
            
            switch (subCommand) {
                case undefined: 
                    await myGuild.execute(message, args, 'myguild');
                    break;
                case 'join':
                    await guildJoin.execute(message, args, 'joinguild');
                    break;
                case 'leave':
                    await guildLeave.execute(message, args, 'leaveguild');
                    break;
                case 'ban':
                    await guildBan.execute(message, args, 'guildban');
                    break;
                case 'attack':
                    await guildAttack.execute(message, args, 'attackguild');
                    break;
                case 'give':
                    await guildGive.execute(message, args, 'guildgive');
                    break;
                case 'reward':
                    await guildReward.execute(message, args, 'guildreward');
                    break;
                case 'upgrade':
                    await upgradebossGuild.execute(message, args, 'upgradeguildboss');
                    break;
                case 'create':
                    await createguild.execute(message, args, 'createguild');
                    break;
                case 'list':
                    await listGuild.execute(message, args, 'allguild');
                    break;
                case 'destroy':
                    await deleteGuild.execute(message, args, 'guilddelete');
                    break;
                case 'raid':
                    await raidFight.execute(message, args, 'raidfight');
                    break;
                case 'inv':
                    await guildinv.execute(message, args, 'guildinv');
                    break;
                case 'loot':
                    await guildloot.execute(message, args, 'guildloot');
                    break;
                case 'view':
                    await guildview.execute(message, args, 'guildview');
                    break;
                case 'kick':
                    await guildkick.execute(message, args, 'guildkick');
                    break;
                case 'unban':
                    await guildunban.execute(message, args, 'guildunban');
                    break;
                case 'banned':
                    await guildbanned.execute(message, args, 'guildbanned');
                    break;
                case 'promote':
                    await promote.execute(message, args, 'promote');
                    break;
                case 'demote':
                    await demote.execute(message, args, 'demote');
                    break;
                case 'leaderboard':
                    await leaderboard.execute(message, args, 'guildleaderboard');
                    break;
                case 'lb':
                    await leaderboard.execute(message, args, 'guildleaderboard');
                    break;
    
    
                default:
                    const embed = new EmbedBuilder()
                    .setTitle('Guild Commands')
                    .addFields(
                        { name: '@FlipMMO guild create <name>', value: 'create a guild' },
                        { name: '@FlipMMO guild join <name>', value: 'join a guild' },
                        { name: '@FlipMMO guild leave', value: 'leave your guild' },
                        { name: '@FlipMMO guild list', value: 'list all guilds' },
                        { name: '@FlipMMO guild kick <@Player>', value: 'kick a player from your guild' },
                        { name: '@FlipMMO guild ban <@Player>', value: 'perma ban a player from your guild' },
                        { name: '@FlipMMO guild unban <@Player>', value: 'unban a player from your guild' },
                        { name: '@FlipMMO guild banned', value: 'view all players banned from your guild' },
                        { name: '@FlipMMO guild attack <guild name>', value: 'attack another guild' },
                        { name: '@FlipMMO guild give <coin amount>', value: 'donate coins to your guild bank' },
                        { name: '@FlipMMO guild destroy <name>', value: 'destroy your guild' },
                        { name: '@FlipMMO guild raid <raid name>', value: 'attempt a guild raid' },
                        { name: '@FlipMMO guild loot <item> <@Player>', value: 'distribute raid loot to player' },
                        { name: '@FlipMMO guild inv', value: 'view your guild inventory' },
                        { name: '@FlipMMO guild reward', value: 'claim a reward from your guild' },
                        { name: '@FlipMMO guild view <guild>', value: 'View a guild' },
                        { name: '@FlipMMO guild promote <@Player>', value: 'Promote a player to officer' },
                        { name: '@FlipMMO guild demote <@Player>', value: 'Demote a player from officer' },
                        { name: '@FlipMMO guild leaderboard', value: 'view the guild donation leaderboard' },
                    );
                    message.reply({ embeds: [embed] });
                    break;
            }
        } }
    },
    info: {
        names: ['guild'],
    }
};