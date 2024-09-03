const Discord = require('discord.js');
const MONSTERCONFIG = require('../../config/monster.json');
const PLAYERDATA = require('../../modules/player.js');
const STATS = require('../../modules/statsBot.js');
const SQUADDATA = require('../../modules/squad.js');
const EMOJICONFIG = require('../../config/emoji.json');
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

// Config Cooldown :
const shuffleTime = 30000;


module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message, args, command) {
        let commandName;

        if (typeof command === 'string') {
            commandName = command.split(' ')[0];
        } else if (message && message.content) {
            if (!message.mentions.has(client.user)) return;
            const cleanMessage = message.content.replace(/<@!?[0-9]+>/, '').trim();
            args = cleanMessage.split(/ +/);
            commandName = args.shift().toLowerCase();
        } 

        if (this.info.names.some(name => commandName === name)) {
 
    var user = message.author;
    var userping = Array.from(message.mentions.users.values())[1];

    let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });

    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
    if (playerStats.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)


    else {
        if (playerStats.player.cooldowns && playerStats.player.cooldowns.fighting) {
            const cooldownData = playerStats.player.cooldowns.fighting;
            const timeSinceLastFight = new Date().getTime() - cooldownData.timestamp;
            if (timeSinceLastFight < cooldownData.duration) {
                var measuredTime = new Date(null);
                measuredTime.setSeconds(Math.ceil((cooldownData.duration - timeSinceLastFight) / 1000));
                var MHSTime = measuredTime.toISOString().substr(11, 8);
                message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                return;
            }
        }    
        playerStats.player.cooldowns = playerStats.player.cooldowns || {};
        playerStats.player.cooldowns.fighting = {
            timestamp: new Date().getTime(),
            duration: shuffleTime
        };

        let balance = await BALANCEDATA.findOne({ userId: message.author.id });
        if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
        else {
            let playerArea = playerStats.player.other.area;
            let monstersInArea = MONSTERCONFIG.filter(monster => monster.area === playerArea);
            let monsterPlayerIsFighting = monstersInArea.find(monster => monster.name === "Monster Name");
            let randomItem = Math.floor(Math.random() * monstersInArea.length);

    


            let selectedMonster = monstersInArea[randomItem];

            let stats = await STATS.findOne({ botID: 899 });

            function dodgeFunction(dodge){
                // True = dodge, False = not dodge
                if((Math.floor(Math.random() * 100) + 1) < dodge){
                    return true
                } else {
                    return false
                }
            };

            function critFunction(crit){
                // True = critik, False = not critik
                if((Math.floor(Math.random() * 100) + 1) < crit){
                    return true
                } else {
                    return false
                }
            };

            function addSquadXp(squad, xpUserEarn){
                if (!squad) return
                else {
                    squad.squadXp += Math.floor(xpUserEarn * 0.15)
                    squad.save()
                }
            };

// Add this function to player.js
function calculateTotalItemBonuses(playerStats) {
    let totalBonuses = {
        attack: 0,
        defense: 0,
        health: 0,
        crit: 0,
        dodge: 0,
    };

    // Loop through each slot and add the item bonuses to totalBonuses
    for (const slot in playerStats.player.slotItem) {
        const itemId = playerStats.player.slotItem[slot];
        if (itemId !== -1) {
            const item = CONFIGITEM.find(item => item.id === itemId);
            if (item) {
                totalBonuses.attack += item.levelAttack.level1;
                totalBonuses.defense += item.levelDefense.level1;
                totalBonuses.health += item.levelHealth.level1;
                totalBonuses.crit += item.levelCrit.level1;
                totalBonuses.dodge += item.levelDodge.level1;
            }
        }
    }

    return totalBonuses;
}
function xpToLevel(level) {
    let total = 0;
    for (let l = 1; l < level; l++) {
        total += Math.floor(l + 300 * Math.pow(2, l / 7.0));
    }
    return Math.floor(total / 4);
}

function xpToNextLevel(currentLevel) {
    return xpToLevel(currentLevel + 1) - xpToLevel(currentLevel);
}

              function checkForLevelUp(playerStats) {
                let leveledUp = false;
                if (playerStats.player.level >= 120) {
                    leveledUp = false;
                    return;
                }
            
                let currentLevel = playerStats.player.level;
                let currentXP = balance.eco.xp;
                let xpNeeded = xpToNextLevel(currentLevel);
                let levelConfig = configLevel[`level${currentLevel}`];
                if (!levelConfig) {
                    console.log("Level configuration not found for level:", currentLevel);   
                    return;           
                }
                
                
                if (currentXP >= xpToNextLevel(currentLevel)){
                     leveledUp = true;
                     
                }
                else {
                     leveledUp = false;
                }
                while (currentXP >= xpNeeded) {    
                    currentLevel++;
                    currentXP -= xpNeeded;
                    xpNeeded = xpToNextLevel(currentLevel);
                    levelConfig = configLevel[`level${currentLevel}`];
                    if (!levelConfig) {
                        //console.log("Max level reached or level config not found");
                        break;
                }
                

                const itemBonuses = calculateTotalItemBonuses(playerStats);
                totalatk = levelConfig.stats.attack + itemBonuses.attack;
                totaldef = levelConfig.stats.defense + itemBonuses.defense;
                totalhealth = levelConfig.stats.health + itemBonuses.health;
                totaldod = levelConfig.stats.dodge + itemBonuses.dodge;
                totalcrit = levelConfig.stats.crit + itemBonuses.crit;
                playerStats.player.attack = totalatk;
                playerStats.player.defense = totaldef;
                playerStats.player.health = totalhealth;
                playerStats.player.dodge = totaldod;
                playerStats.player.crit = totalcrit;
                playerStats.player.level = currentLevel;
                balance.eco.xp = currentXP;
                leveledUp = true;
            
            }           


            return leveledUp;
        }

function dropItems(monster) {
    const drops = monster.drops;
    if (!drops) {
        return [];
    }
    let result = [];
    for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const randomNum = Math.random();
        if (randomNum <= drop.dropRate) {
            result.push(drop);
        }
    }
    return result;
}

            const droppedItem = dropItems(selectedMonster);
            // [=================== BATTLE FUNCTION ===================]
              function battle(MAXATK_PLAYER, MAXATK_MONSTER, HEALTH_PLAYER, HEALTH_MONSTER, DEFENSE_MONSTER, DODGEPLAYER, CRITPLAYER, MAXXP, DEFENSE_PLAYER){
                var monsterStats_atk = MAXATK_MONSTER
                var monsterStats_hth = HEALTH_MONSTER
                var NB_CRIT = 0
                var NB_DODGE = 0
                var NB_ATTACK_PLAYER = 0
                var NB_ATTACK_MONSTER = 0
                var ATK_SOMME_PLAYER = 0
                var ATK_SOMME_MONSTER = 0

                    let droppedItems = dropItems(selectedMonster);

                    for (let droppedItem of droppedItems) {
                        let alreadyHasItem = playerStats.player.stuff.stuffUnlock.find(item => item.id === Number(droppedItem.itemId));
                        if (alreadyHasItem) {
                            alreadyHasItem.amount += 1;
                        } else {
                        playerStats.player.stuff.stuffUnlock.push({
                        id: droppedItem.itemId,
                        name: droppedItem.name,
                        level: 1,
                        amount: 1
                        });
                        }
                        }

                



                        while(HEALTH_PLAYER != 0 || HEALTH_MONSTER != 0){
                            if(CRITPLAYER == false){
                                var attackDamagePLayer = Math.floor(Math.random() * MAXATK_PLAYER) + 1 - (DEFENSE_MONSTER * 0.5);
                                attackDamagePLayer = isNaN(attackDamagePLayer) ? 10 : attackDamagePLayer;
                                attackDamagePLayer = attackDamagePLayer < 0 ? 10 : attackDamagePLayer;
                                NB_ATTACK_PLAYER = NB_ATTACK_PLAYER + 1;
                                ATK_SOMME_PLAYER = ATK_SOMME_PLAYER + attackDamagePLayer;
                                HEALTH_MONSTER = HEALTH_MONSTER - attackDamagePLayer;
                            } else {
                                var attackDamagePLayerCrit = Math.floor(Math.random() * (MAXATK_PLAYER + playerStats.player.crit)) + 1 - (DEFENSE_MONSTER * 0.5);
                                attackDamagePLayerCrit = isNaN(attackDamagePLayerCrit) ? 10 : attackDamagePLayerCrit;
                                attackDamagePLayerCrit = attackDamagePLayerCrit < 0 ? 10 : attackDamagePLayerCrit;
                                NB_CRIT += 1;
                                NB_ATTACK_PLAYER = NB_ATTACK_PLAYER + 1;
                                ATK_SOMME_PLAYER = ATK_SOMME_PLAYER + attackDamagePLayerCrit;
                                HEALTH_MONSTER = HEALTH_MONSTER - attackDamagePLayerCrit;
                            }
                        
                            if(DODGEPLAYER == false){
                                var attackDamageMonster = Math.floor(Math.random() * MAXATK_MONSTER) - (DEFENSE_PLAYER * 0.5);
                                attackDamageMonster = isNaN(attackDamageMonster) ? 10 : attackDamageMonster;
                                attackDamageMonster = attackDamageMonster < 0 ? 10 : attackDamageMonster;
                                
                                NB_ATTACK_MONSTER = NB_ATTACK_MONSTER + 1;
                                ATK_SOMME_MONSTER = ATK_SOMME_MONSTER + attackDamageMonster;
                                HEALTH_PLAYER = HEALTH_PLAYER - attackDamageMonster;
                            } else {
                                NB_DODGE = NB_DODGE + 1;
                                NB_ATTACK_MONSTER = NB_ATTACK_MONSTER + 1;
                                HEALTH_PLAYER = HEALTH_PLAYER;
                            }
                        
                    if (HEALTH_PLAYER <= 0){
                    // =========== PLAYER LOSE ===========
                    let currentLevel = playerStats.player.level;
                    let levelConfig = configLevel[`level${currentLevel}`];
                    const itemBonuses = calculateTotalItemBonuses(playerStats);
                    var totalhealth = levelConfig.stats.health + itemBonuses.health;

                        var losecoin = Math.floor((balance.eco.coins*10)/100)

                        balance.eco.coins = Math.floor(balance.eco.coins - losecoin)
                        balance.save()
                        playerStats.player.energy -= 2;
                        playerStats.player.health = totalhealth;
                        playerStats.save()

                        // === Dm diary : ===
                        if(playerStats.player.other.dm){
                            var battleDiaryEmbed = new Discord.EmbedBuilder()
                                .setColor('#ff0000')
                                .setTitle(`📜 ${client.users.cache.get(user.id).username} vs ${monsterName}`)
                                .addFields(
                                    { name: `${EMOJICONFIG.attack6} You Lose...\n`, value : `You lose ${inlineCode(numStr(losecoin))} ${EMOJICONFIG.coin}`},
                                )
                                .setTimestamp();
                            message.author.send({embeds: [battleDiaryEmbed]}).catch(error => {
                                message.reply(`Something went wrong while I tried to send you a DM`)
                            });
                        };

                        // ==== Embed LOSE ====
                        var battleEmbed = new Discord.EmbedBuilder()
                            .setColor('#9696ab')
                            .setTitle(`${client.users.cache.get(user.id).username} vs ${monsterName}`)
                            .setDescription(`\n`)
                            .addFields(
                                { name: `**${EMOJICONFIG.helmet} ${client.users.cache.get(user.id).username} :**\n`, value: `**Attack** : ${playerStats.player.attack}\n**Defense** : ${playerStats.player.defense}\n**Health** : ${numStr(playerStats.player.health)}\n `, inline: true },
                                { name: `**${EMOJICONFIG.hat7} ${monsterName} :**\n`, value: `${monsterDesc}\n**Attack** : ${monsterStats_atk}\n**Defense** : ${DEFENSE_MONSTER}\n**Health** : ${numStr(monsterStats_hth)}\n`, inline: true },
                                { name: `**${EMOJICONFIG.scroll4} STATS :**\n`, value: `${EMOJICONFIG.no} You lose **10%** of your ${EMOJICONFIG.coin} ( -**${numStr(losecoin)}**)...`, inline: false },
                            )
                            .setTimestamp();
                        return battleEmbed
                    };
                    if (HEALTH_MONSTER <= 0){
                    // =========== PLAYER WIN ===========
                        var randomcoin = Math.floor((Math.random() * (MAXXP / (MAXXP/155)))) + 1;
                       // var randomxp = Math.floor(Math.random() * (MAXXP / (MAXXP/265))) + 1;
                        var randombox = Math.floor(Math.random() * 99);
                        var randomxp = Math.abs(Math.floor(selectedMonster.xpReward));

                        if(isNaN(randomcoin)){
                            randomcoin = 100;
                        }

                        if (randombox >= 94){
                        var boxwin = 1;
                            playerStats.player.other.box += 1
                        }
                        else {
                            var boxwin = 0;
                        }
                        playerStats.player.health = HEALTH_PLAYER;
                        playerStats.player.other.monsterKill += 1
                        playerStats.player.energy -= 2;

                        if (playerStats.player.slayer.task.monster === monsterName) {
                            playerStats.player.slayer.task.kills += 1;
                            var slayer = 1;
                        }
                        else {
                            var slayer = 0;
                        }

                        balance.eco.coins += randomcoin;

                        balance.eco.xp += randomxp
                        balance.eco.totalxp += randomxp
                        async function partyxp() {
                            const party = await Party.findOne({ member: { $elemMatch: { id: message.author.id } } });
                            let sharedXpPercentage = 0;
                            let inparty = false;            
                        if (party && party.member.length > 1) {
                            inparty = true;
                        const additionalXPPerMember = Math.floor(randomxp * 0.02);
                        const totalAdditionalXP = Math.min(additionalXPPerMember * party.member.length, Math.floor(randomxp * 0.10));
                        sharedXpPercentage = (totalAdditionalXP / randomxp) * 100;
                            for (const member of party.member) {
                                if (member.id === message.author.id) return;
                                
                                let memberBalance = await BALANCEDATA.findOne({ userId: member.id });
                                let memberBalance2 = await PLAYERDATA.findOne({ userId: member.id });

                                if (memberBalance && memberBalance2) {
                                    
                                memberBalance.eco.xp += totalAdditionalXP;
                                memberBalance.eco.totalxp += totalAdditionalXP;
                             await memberBalance.save();
                             await memberBalance2.save();
                        }
                    }
                }
                return {inparty, sharedXpPercentage};
            }



                        let playerLeveledUp = checkForLevelUp(playerStats);
                        checkForLevelUp(playerStats);
                        partyxp();
                         
                        if(droppedItem) stats.amoutItem += droppedItems.length;

                        stats.amoutCoin += randomcoin;
                        stats.amoutMonsterKilled += 1;
                        stats.save();
                        playerStats.save();
                        balance.save();

                        // === DM DIARY ===
                        if(playerStats.player.other.dm){
                            var battleDiaryEmbed = new Discord.EmbedBuilder()
                                .setColor('#17ff00')
                                .setTitle(`📜 ${client.users.cache.get(user.id).username} vs ${monsterName}`)
                                .addFields(
                                    { name: `${EMOJICONFIG.yes} You Win !\n`, value : `You get ${inlineCode(numStr(randomxp))} ${EMOJICONFIG.xp} - ${inlineCode(numStr(randomcoin))} ${EMOJICONFIG.coin} - ${inlineCode(numStr(boxwin))} Common Box ${EMOJICONFIG.coinchest}`},
                                )
                                .setTimestamp();
                            message.author.send({embeds: [battleDiaryEmbed]}).catch(error => {
                                message.reply(`Something went wrong while I tried to send you a DM`)
                            });
                        };

                        if(NB_DODGE == undefined) NB_DODGE = 0
                        if(NB_CRIT == undefined) NB_CRIT = 0
                        // ==== Embed WIN ====
                        
                        var battleEmbed = new Discord.EmbedBuilder()
                            .setColor('#fc9803')
                            .setTitle(`${client.users.cache.get(user.id).username} vs ${monsterName}`, '')
                            .setDescription(`\n`)
                            .addFields(
                                { name: `**${EMOJICONFIG.helmet} ${client.users.cache.get(user.id).username} :**\n`, value: `**Attack** : ${playerStats.player.attack}\n**Defense** : ${playerStats.player.defense}\n**Health** : ${playerStats.player.health}\n `, inline: true },
                                { name: `**${EMOJICONFIG.hat7} ${monsterName} :**\n`, value: `${monsterDesc}\n**Attack** : ${monsterStats_atk}\n**Defense** : ${DEFENSE_MONSTER}\n**Health** : ${monsterStats_hth}\n `, inline: true },
                                { name: `**${EMOJICONFIG.scroll4} STATS :**\n`, value: `**YOU WIN !**\n${EMOJICONFIG.coinchest} And get: **${inlineCode(numStr(randomxp))}** ${EMOJICONFIG.xp} - **${inlineCode(numStr(randomcoin))}** ${EMOJICONFIG.coin} - **${inlineCode(numStr(boxwin))}** Common Box ${EMOJICONFIG.coinchest} `, inline: false },
                                
                            )
                            .setTimestamp();

                            if (slayer === 1) {
                                battleEmbed.addFields({ name: '**Slayer Task** ', value: `You killed ${inlineCode(playerStats.player.slayer.task.kills)} / ${inlineCode(playerStats.player.slayer.task.neededKills)} ${playerStats.player.slayer.task.monster}!`});
                            }

                            //if (droppedItem) {
                                for (let droppedItem of droppedItems) {                    
                                    battleEmbed.addFields({ name: '**Dropped Item:** ', value: `You received the item: **${droppedItem.name}**!\n`});                                                                  
                            }
                            if (playerLeveledUp) {
                            battleEmbed.addFields({ name: '**Level Up!** ', value: `You are now level **${playerStats.player.level}**!`});

                            const logChannel = client.channels.cache.get('1169491579774443660');
                            var now = new Date();
                            var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                            var messageEmbed = new EmbedBuilder()
                            .setColor('#D5EB0D')
                            .setTitle(`Log ${date}`)
                            .setDescription(`${EMOJICONFIG.attack6} ${inlineCode(user.username)} is now level **${playerStats.player.level}**!`);
                            logChannel.send({embeds: [messageEmbed], ephemeral: true });
                            if (user.id == '144610383091466241') message.reply(`You are now level ${playerStats.player.level} ${EMOJICONFIG.null} <@${user.id}> ${EMOJICONFIG.null}`)
                            }
                        return battleEmbed

                    };
                
                };
            };
            // [===== Function Battle End =====]
            var monsterName = monstersInArea[randomItem].name;     
            var monsterDesc = monstersInArea[randomItem].description;


            var MonsterLevel = monstersInArea[randomItem].level;
            var MonsterAttack = monstersInArea[randomItem].attack;
            var MonsterDefense = monstersInArea[randomItem].defense;
            var MonsterHealth = monstersInArea[randomItem].health;

            

            var Player_Attack = playerStats.player.attack;
            var Dodge_PLayer = dodgeFunction(playerStats.player.dodge);
            var Crit_PLayer = critFunction(playerStats.player.crit);

            if(Player_Attack <= 0) Player_Attack = 0
            if(MonsterAttack <= 0) MonsterAttack = 0
            if(MonsterHealth <= 0) MonsterHealth = 0
            if(MonsterHealth <= 0) MonsterHealth = 0





                    // ================ AD SQUAD XP ================
                    squad = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName })
                    if(squad){
                        var randomxp = Math.floor(Math.random() * (playerStats.player.health / 60)) + 1;
                        addSquadXp(squad, randomxp)
                    }

                    // ================= LEVEL CONFIG =================
                    await message.reply({ embeds:[battle(Player_Attack, MonsterAttack, playerStats.player.health, MonsterHealth, MonsterDefense, Dodge_PLayer, Crit_PLayer, Math.floor(Math.random() * (playerStats.player.health*18)/10), selectedMonster, playerStats.player.defense)], ephemeral: true });
                }
    };
};
    },
info: {
    names: ['monster', 'fight', 'f'],
}
    }
