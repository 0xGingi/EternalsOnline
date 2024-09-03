const Discord = require('discord.js');
const BALANCEDATA = require('../../modules/economie.js');
const SQUADDATA = require('../../modules/squad.js')
const PLAYERDATA = require('../../modules/player.js');
const { numStr } = require('../../functionNumber/functionNbr.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const emo = require('../../config/emoji.json');
const EMOJICONFIG = require('../../config/emoji.json');
const {client} = require('../../App/index.js');

// Config Cooldown :
const shuffleTime = 1.08e+7;
var cooldownPlayers = new Discord.Collection();
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


            //  ======= CoolDowns: 3s =======
 /*   if (cooldownPlayers.get(message.author.id) && new Date().getTime() - cooldownPlayers.get(message.author.id) < shuffleTime) {
        var measuredTime = new Date(null);
        measuredTime.setSeconds(Math.ceil((shuffleTime - (new Date().getTime() - cooldownPlayers.get(message.author.id))) / 1000)); // specify value of SECONDS
        var MHSTime = measuredTime.toISOString().substr(11, 8);
        message.channel.send('⌚ Please wait `' + MHSTime + ' hours` and try again.');
        return;
      }
    
      cooldownPlayers.set(message.author.id, new Date().getTime());
      */
    // ===============================


    var user = message.author
    var userInput = Array.from(message.mentions.users.values())[1];
    let wager = args[1];
    if (!wager || isNaN(wager)) wager = 0;
    if (wager < 0) wager = 0;
    const wagerAmount = Number(wager);
    
    if (!userInput && !wager) {
        let player = await PLAYERDATA.findOne({ userId: message.author.id });
        if (!player) {
                return message.reply(`${EMOJICONFIG.no} you are not a player! : ${inlineCode('@Eternals start')}`);
        }
        if (player.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)
        let eligiblePlayers = await findEligiblePlayers(player.player.level, message.author.id);
        if (eligiblePlayers.length === 0) {
            return message.reply('No eligible players found to duel.');
        }
        let playerList = eligiblePlayers.map(p => `${p.pseudo} (Level ${p.player.level})`).join('\n');
        return message.reply(`Here are players you can duel:\n${playerList}`);

    }

    async function findEligiblePlayers(playerLevel, playerId) {
        let minLevel = playerLevel - 15;
        let maxLevel = playerLevel + 15;
        return await PLAYERDATA.find({
             userId: { $ne: playerId }, // Exclude the current player
            'player.level': { $gte: minLevel, $lte: maxLevel }
        }).limit(10); // Limit to 10 players
    }
        
    if (user === userInput) return message.reply(`${EMOJICONFIG.no} You can't fight yourself, well I mean technically you can, but... no...`);

    // === Try if player are real ===
    function userReal(userInput){
        try {
            var test = userInput.id
            return true
        } catch {
            return false
        }
    };

    // === Add Xp for his squad ===
    function addSquadXp(squad, xpUserEarn){
        if (!squad) return
        else {
            squad.squadXp += Math.floor(xpUserEarn * 0.15)
            squad.save()
        }
    };

    if(userReal(userInput)){

        // === Player 1 : DataBase ===
        let playerOne = await PLAYERDATA.findOne({ userId: message.author.id });
        if (wager > 0 && playerOne.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You can't duel with a wager as an ironman!`);
        if (!playerOne) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
        else {

            // === Balance Player 1 : DataBase ===
            let balance = await BALANCEDATA.findOne({ userId: message.author.id });
            if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
            else {
            if (balance.eco.coins < wagerAmount) return message.reply(`${EMOJICONFIG.no} You don't have enough coins for the wager`);
                            // === Balance Player 1 : DataBase ===
            let balanceTwo = await BALANCEDATA.findOne({ userId: userInput.id });
            if (!balanceTwo || balanceTwo.eco.coins < wagerAmount) return message.reply(`${EMOJICONFIG.no} The user mentioned doesn't have enough coins for the wager`);
            else {


                // === Player 2 : DataBase ===
                let playerTwo = await PLAYERDATA.findOne({ userId: userInput.id });
                if (!playerTwo) return message.reply(`${EMOJICONFIG.no} the user mentioned is not a player...`);
                if (wager > 0 && playerTwo.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You can't duel with a wager against an ironman!`);
                const levelDifference = Math.abs(playerOne.player.level - playerTwo.player.level);
                if (levelDifference > 120) {                       
                    return message.reply(`${EMOJICONFIG.no} You can only duel someone within 120 levels of you.`);
                }
                else {
                    function dodgeFunction(dodge){
                        if((Math.floor(Math.random() * 100) + 1) < dodge){
                            return true
                        } else {
                            return false
                        }
                    };
        
                    function critFunction(crit){
                        if((Math.floor(Math.random() * 100) + 1) < crit){
                            return true
                        } else {
                            return false
                        }
                    };
        
                    function battle(MAXATK_PLAYERONE, MAXATK_PLAYERTWO, HEALTH_PLAYERONE, HEALTH_PLAYERTWO, DEFENSE_PLAYERONE, DEFENSE_PLAYERTWO, DODGEPLAYERONE, DODGEPLAYERTWO, CRITPLAYERONE, CRITPLAYERTWO){
                        var NB_ATTACK_PLAYERONE = 0
                        var NB_ATTACK_PLAYERTWO = 0
                        var ATK_SOMME_PLAYERONE = 0
                        var ATK_SOMME_PLAYERTWO = 0
                        var NB_CRIT_PLAYERONE = 0
                        var NB_CRIT_PLAYERTWO = 0
                        var NB_DODGE_PLAYERONE = 0
                        var NB_DODGE_PLAYERTWO = 0
                            
                        while(HEALTH_PLAYERONE != 0 || HEALTH_PLAYERTWO != 0){
                        // ========= Player 1 Fight =========
                        var attackDamagePLayerOne;
                        if(CRITPLAYERONE == false){
                            attackDamagePLayerOne = Math.floor(Math.random() * MAXATK_PLAYERONE) + 1 - (DEFENSE_PLAYERTWO * 0.5);
                        } else {
                            attackDamagePLayerOne = Math.floor(Math.random() * (MAXATK_PLAYERONE + playerOne.player.crit)) + 1 - (DEFENSE_PLAYERTWO * 0.5);
                            NB_CRIT_PLAYERONE += 1;
                        }
                        attackDamagePLayerOne = isNaN(attackDamagePLayerOne) ? 0 : attackDamagePLayerOne;
                        attackDamagePLayerOne = attackDamagePLayerOne < 0 ? 0 : attackDamagePLayerOne;

                        NB_ATTACK_PLAYERONE += 1
                        ATK_SOMME_PLAYERONE += attackDamagePLayerOne

                        if(DODGEPLAYERTWO == false){
                            HEALTH_PLAYERTWO -= attackDamagePLayerOne;
                        } else {
                            NB_DODGE_PLAYERTWO += 1;
                        }

                        // ========= Player 2 Fight =========
                        var attackDamagePLayerTwo;
                        if(CRITPLAYERTWO == false){
                            attackDamagePLayerTwo = Math.floor(Math.random() * MAXATK_PLAYERTWO) + 1 - (DEFENSE_PLAYERONE * 0.5);
                        } else {
                            attackDamagePLayerTwo = Math.floor(Math.random() * (MAXATK_PLAYERTWO + playerTwo.player.crit)) + 1 - (DEFENSE_PLAYERONE * 0.5);
                            NB_CRIT_PLAYERTWO += 1;
                        }
                        attackDamagePLayerTwo = isNaN(attackDamagePLayerTwo) ? 0 : attackDamagePLayerTwo;
                        attackDamagePLayerTwo = attackDamagePLayerTwo < 0 ? 0 : attackDamagePLayerTwo;

                        NB_ATTACK_PLAYERTWO += 1;
                        ATK_SOMME_PLAYERTWO += attackDamagePLayerTwo;

                        if(DODGEPLAYERONE == false){
                            HEALTH_PLAYERONE -= attackDamagePLayerTwo;
                        } else {
                            NB_DODGE_PLAYERONE += 1;
                        }
                            

                    function eloAdd(){
                        if(typeof playerOne.player.elo !== 'number' || typeof playerTwo.player.elo !== 'number'){
                            return 0;
                        }
                        if(playerOne.player.elo >= playerTwo.player.elo){
                            return Math.floor(Math.random() * 30) + 16;
                        } else {
                            return Math.floor(Math.random() * 16) + 2;
                        }
                    };


                            if (HEALTH_PLAYERONE <= 0){
                                // =================================
                                // ======== PLAYER ONE LOSE =======            

                                var eloLoseVar = eloAdd()
                                playerOne.player.elo -= eloLoseVar
                                playerTwo.player.elo += eloLoseVar
                                balance.eco.coins -= wagerAmount;
                                balanceTwo.eco.coins += wagerAmount;
                                playerOne.player.energy -= 2;
                                playerOne.save();
                                playerTwo.save();
                                balance.save();
                                balanceTwo.save();
                                // == Embed LOSE : ==
                                var battleEmbed = new EmbedBuilder()
                                    .setColor('#000000')
                                    .setTitle(`${user.username}'s Battle`)
                                    .setDescription(`:crossed_swords: : ${user.username} ${inlineCode("VS")} ${playerTwo.pseudo}\n`)
                                    .addFields(
                                    { name: `**${emo.helmet} ${user.username.toUpperCase()} :**\n`, value: `**Attack** : ${playerOne.player.attack}\n**Defense** : ${playerOne.player.defense}\n**Health** : ${playerOne.player.health}\n`, inline: true },
                                    { name: `**${emo.hat7} ${playerTwo.pseudo.toUpperCase()} :**\n`, value: `**Attack** : ${playerTwo.player.attack}\n**Defense** : ${playerTwo.player.defense}\n**Health** : ${playerTwo.player.health}\n `, inline: true },
                                    { name: `**${emo.paper} STATS :**\n`, value: `${user.username} attacked **${NB_ATTACK_PLAYERONE} times** and did **${ATK_SOMME_PLAYERONE}** damage to ${playerTwo.pseudo}\n${playerTwo.pseudo} attacked **${NB_ATTACK_PLAYERTWO} times** and did **${ATK_SOMME_PLAYERTWO}** damage to ${user.username}\n\n**${EMOJICONFIG.attack6} ${playerTwo.pseudo} WINS!**\n and gains ${inlineCode('+' +  numStr(eloLoseVar))} ELO & ${emo.coin} ${wagerAmount} from ${user.username}`, inline: false },
                                    )
                                    .setTimestamp();
                                return battleEmbed
                            };
                            if (HEALTH_PLAYERTWO <= 0){
                                // ======================================
                                // =========== PLAYER ONE WIN ===========
                                var eloAddVar = eloAdd()
                                playerOne.player.elo += eloAddVar
                                playerTwo.player.elo += eloAddVar
                                balance.eco.coins += wagerAmount;
                                balanceTwo.eco.coins -= wagerAmount;
                                playerOne.player.energy -= 2;
                                playerOne.save();
                                playerTwo.save();
                                balance.save();
                                balanceTwo.save();
        
                                // == Embed WIN : ==
                                var battleEmbed = new EmbedBuilder()
                                    .setColor('#000000')
                                    .setTitle(`${user.username}'s Battle`)
                                    .setDescription(`:crossed_swords: : ${user.username} ${inlineCode("VS")} ${playerTwo.pseudo}\n`)
                                    .addFields(
                                        { name: `**${emo.helmet} ${user.username.toUpperCase()} :**\n`, value: `**Attack** : ${playerOne.player.attack}\n**Defense** : ${playerOne.player.defense}\n**Health** : ${playerOne.player.health}\n`, inline: true },
                                        { name: `**${emo.hat7} ${playerTwo.pseudo.toUpperCase()} :**\n`, value: `**Attack** : ${playerTwo.player.attack}\n**Defense** : ${playerTwo.player.defense}\n**Health** : ${playerTwo.player.health}\n `, inline: true },
                                        { name: `**${emo.paper} STATS :**\n`, value: `${user.username} attacked **${NB_ATTACK_PLAYERONE} times** and did **${ATK_SOMME_PLAYERONE}** damage to ${playerTwo.pseudo}\n${playerTwo.pseudo} attacked **${NB_ATTACK_PLAYERTWO} times** and did **${ATK_SOMME_PLAYERTWO}** damage to ${user.username}\n\n**${EMOJICONFIG.attack6} ${user.username} WINS !**\n and gains ${inlineCode('+' + numStr(eloAddVar))} ELO & ${emo.coin} ${wagerAmount} from ${playerTwo.pseudo}`, inline: false },
                                    )
                                    .setTimestamp();
                                return battleEmbed
                            };
                        };
                    };
                    // [================ Function Battle End ================]



                    // [=========== BUTTON MESSAGE ===========]
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('yes')
                                .setLabel(`Accept Duel`)
                                .setEmoji(`${EMOJICONFIG.yes}`)
                                .setStyle(ButtonStyle.Success),
                            
                            new ButtonBuilder()
                                .setCustomId('no')
                                .setLabel(`Decline Duel`)
                                .setEmoji(`${EMOJICONFIG.no}`)
                                .setStyle(ButtonStyle.Danger),
                        );
        
                    const embedMessage = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle(`${user.username} VS ${playerTwo.pseudo} ${emo.coin} ${wagerAmount}`)
                        .addFields(
                            { name: `**${emo.helmet} ${user.username.toUpperCase()} :**\n`, value: `${emo.attack6}: ${playerOne.player.attack}\n${emo.shield2}: ${playerOne.player.defense}\n${emo.heart}: ${playerOne.player.health}`, inline: true},
                            { name: `**${emo.hat7} ${playerTwo.pseudo.toUpperCase()} :**\n`, value: `${emo.attack6}: ${playerTwo.player.attack}\n${emo.shield2}: ${playerTwo.player.defense}\n${emo.heart}: ${playerTwo.player.health}`, inline: true},
                        )
                        .setTimestamp()
        
                    const msg = await message.reply({ embeds: [embedMessage], components: [row] });
        
                    const collector = msg.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        time: 180_000,
                    });
                    
                    collector.on('collect', async interaction => {
                        if (interaction.user.id !== userInput.id) {
                            return interaction.reply({ content: 'You are not the one being challenged.', ephemeral: true });
                        }
                        if (interaction.customId == 'yes') {
                            if(interaction.user.id === userInput.id) {
        
                        // ================ AD SQUAD XP ================
                        squad = await SQUADDATA.findOne({ squadName: playerOne.player.other.squadName })
    
                        var randomxp = Math.floor(Math.random() * (playerOne.player.health / 60)) + 1;
                        addSquadXp(squad, randomxp)
    
                        // ================= LEVEL CONFIG =================
                        if (!interaction.replied) {
                        let playeronedodge = dodgeFunction(playerOne.player.dodge);
                        let playertwododge = dodgeFunction(playerTwo.player.dodge);
                        let playeronecrit = critFunction(playerOne.player.crit);
                        let playertwocrit = critFunction(playerTwo.player.crit);
                        await interaction.reply({ embeds:[battle(playerOne.player.attack , playerTwo.player.attack, playerOne.player.health, playerTwo.player.health, playerOne.player.defense, playerTwo.player.defense, playeronedodge, playertwododge, playeronecrit, playertwocrit)], ephemeral: false });
                        }
                        collector.stop();
                            }else 
                            {
                                if (!interaction.replied) {
                                await interaction.reply({ content: 'You are not the one being challenged.', ephemeral: true });
                            }
                        }
                        };
                        
                        if(interaction.customId === 'no') {
                            if(interaction.user.id === userInput.id) {
                                if (!interaction.replied) {
                            await interaction.reply('You declined the duel');
                        } }
                        collector.stop();
                    } else {
                        if (!interaction.replied) {
                        await interaction.reply({ content: 'You are not the one being challenged.', ephemeral: true });
                        }
                    }
                });
                };
            };
               }       };
        } else return message.reply(`${EMOJICONFIG.no} player undefined : ${inlineCode("@Eternals duel <@user>")}`);
}; 
}, 
info: {
  names: ['duel'],
} }
