const Discord = require('discord.js');
const monsters = require('../../config/monster.json');
const PLAYERDATA = require('../../modules/player.js');
const STATS = require('../../modules/statsBot.js');
const SQUADDATA = require('../../modules/squad.js')
const EMOJICONFIG = require('../../config/emoji.json');
const emo = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { numStr } = require('../../functionNumber/functionNbr.js');
const crypto = require("crypto");
const { prefix } = require('../../App/config.json')
const configLevel = require('../../config/configLevel.json');
const CONFIGITEM = require('../../config/stuff.json')
const Party = require('../../modules/party.js');
const player = require('../../modules/player.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {

        var user = message.author;
        var userInput = args[0];
        let playerStats = await PLAYERDATA.findOne({ userId: user.id });
        let balance = await BALANCEDATA.findOne({ userId: user.id });

        if (!playerStats) return message.reply(`${inlineCode('❌')} you are not a player ! : ${inlineCode('@Eternals start')}`);
        if (playerStats.player.other.area !== 'wilderness') return message.reply(`${inlineCode('❌')} you are not in the wilderness! : ${inlineCode('@Eternals travel')}`);
        if (!userInput) {
            return message.reply(`You need to mention a player in the wilderness to attack them!`);
        }
        if (userInput.id === user.id) {
            return message.reply(`You can't attack yourself!`);
        }
    
        else {
            async function userReal(userInput){
                try {
                    var test = await PLAYERDATA.findOne({pseudo: userInput});
                    return true
                } catch {
                    return false
                }
            };
            if(await userReal(userInput)){

                let playerOne = await PLAYERDATA.findOne({ userId: message.author.id });
                console.log(playerOne.pseudo);
                if (!playerOne) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
                let balance = await BALANCEDATA.findOne({ userId: message.author.id });
                let wagerAmountPlayer1 = balance.eco.coins;
                if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
                if (playerOne.player.other.area !== 'wilderness') return message.reply(`${EMOJICONFIG.no} you are not in the wilderness! : ${inlineCode('@Eternals travel')}`);
                else {
                        let playerTwo = await PLAYERDATA.findOne({ pseudo: userInput });
                        console.log(playerTwo.pseudo);
                        if (!playerTwo) return message.reply(`${EMOJICONFIG.no} the user mentioned is not a player...`);
                        let balanceTwo = await BALANCEDATA.findOne({ pseudo: userInput });
                        if (playerOne.userId == playerTwo.userId) return message.reply(`You cannot attack yourself...`);
                        let wagerAmountPlayer2 = balanceTwo.eco.coins;
                        if (playerTwo.player.other.area !== 'wilderness') return message.reply(`${EMOJICONFIG.no} the user mentioned is not in the wilderness...`);
                        else {
                            function battle(MAXATK_PLAYERONE, MAXATK_PLAYERTWO, HEALTH_PLAYERONE, HEALTH_PLAYERTWO, DEFENSE_PLAYERONE, DEFENSE_PLAYERTWO){
                                var NB_ATTACK_PLAYERONE = 0
                                var NB_ATTACK_PLAYERTWO = 0
                                var ATK_SOMME_PLAYERONE = 0
                                var ATK_SOMME_PLAYERTWO = 0
                
                                while(HEALTH_PLAYERONE != 0 || HEALTH_PLAYERTWO != 0){
                                    // ========= Player 1 Fight =========
                                    var attackDamagePLayerOne = Math.floor(Math.random() * MAXATK_PLAYERONE) + 1 - (DEFENSE_PLAYERTWO * 0.5);
                                    attackDamagePLayerOne = isNaN(attackDamagePLayerOne) ? 0 : attackDamagePLayerOne;
                                    attackDamagePLayerOne = attackDamagePLayerOne < 0 ? 0 : attackDamagePLayerOne;
            
                                    NB_ATTACK_PLAYERONE += + 1
                                    ATK_SOMME_PLAYERONE += attackDamagePLayerOne
                                    
                                    HEALTH_PLAYERTWO -= attackDamagePLayerOne;
                                    
                                    // ========= Player 2 Fight =========
                                    var attackDamagePLayerTwo = Math.floor(Math.random() * MAXATK_PLAYERTWO) + 1 - (DEFENSE_PLAYERONE * 0.5);
                                    attackDamagePLayerTwo = isNaN(attackDamagePLayerTwo) ? 0 : attackDamagePLayerTwo;
                                    attackDamagePLayerTwo = attackDamagePLayerTwo < 0 ? 0 : attackDamagePLayerTwo;
        
                                    NB_ATTACK_PLAYERTWO += 1;
                                    ATK_SOMME_PLAYERTWO += attackDamagePLayerTwo;
        
                                    HEALTH_PLAYERONE -= attackDamagePLayerTwo;
                                    
                
        
                                    if (HEALTH_PLAYERONE <= 0){
                                        balance.eco.coins -= wagerAmountPlayer1;
                                        if (playerTwo.player.other.ironman === false) balanceTwo.eco.coins += wagerAmountPlayer1;
                                        if (playerTwo.player.other.ironman === true) balanceTwo.eco.coins += 0;
                                        playerOne.player.other.area = 'lumby';
                                        playerOne.save();
                                        playerTwo.save();
                                        balance.save();
                                        balanceTwo.save();
                                        // == Embed LOSE : ==
                                        var battleEmbed = new EmbedBuilder()
                                            .setColor('#000000')
                                            .setTitle(`${user.username}'s Battle`)
                                            .setDescription(`${EMOJICONFIG.necromancy}: ${user.username} ${inlineCode("ATTACKED")} ${playerTwo.pseudo} in the wilderness\n`)
                                            .addFields(
                                            { name: `**${emo.helmet} ${user.username.toUpperCase()} :**\n`, value: `**Attack** : ${playerOne.player.attack}\n**Defense** : ${playerOne.player.defense}\n**Health** : ${playerOne.player.health}\n`, inline: true },
                                            { name: `**${emo.hat7} ${playerTwo.pseudo.toUpperCase()} :**\n`, value: `**Attack** : ${playerTwo.player.attack}\n**Defense** : ${playerTwo.player.defense}\n**Health** : ${playerTwo.player.health}\n `, inline: true },
                                            { name: `**${emo.paper} STATS :**\n`, value: `${user.username} attacked **${NB_ATTACK_PLAYERONE} times** and did **${ATK_SOMME_PLAYERONE}** damage to ${playerTwo.pseudo}\n${playerTwo.pseudo} attacked **${NB_ATTACK_PLAYERTWO} times** and did **${ATK_SOMME_PLAYERTWO}** damage to ${user.username}\n\n**${EMOJICONFIG.attack6} ${playerTwo.pseudo} WINS!**\n and looted ${emo.coin} ${wagerAmountPlayer1} from ${user.username}'s corpse`, inline: false },
                                            )
                                            .setTimestamp();

                                            const logChannel = client.channels.cache.get('1169491579774443660');
                                            var now = new Date();
                                            var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                                            var messageEmbed = new EmbedBuilder()
                                            .setColor('#D5EB0D')
                                            .setTitle(`Log ${date}`)
                                            .setDescription(`${EMOJICONFIG.necromancy} ${inlineCode(playerTwo.pseudo)} killed **${user.username}** in the wilderness and looted ${wagerAmountPlayer1} ${emo.coinchest} from their corpse!`);
                                            logChannel.send({embeds: [messageEmbed], ephemeral: false });
                
                                        return battleEmbed
                                    };
                                    if (HEALTH_PLAYERTWO <= 0){
                                        // ======================================
                                        // =========== PLAYER ONE WIN ===========
        
                                        if (playerTwo.player.other.ironman === false) balance.eco.coins += wagerAmountPlayer2;
                                        if (playerTwo.player.other.ironman === true) balance.eco.coins += 0;
                                        balanceTwo.eco.coins -= wagerAmountPlayer2;
                                        playerTwo.player.other.area = 'lumby';
                                        playerOne.save();
                                        playerTwo.save();
                                        balance.save();
                                        balanceTwo.save();
                
                                        // == Embed WIN : ==
                                        var battleEmbed = new EmbedBuilder()
                                            .setColor('#000000')
                                            .setTitle(`${user.username}'s Battle`)
                                            .setDescription(`${EMOJICONFIG.necromancy}: ${user.username} ${inlineCode("ATTACKED")} ${playerTwo.pseudo} in the wilderness\n`)
                                            .addFields(
                                                { name: `**${emo.helmet} ${user.username.toUpperCase()} :**\n`, value: `**Attack** : ${playerOne.player.attack}\n**Defense** : ${playerOne.player.defense}\n**Health** : ${playerOne.player.health}\n`, inline: true },
                                                { name: `**${emo.hat7} ${playerTwo.pseudo.toUpperCase()} :**\n`, value: `**Attack** : ${playerTwo.player.attack}\n**Defense** : ${playerTwo.player.defense}\n**Health** : ${playerTwo.player.health}\n `, inline: true },
                                                { name: `**${emo.paper} STATS :**\n`, value: `${user.username} attacked **${NB_ATTACK_PLAYERONE} times** and did **${ATK_SOMME_PLAYERONE}** damage to ${playerTwo.pseudo}\n${playerTwo.pseudo} attacked **${NB_ATTACK_PLAYERTWO} times** and did **${ATK_SOMME_PLAYERTWO}** damage to ${user.username}\n\n**${EMOJICONFIG.attack6} ${user.username} WINS!**\n and looted ${emo.coin} ${wagerAmountPlayer2} from ${playerTwo.pseudo}'s corpse`, inline: false },
                                            )
                                            .setTimestamp();

                                        const logChannel = client.channels.cache.get('1169491579774443660');
                                        var now = new Date();
                                        var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                                        var messageEmbed = new EmbedBuilder()
                                            .setColor('#D5EB0D')
                                            .setTitle(`Log ${date}`)
                                            .setDescription(`${EMOJICONFIG.necromancy} ${inlineCode(user.username)} killed **${playerTwo.pseudo}** in the wilderness and looted ${wagerAmountPlayer2} ${emo.coinchest} from their corpse!`);
                                        logChannel.send({embeds: [messageEmbed], ephemeral: false });

                                        return battleEmbed
                                    };
                                };
                            };
                            await message.reply({ embeds:[battle(playerOne.player.attack , playerTwo.player.attack, playerOne.player.health, playerTwo.player.health, playerOne.player.defense, playerTwo.player.defense)], ephemeral: false });
                       }       
                    };
                } else return message.reply(`${EMOJICONFIG.no} player undefined : ${inlineCode("@Eternals pvp <@user>")}`);
        
    
        }
    
        }
    },
    info: {
        names: ['pvp'],
      } }