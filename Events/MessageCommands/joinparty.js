const Discord = require('discord.js');
const PARTYDATA = require('../../modules/party.js')
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, Collection } = require('discord.js');
const { prefix } = require('../../App/config.json')


// Config Cooldown :
const shuffleTime = 4.32e+7;
var cooldownPlayers = new Collection();

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

    async execute(message, args, commandName) {
        // const args = message.content.slice(prefix.length).trim().split(/ +/);
        // const commandName = args.shift().toLowerCase();
         if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
     
    var user = message.author;
    var partyNameJoin = args[0]

    if(partyNameJoin === '') return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@FlipMMO party join <party name>")}`)
    else if(partyNameJoin === ' ') message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@FlipMMO party join <party name>")}`)
    else if(partyNameJoin === undefined) message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@FlipMMO party join <party name>")}`)
    else if(partyNameJoin != undefined) {

        function playerInParty(playerStats){
            if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
            else {
                if(playerStats.player.other.partyName != 'undefined') return true
            }
            return false
        }

        let party = await PARTYDATA.findOne({ partyName: partyNameJoin });
        if (!party) return message.reply(`${EMOJICONFIG.no} Party is not available...`)
        else {
            if (party.banned.some(bannedUser => bannedUser.id === message.author.id)) {
                return message.reply(`${EMOJICONFIG.no} You are banned from this party.`);
            }
            // == Balance Db ==
            let balance = await BALANCEDATA.findOne({ userId: message.author.id });
            if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
            else {

                // == Player Db ==
                let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
                if (playerStats.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You are an ironman, you can't join a party!`)

                if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
                else {

                    if(playerInParty(playerStats) == false){
                        if(balance.eco.coins <= 150) return message.reply(`${EMOJICONFIG.no} you don't have ${inlineCode('150')} ${EMOJICONFIG.coin} to join a party...`)
                        else {

                            if(party.member.length >= 5) return message.reply(`${EMOJICONFIG.no} party is full (max 5)...`)
                            else {

                                const row = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('yes')
                                            .setLabel('JOIN')
                                            .setEmoji(`${EMOJICONFIG.yes}`)
                                            .setStyle(ButtonStyle.Success),
                                        
                                        new ButtonBuilder()
                                            .setCustomId('no')
                                            .setLabel('CANCEL')
                                            .setEmoji(`${EMOJICONFIG.no}`)
                                            .setStyle(ButtonStyle.Danger),
                                    );
                        
                                const partyEmbedRow = new EmbedBuilder()
                                    .setColor('#4dca4d')
                                    .setTitle(`🛖 Join ${party.partyName}'s Party ?`)
                                    .setDescription(`Click ${EMOJICONFIG.yes} to join ${inlineCode('or')} Click ${EMOJICONFIG.no} to cancel`)
                                    .setTimestamp();
                                message.reply({embeds: [partyEmbedRow], components: [row] });

                                // ========== Filter & Collector ==========
                                const filter = (interaction)  => {
                                    if(interaction.user.id === message.author.id) return true
                                    return interaction.reply({ content: 'You cant use this button' })
                                };
                                const collector = message.channel.createMessageComponentCollector({
                                    filter, 
                                    max: 1
                                });
                            
                                collector.on('end', (ButtonInteraction) => {
                                    ButtonInteraction.first().deferUpdate()
                                    const id = ButtonInteraction.first().customId
                                    if(id === 'yes'){

                                        //  ======= CoolDowns: 12h =======
                                        if (cooldownPlayers.get(message.author.id) && new Date().getTime() - cooldownPlayers.get(message.author.id) < shuffleTime) {
                                            var measuredTime = new Date(null);
                                            measuredTime.setSeconds(Math.ceil((shuffleTime - (new Date().getTime() - cooldownPlayers.get(message.author.id))) / 1000)); // specify value of SECONDS
                                            var MHSTime = measuredTime.toISOString().substr(11, 8);
                                            message.channel.send(`${EMOJICONFIG.hellspawn} Please wait `` + MHSTime + `` and try again.`);
                                            return;
                                        }
                                        
                                        cooldownPlayers.set(message.author.id, new Date().getTime());
                                        // ===============================

                                        party.member.push({id: user.id, pseudo: user.username})
                                        party.save()

                                        playerStats.player.other.partyName = partyNameJoin
                                        playerStats.save()

                                        var partyEmbed = new EmbedBuilder()
                                            .setColor('#4dca4d')
                                            .setTitle(`${EMOJICONFIG.scroll4} You join ${party.partyName}`)
                                            .setDescription(`${EMOJICONFIG.yes} New Party Member: ${inlineCode(user.username)}\n${EMOJICONFIG.paper} Congrats you have sucessfully join your new party !\n${EMOJICONFIG.helmet} Leader : ${inlineCode(party.leader[1])}\n${EMOJICONFIG.hat7} Member(s): ${inlineCode(party.member.length), '+1'}`)
                                            .setFooter({text:'FlipMMO | @FlipMMO help'})
                                            .setTimestamp();
                                        return message.reply({embeds: [partyEmbed]});
                                        
                                    }
                                    if(id === 'no') return message.reply(`You canceled ${EMOJICONFIG.no}`)
                                });
                            };
                        };
                    } else return message.reply(`${EMOJICONFIG.no} you are already in a party...`);
                };
            };
        };
    };
};
},
info: {
    names: ['joinparty', 'partyjoin'],
} }
