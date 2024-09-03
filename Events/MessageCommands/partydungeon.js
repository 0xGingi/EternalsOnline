const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { prefix } = require('../../App/config.json');
const { numStr } = require('../../functionNumber/functionNbr.js');
const DUNGEONS = require('../../config/partydungeons.json');
const STATS = require('../../modules/statsBot.js');
const SQUADDATA = require('../../modules/squad.js')
const EMOJICONFIG = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const configLevel = require('../../config/configLevel.json');
const CONFIGITEM = require('../../config/stuff.json')
const {client} = require('../../App/index.js');
const monster = require('./monster.js');
const Party = require('../../modules/party.js');
const CRAFTS = require('../../config/craft.json');
const shuffleTime = 30000;

module.exports = {

    name: Events.MessageCreate,

    async execute(message, args, command) {
        var user = message.author;
        let commandName;
        if (typeof command === 'string') {
            let fullCommand = command.split(' ');
            commandName = fullCommand.shift().toLowerCase();
            args = fullCommand.concat(args);
        } else if (message && message.content) {
            if (!message.mentions.has(client.user)) return;
            const cleanMessage = message.content.replace(/<@!?[0-9]+>/, '').trim();
            let fullCommand = cleanMessage.split(/ +/);
            commandName = fullCommand.shift().toLowerCase();
            args = fullCommand;
        } 
    
        if (this.info.names.some(name => commandName === name)) {

        const dungeonAlias = args[0];
        if (!args[0]) {
            message.channel.send('Please use `@Eternals list partydungeons` to view all dungeons. Usage: `@Eternals pdf <dungeon>`');
            return;
        }
        
        let dungeonName;
        for (const dungeon in DUNGEONS) {
            if (DUNGEONS[dungeon].alias === dungeonAlias || dungeon === dungeonAlias) {    
            dungeonName = dungeon;    
              break;   
            }   
          }
          const dungeon = DUNGEONS[dungeonName];
          const dungeonDisplay = dungeon.display;

        if (!dungeonName || !DUNGEONS[dungeonName]) {
            return message.reply(`Please specify a valid dungeon. Usage: \`${prefix} pdf dungeon\``);
        }
        if (!commandName === 'partydungeonfight') return;
        let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
        if (!playerStats) {
            return message.reply('You are not a player! Use `@Eternals start` to begin your adventure.');
        }
        let party = await Party.findOne({ partyName: playerStats.player.other.partyName });
        if (!party) return message.reply(`${EMOJICONFIG.no} you are not in a party...`);
        if(user.id != party.leader[0]) return message.reply(`${EMOJICONFIG.no} you are not the leader of the party: ${inlineCode(party.partyName)}`); 
        if (party.lastDungeon) {
            const oneDayAgo = new Date(Date.now() - 60*60*1000);
          
            if (party.lastDungeon > oneDayAgo) {
                const timePassed = Date.now() - party.lastDungeon.getTime();
                const timeLeft = 60*60*1000 - timePassed;
        
                const minutesLeft = Math.floor(timeLeft / (60 * 1000));
                const secondsLeft = Math.floor((timeLeft % (60 * 1000)) / 1000);
        
                return message.reply(`You cannot enter a party dungeon. Please wait ${minutesLeft} minutes and ${secondsLeft} seconds.`);
                    }
          }

        if (playerStats.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)

        let balance = await BALANCEDATA.findOne({ userId: message.author.id });
        if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
        else {
    
            let stats = await STATS.findOne({ botID: 899 });
            const dungeonConfigtrash = require(`../../config/${dungeonName}.trash.json`);
            const dungeonConfigelite = require(`../../config/${dungeonName}.elite.json`);
            const dungeonConfigboss = require(`../../config/${dungeonName}.boss.json`);

            const dungeon = DUNGEONS[dungeonName];
            const progressProperty = dungeon.progressProperty;

            if (party[progressProperty] === 0) {
            let requiredTotem = CRAFTS.find(item => item.dungeon === dungeonName);
            if (!requiredTotem) return message.reply(`This dungeon is not available yet.`);
            if (requiredTotem) {
                let playerHasTotem = playerStats.player.stuff.gem.find(item => item.name === requiredTotem.name && item.amount > 0);
                if (!playerHasTotem) {
                    return message.reply(`You need a ${requiredTotem.name} to enter this dungeon.`);
                }
                else {
                    if (party[progressProperty] === 0) {
                    playerHasTotem.amount -= 1;
                    }
                }
            }        
        }


            if (party[progressProperty] === 0) {
                party[progressProperty] = 1;
            
            }
            if (party[progressProperty] <= 5) {
                monstersConfig = dungeonConfigtrash;
            } else if (party[progressProperty] <= 7) {
                monstersConfig = dungeonConfigelite;
            } else {
                monstersConfig = dungeonConfigboss;
            }
            // Select a random monster from the appropriate list
    
            var progb = party[progressProperty];

            let randomIndex = Math.floor(Math.random() * monstersConfig.length);
    
            let selectedMonster = monstersConfig[randomIndex];


    

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


async function getPartyStats(partyMembers) {
    let totalStats = {
        attack: 0,
        defense: 0,
        health: 0,
        crit: 0,
        dodge: 0,
    };

    for (const member of partyMembers) {
        let memberStats = await PLAYERDATA.findOne({ userId: member.id });
        if (memberStats) {
            totalStats.attack += memberStats.player.attack;
            totalStats.defense += memberStats.player.defense;
            totalStats.health += memberStats.player.health;
        }
    }

    return totalStats;
}


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
                    levelConfig = configLevel[`level${currentLevel}`];
                    if (!levelConfig) {
                        //console.log("Max level reached or level config not found");
                        break;
                }
                

                const itemBonuses = calculateTotalItemBonuses(playerStats);
                totalatk = levelConfig.stats.attack + itemBonuses.attack;
                totaldef = levelConfig.stats.defense + itemBonuses.defense;
                totalhealth = levelConfig.stats.health;
                totaldod = levelConfig.stats.dodge + itemBonuses.dodge;
                totalcrit = levelConfig.stats.crit + itemBonuses.crit;
                playerStats.player.attack = totalatk;
                playerStats.player.defense = totaldef;
                playerStats.player.health = totalhealth;
                playerStats.player.dodge = totaldod;
                playerStats.player.crit = totalcrit;
                playerStats.player.level = currentLevel;
                balance.eco.xp = currentXP;
                
            
            }           


            
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
    

            function dropRareBox(playerProgress) {

                if (playerProgress === 8) {
   
                   const rareBoxDropRate = 0.20;             
                   const randomNum = Math.random();          
                    if (randomNum <= rareBoxDropRate) {          
                        return {       
                            dropped: "yes" // Replace with the actual item ID for the rarebox     
                        };
                    }   
                }       
                return null;      
            }


            const droppedItem = dropItems(selectedMonster);
            // [=================== BATTLE FUNCTION ===================]

            async function battle(MAXATK_PLAYER, MAXATK_MONSTER, HEALTH_PLAYER, HEALTH_MONSTER, DEFENSE_MONSTER, DODGEPLAYER, CRITPLAYER, MAXXP, DEFENSE_PLAYER){
    
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
                    stats.amoutItem += 1;
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
                   // console.log(HEALTH_PLAYER)
                    // ==== Player Attack ====
                    if(CRITPLAYER == false){
                        var attackDamagePLayer = Math.floor(Math.random() * MAXATK_PLAYER) + 1 - (DEFENSE_MONSTER * 0.5);
                        attackDamagePLayer = isNaN(attackDamagePLayer) ? 10 : attackDamagePLayer;
                        attackDamagePLayer = attackDamagePLayer < 0 ? 10 : attackDamagePLayer;
                        NB_ATTACK_PLAYER = NB_ATTACK_PLAYER + 1;
                        ATK_SOMME_PLAYER = ATK_SOMME_PLAYER + attackDamagePLayer;
                        HEALTH_MONSTER = HEALTH_MONSTER - attackDamagePLayer;
                    } else {
                        var attackDamagePLayerCrit = Math.floor(Math.random() * (MAXATK_PLAYER + playerStats.player.crit)) + 1 - (DEFENSE_MONSTER * 0.5);
                        attackDamagePLayerCrit = isNaN(attackDamagePLayerCrit) ? 1 : attackDamagePLayerCrit;
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
                    var totalhealth = levelConfig.stats.health;
                    
                    var losecoin = Math.floor((balance.eco.coins*10)/100)

                        balance.eco.coins = Math.floor(balance.eco.coins - losecoin)
                        await balance.save()
                        playerStats.player.health = totalhealth;
                        party[progressProperty] = 0;
                        party.lastDungeon = new Date();
                        await party.save();
                        playerStats.player.energy -= 2;
                       await playerStats.save()

                        // ==== Embed LOSE ====
                        var battleEmbed = new Discord.EmbedBuilder()
                            .setColor('#9696ab')
                            .setTitle(`${dungeonDisplay} - Floor ${progb} / 8` )
                            .setDescription(`${party.partyName} vs ${monsterName} \n`)
                            .addFields(
                                { name: `**${EMOJICONFIG.helmet} ${party.partyName} :**\n`, value: `**Attack** : ${Player_Attack}\n**Defense** : ${PLAYER_DEFENSE}\n**Health** : ${numStr(PLAYER_HEALTH)}\n `, inline: true },
                                { name: `**${EMOJICONFIG.hat7} ${monsterName} :**\n`, value: `**Attack** : ${monsterStats_atk}\n**Defense** : ${DEFENSE_MONSTER}\n**Health** : ${numStr(monsterStats_hth)}\n`, inline: true },
                                { name: `**${EMOJICONFIG.scroll4} STATS :**\n`, value: `** ${EMOJICONFIG.no} YOU LOSE...**\n${EMOJICONFIG.coinchest} Party Leader loses **10%** of ${EMOJICONFIG.coin} ( -**${numStr(losecoin)}**)\n${EMOJICONFIG.no} Your party has been kicked out of the dungeon`, inline: false },
                            )
                            .setTimestamp();
                        return battleEmbed
                    };
                    if (HEALTH_MONSTER <= 0){
                    // =========== PLAYER WIN ===========
                        let playerWon = true;
                        var randomcoin = Math.floor((Math.random() * (MAXXP / (MAXXP/155)))) + 1;
                        var randombox = Math.floor(Math.random() * 99);
                        var randomxp = selectedMonster.xpReward;
                        let currentLevel = playerStats.player.level;
                        let levelConfig = configLevel[`level${currentLevel}`];
                        var totalhealth = levelConfig.stats.health;
    
                        playerStats.player.health = totalhealth;

                        const rareBoxDropped = dropRareBox(party[progressProperty]);
                        if (rareBoxDropped) {
                        playerStats.player.other.rarebox += 1
                        }

                        party[progressProperty]++;
                        if (party[progressProperty] > 8) {
                            party[progressProperty] = 0;
                        }
                    
                        if (randombox >= 94){
                        var boxwin = 1;
                            playerStats.player.other.box += 1
                        }
                        else {
                            var boxwin = 0;
                        }
                        
                        playerStats.player.other.monsterKill += 1
                        playerStats.player.energy -= 2;
                        balance.eco.coins = balance.eco.coins + randomcoin

                        balance.eco.xp += randomxp
                        balance.eco.totalxp += randomxp

                        async function partyxp() {
                            const party = await Party.findOne({ member: { $elemMatch: { id: message.author.id } } });
                            let inparty = false;
                        
                            if (party && party.member.length > 1) {
                                inparty = true;
                        
                                for (const member of party.member) {
                                    if (member.id === message.author.id) continue;
                                    let memberBalance = await BALANCEDATA.findOne({ userId: member.id });
                                    let memberBalance2 = await PLAYERDATA.findOne({ userId: member.id });
                        
                                    if (memberBalance && memberBalance2) {
                                        memberBalance.eco.xp += randomxp;
                                        memberBalance.eco.totalxp += randomxp;
                                        memberBalance2.player.other.monsterKill += 1;
                                        memberBalance2.eco.coins += randomcoin;
                                        await memberBalance.save();
                                        await memberBalance2.save();
                                    }
                                }
                            }
                        
                            return {inparty, sharedXpPercentage: 100};
                        }




                        const playerLeveledUp = checkForLevelUp(playerStats);
                        checkForLevelUp(playerStats);
                        partyxp();
                        
                       // playerStats.player.cooldowns = playerStats.player.cooldowns || {};
                        party.lastDungeon = new Date();
            
                        stats.amoutCoin += randomcoin;
                        stats.amoutMonsterKilled += 1;
                        await stats.save();
                        await playerStats.save();
                        await balance.save();
                        await party.save();
                        // === DM DIARY ===

                        if(NB_DODGE == undefined) NB_DODGE = 0
                        if(NB_CRIT == undefined) NB_CRIT = 0
                        // ==== Embed WIN ====
        
                        var progressDisplay = party[progressProperty] === 0 ? "Complete" : `(${party[progressProperty]} / 8)`;
                        var progressMessage = party[progressProperty] === 0 ? `You have completed the ${dungeonDisplay} Dungeon!` : `You Progress in the Dungeon to floor ${progressDisplay} in ${dungeonDisplay}`;

                        var battleEmbed = new Discord.EmbedBuilder()
                            .setColor('#fc9803')
                            .setTitle(`${dungeonDisplay} - Floor ${progb} / 8`, '')
                            .setDescription(`${party.partyName} vs ${monsterName} in ${dungeonDisplay} Dungeon\n`)
                            .addFields(
                                { name: `**${EMOJICONFIG.helmet} ${party.partyName} :**\n`, value: `**Attack** : ${Player_Attack}\n**Defense** : ${PLAYER_DEFENSE}\n**Health** : ${PLAYER_HEALTH}\n `, inline: true },
                                { name: `**${EMOJICONFIG.hat7} ${monsterName} :**\n`, value: `**Attack** : ${monsterStats_atk}\n**Defense** : ${DEFENSE_MONSTER}\n**Health** : ${monsterStats_hth}\n `, inline: true },
                                { name: `**${EMOJICONFIG.scroll4} STATS :**\n`, value: `**YOU WIN**\n${EMOJICONFIG.yes} And get: **${inlineCode(numStr(randomxp))}** ${EMOJICONFIG.xp} - **${inlineCode(numStr(randomcoin))}** ${EMOJICONFIG.coin} - **${inlineCode(numStr(boxwin))}** ${EMOJICONFIG.coinchest} `, inline: false },
                                { name: `**${EMOJICONFIG.paper} Dungeon Progress :**\n`, value: progressMessage},
                                
                            )
                            .setTimestamp();
                            for (let droppedItem of droppedItems) {                    
                                battleEmbed.addFields({ name: '**Dropped Item:** ', value: `You received the item: **${droppedItem.name}**!\n`});                                                                  
                        }

                            if (rareBoxDropped) {
                                battleEmbed.addFields({ name: '**Rare Box:** ', value: `Whoa! You received a rare box!\n`});
                           }
                            
                        return battleEmbed

                    }
                    
        
                
                

                }; 

            };



            var monsterName = selectedMonster.name;     
            


            var MonsterLevel = selectedMonster.level;
            var MonsterAttack = selectedMonster.attack;
            var MonsterDefense = selectedMonster.defense;
            var MonsterHealth = selectedMonster.health;

            
            const partyStats = await getPartyStats(party.member);
            var Player_Attack = partyStats.attack;
            var PLAYER_DEFENSE = partyStats.defense;
            var PLAYER_HEALTH = partyStats.health;

            var Dodge_PLayer = dodgeFunction(playerStats.player.dodge)
            var Crit_PLayer = critFunction(playerStats.player.crit)

            if(Player_Attack <= 0) Player_Attack = 0
            if(MonsterAttack <= 0) MonsterAttack = 0
            if(MonsterHealth <= 0) MonsterHealth = 0
            if(MonsterHealth <= 0) MonsterHealth = 0


            function winPercentage(){
                var totalStatsPlayer = Player_Attack * (PLAYER_HEALTH + (PLAYER_DEFENSE * 0.5))
                var totalStatsMonster = MonsterAttack * (MonsterHealth + (MonsterDefense * 0.5))

                var totalStats = totalStatsPlayer + totalStatsMonster

                var percentageWin = (100 * totalStatsPlayer) / totalStats

                var percentageWin = new Discord.EmbedBuilder()
                    .setColor('#ce2dcb')
                    .setTitle(`${EMOJICONFIG.scroll4} ${party.partyName}'s Win %`)
                    .setDescription(`📰 ${inlineCode(party.partyName)} vs ${inlineCode(monsterName)}\n`)
                    .addFields(
                        {name: `${EMOJICONFIG.helmet} ${party.partyName}:`, value:`${EMOJICONFIG.attack}: ${Player_Attack}\n${EMOJICONFIG.shield2}: ${PLAYER_DEFENSE}\n${EMOJICONFIG.heart}: ${PLAYER_HEALTH}`, inline: true},
                        {name: `${EMOJICONFIG.hat7} ${monsterName}:`, value:`${EMOJICONFIG.attack}: ${MonsterAttack}\n${EMOJICONFIG.shield2}: ${MonsterDefense}\n${EMOJICONFIG.heart}: ${MonsterHealth}`, inline: true},
                        {name: `${EMOJICONFIG.paper} Result :`, value:`Your percentage chance of winning is : **${Math.floor(percentageWin)}%**`, inline: false},
                    )
                    .setTimestamp();
                return percentageWin
            };


            // [=========== BUTTON MESSAGE ===========]
            var rM = Math.floor(Math.random() * 2)

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('yes')
                        .setLabel(`ATTACK`)
                        .setStyle(ButtonStyle.Success)
                        .setEmoji(`${EMOJICONFIG.yes}`),
                    
                    new ButtonBuilder()
                        .setCustomId('no')
                        .setLabel(`RUN`)
                        .setEmoji(`${EMOJICONFIG.no}`)
                        .setStyle(ButtonStyle.Danger),
                    
                    new ButtonBuilder()
                        .setCustomId('percentage')
                        .setLabel('WIN %')
                        .setStyle(ButtonStyle.Secondary),
                );

            const embedMessage = new EmbedBuilder()
                .setColor('#ce2dcb')
                .setTitle(`${dungeonDisplay} - Floor ${party[progressProperty]} / 8`)
                .addFields(
                    { name: `**${EMOJICONFIG.helmet} ${party.partyName} :**\n`, value: `${EMOJICONFIG.attack}: ${Player_Attack}\n${EMOJICONFIG.shield2}: ${PLAYER_DEFENSE}\n${EMOJICONFIG.heart}: ${PLAYER_HEALTH}`, inline: true},
                    { name: `**${EMOJICONFIG.hat7} ${monsterName}, lvl: ${MonsterLevel} :**\n`, value: `${EMOJICONFIG.attack}: ${MonsterAttack}\n${EMOJICONFIG.shield2}: ${MonsterDefense}\n${EMOJICONFIG.heart}: ${MonsterHealth}`, inline: true},
                )
                .setTimestamp()

            const msg = await message.reply({ embeds: [embedMessage], ephemeral: false, components: [row] } );
            
            const collector = msg.createMessageComponentCollector({
                componentType: ComponentType.Button,
                max: 1,
                time: 180_000
            });
            
            collector.on('collect', async interaction => {
                try {
                if (interaction.customId == 'yes') {
                    


                    // ================ AD SQUAD XP ================
                    squad = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName })
                    if(squad){
                        var randomxp = Math.floor(Math.random() * (playerStats.player.health / 60)) + 1;
                        addSquadXp(squad, randomxp)
                    }

                    // ================= LEVEL CONFIG =================
                    await interaction.reply({ embeds:[await battle(Player_Attack, MonsterAttack, PLAYER_HEALTH, MonsterHealth, MonsterDefense, Dodge_PLayer, Crit_PLayer, Math.floor(Math.random() * (PLAYER_HEALTH*18)/10), PLAYER_DEFENSE)], ephemeral: false });
                }
                else if (interaction.customId == 'percentage') {
                    collector.options.max = 2

                    await interaction.reply({ embeds: [winPercentage()], ephemeral: false });
                }
                else if (interaction.customId === 'no') 
                { await interaction.reply({content: `${EMOJICONFIG.no} You prefer to dodge the monster...`, ephemeral: true}); 
            }
            } catch (error) {

                console.error('Error handling button interaction:', error);
        
                await interaction.reply({ content: 'There was an error handling this interaction.', ephemeral: true }).catch(console.error);
            }
        
            });
            
        };
}; 
    },
    info: {

        names: ['partydungeonfight', 'pdf'],

    }

};