const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const SQUADDATA = require('../../modules/squad.js');
const EMOJICONFIG = require('../../config/emoji.json');
const RAIDS = require('../../config/raids.json');
const { numStr } = require('../../functionNumber/functionNbr.js');
const CONFIGITEM = require('../../config/stuff.json')
const {client} = require('../../App/index.js');
const PLAYERDATA = require('../../modules/player.js');
const STATS = require('../../modules/statsBot.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const Discord = require('discord.js');

const shuffleTime = 8.64e7;

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

    async execute(message, args, commandName) {
        //  const args = message.content.slice(prefix.length).trim().split(/ +/);
       //   const commandName = args.shift().toLowerCase();
          if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
              const raidAlias = args[0];
        // Command logic here
        var user = message.author;

        let raidName;
        for (const raid in RAIDS) {
            if (RAIDS[raid].alias === raidAlias || raid === raidAlias) {    
            raidName = raid;    
              break;   
            }   
          }
          const raid = RAIDS[raidName];
          const raidDisplay = raid.display;

        if (!raidName || !RAIDS[raidName]) {
            return message.reply(`Please specify a valid raid. Usage: \`${prefix} guild raid <raid alias>\``);
        }
        let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
        if (!playerStats) {
            return message.reply('You are not a player! Use `@FlipMMO start` to begin your adventure.');
        }

        let squadData = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName });
        let squad = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName });
        if (!squadData) {
            return message.reply('You are not in a guild.');
        }
        if(user.id != squadData.leader[0] && !squadData.officer.some(officer => officer.id === user.id)) {
            return message.reply(`${EMOJICONFIG.no} you are not the leader or an officer of the Guild: ${inlineCode(squadData.squadName)}`);
        } 
        if (squadData.lastRaid) {
            const oneDayAgo = new Date(Date.now() - 24*60*60*1000);
          
            if (squadData.lastRaid > oneDayAgo) {
              return message.reply('You cannot initiate a raid because the squad is in cooldown.');
            }
          }

        if (playerStats.player.cooldowns && playerStats.player.cooldowns.guildRaid) {
            const timeSinceLastDaily = new Date().getTime() - new Date(playerStats.player.cooldowns.guildRaid).getTime();
            if (timeSinceLastDaily < shuffleTime) {
                var measuredTime = new Date(null);
                measuredTime.setSeconds(Math.ceil((shuffleTime - timeSinceLastDaily) / 1000));
                var MHSTime = measuredTime.toISOString().substr(11, 8);
                message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                return;
            }
        }


        let stats = await STATS.findOne({ botID: 899 });
        const raidfight1 = require(`../../config/${raidName}.1.json`);
        const raidfight2 = require(`../../config/${raidName}.2.json`);
        const raidfight3 = require(`../../config/${raidName}.3.json`);

        const progressProperty = raid.progressProperty;
        if (squadData.other[progressProperty] === 0) {
            squadData.other[progressProperty] = 1;
        
        }
        if (squadData.other[progressProperty] === 1) {
            monstersConfig = raidfight1;
        } else if (squadData.other[progressProperty] === 2) {
            monstersConfig = raidfight2;
        } else if (squadData.other[progressProperty] === 3) {
            monstersConfig = raidfight3;
        }
        // Select a random monster from the appropriate list

        var progb = squadData.other[progressProperty];

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

        function dropItem(monster) {
            const drops = monster.drops;
            if (!drops) {
                return null;
            }
           // drops.sort((a, b) => b.dropRate - a.dropRate);
            for (let i = 0; i < drops.length; i++) {
                const drop = drops[i];
                const randomNum = Math.random();
                if (randomNum <= drop.dropRate) {   
                    return drop;
             }
            }
            return null;
        }
        const droppedItem = dropItem(selectedMonster);

        function battle(MAXATK_PLAYER, MAXATK_MONSTER, HEALTH_PLAYER, HEALTH_MONSTER, DEFENSE_MONSTER, MAXXP, PLAYER_DEFENSE){
            var monsterStats_atk = MAXATK_MONSTER
            var monsterStats_hth = HEALTH_MONSTER
            var NB_CRIT = 0
            var NB_DODGE = 0
            var NB_ATTACK_PLAYER = 0
            var NB_ATTACK_MONSTER = 0
            var ATK_SOMME_PLAYER = 0
            var ATK_SOMME_MONSTER = 0

            if (droppedItem) {    
                const alreadyHasItem = squadData.stuff.stuffUnlock.find(item => item.id === Number(droppedItem.itemId));
                if (alreadyHasItem){
                   alreadyHasItem.amount += 1;
               }
                else if (!alreadyHasItem) {
                   squadData.stuff.stuffUnlock.push({
                       id: droppedItem.itemId,
                       name: droppedItem.name,
                       level: 1,
                       amount: 1
                   });
                }                  
               }

               while(HEALTH_PLAYER != 0 || HEALTH_MONSTER != 0){
                var attackDamagePLayer = Math.floor(Math.random() * MAXATK_PLAYER) + 1 - (DEFENSE_MONSTER * 0.5);
                attackDamagePLayer = isNaN(attackDamagePLayer) ? 0 : attackDamagePLayer;
                attackDamagePLayer = attackDamagePLayer < 0 ? 0 : attackDamagePLayer;
                NB_ATTACK_PLAYER = NB_ATTACK_PLAYER + 1
                ATK_SOMME_PLAYER = ATK_SOMME_PLAYER + attackDamagePLayer
                HEALTH_MONSTER = HEALTH_MONSTER - attackDamagePLayer;
                var attackDamageMonster = Math.floor(Math.random() * MAXATK_MONSTER) - (PLAYER_DEFENSE * 0.5);
                attackDamageMonster = isNaN(attackDamageMonster) ? 0 : attackDamageMonster;
                attackDamageMonster = attackDamageMonster < 0 ? 0 : attackDamageMonster;
                NB_ATTACK_MONSTER = NB_ATTACK_MONSTER + 1;
                ATK_SOMME_MONSTER = ATK_SOMME_MONSTER + attackDamageMonster;
                HEALTH_PLAYER = HEALTH_PLAYER - attackDamageMonster;


                if (HEALTH_PLAYER <= 0){
                    var losecoin = Math.floor((squadData.squadbank * 10)/ 100)
                    squadData.squadbank = Math.floor(squadData.squadbank - losecoin)
                    squadData.lastRaid = new Date();
                    squadData.save();

                     playerStats.player.cooldowns = playerStats.player.cooldowns || {};
                     playerStats.player.cooldowns.guildRaid = new Date().toISOString();
                     playerStats.save();
 
                                     
                     var battleEmbed = new Discord.EmbedBuilder()
                        .setColor('#9696ab')
                        .setTitle(`${raidDisplay} - Floor ${progb} / 3` )
                        .setDescription(`${squad.squadName} vs ${monsterName} \n`)
                        .addFields(
                        { name: `**${EMOJICONFIG.helmet} ${squad.squadName} :**\n`, value: `**Attack** : ${squadData.squadboss.bossattack}\n**Defense** : ${squadData.squadboss.bossdefense}\n**Health** : ${numStr(squadData.squadboss.bosshealth)}\n `, inline: true },
                        { name: `**${EMOJICONFIG.hat7} ${monsterName} :**\n`, value: `**Attack** : ${monsterStats_atk}\n**Defense** : ${DEFENSE_MONSTER}\n**Health** : ${numStr(monsterStats_hth)}\n`, inline: true },
                        { name: `**${EMOJICONFIG.scroll4} STATS :**\n`, value: `**YOU LOSE...**\n${EMOJICONFIG.attack} You lose **10%** of your ${EMOJICONFIG.coin} ( -**${numStr(losecoin)}**)...`, inline: false },
                            )
                        .setTimestamp();
                        return battleEmbed
                         };


                if (HEALTH_MONSTER <= 0){
                    var randomcoin = 1000;
                    var randomxp = selectedMonster.xpReward;
                    
                    squadData.other[progressProperty]++;

                    if (squadData.other[progressProperty] > 3) {
                        squadData.other[progressProperty] = 1;
                    }
                    squadData.lastRaid = new Date();
                    squadData.squadboss.bosshealth = HEALTH_PLAYER;
                    squadData.other.bossKill += 1
                    squadData.squadbank = squadData.squadbank + randomcoin
                    squadData.squadXp += randomxp
                    squadData.save();

                    stats.amoutCoin += randomcoin;
                    stats.amoutMonsterKilled += 1;
                    stats.save();


                    playerStats.player.cooldowns = playerStats.player.cooldowns || {};
                    playerStats.player.cooldowns.guildRaid = new Date().toISOString();
                    playerStats.save();

                    if(NB_DODGE == undefined) NB_DODGE = 0
                    if(NB_CRIT == undefined) NB_CRIT = 0

                    var progressDisplay = squadData.other[progressProperty] === 0 ? "Complete" : `(${squadData.other[progressProperty]} / 3)`;
                    var progressMessage = squadData.other[progressProperty] === 0 ? `Your guild has CONQUERED the ${dungeonDisplay} Raid!` : `You Progress in the raid to floor ${progressDisplay} in ${raidDisplay}`;

                    var battleEmbed = new Discord.EmbedBuilder()
                    .setColor('#fc9803')
                    .setTitle(`${raidDisplay} - Floor ${progb} / 3`, '')
                    .setDescription(`${squad.squadName} vs ${monsterName} in ${raidDisplay} Raid\n`)
                    .addFields(
                        { name: `**${EMOJICONFIG.helmet} ${squad.squadName} :**\n`, value: `**Attack** : ${squadData.squadboss.bossattack}\n**Defense** : ${squadData.squadboss.bossdefense}\n**Health** : ${squadData.squadboss.bosshealth}\n `, inline: true },
                        { name: `**${EMOJICONFIG.hat7} ${monsterName} :**\n`, value: `**Attack** : ${monsterStats_atk}\n**Defense** : ${DEFENSE_MONSTER}\n**Health** : ${monsterStats_hth}\n `, inline: true },
                        { name: `**${EMOJICONFIG.scroll4} STATS :**\n`, value: `**YOU WIN !**\n${EMOJICONFIG.attack} And your guild gets: **${inlineCode(numStr(randomxp))}** ${EMOJICONFIG.xp} - **${inlineCode(numStr(randomcoin))}** ${EMOJICONFIG.coin}`, inline: false },
                        { name: `** Raid Progress :**\n`, value: `${progressMessage}`, inline: false },
                        
                    )
                    .setTimestamp();
                    if (droppedItem) {
                            stats.amoutItem += 1;
                            stats.save();                    
                            battleEmbed.addFields({ name: '**Dropped Item:** ', value: `Your guild received the item: **${droppedItem.name}**!\n`});                                                                  
                    }
                    const logChannel = client.channels.cache.get('1169491579774443660');
                    var now = new Date();
                    var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                    var messageEmbed = new EmbedBuilder()
                    .setColor('#D5EB0D')
                    .setTitle(`Log ${date}`)
                    .setDescription(`${EMOJICONFIG.attack6} ${inlineCode(squad.squadName)} has CONQUERED  **${raidDisplay}** Floor ${squadData.other[progressProperty]}!`);
                    logChannel.send({embeds: [messageEmbed], ephemeral: false });
                    

                return battleEmbed


               };
            };

        };

        var monsterName = selectedMonster.name;     
            


        var MonsterLevel = selectedMonster.level;
        var MonsterAttack = selectedMonster.attack;
        var MonsterDefense = selectedMonster.defense;
        var MonsterHealth = selectedMonster.health;

        

        var Player_Attack = squadData.squadboss.bossattack - MonsterDefense
        var Dodge_PLayer = dodgeFunction(20)
        var Crit_PLayer = critFunction(20)

        if(Player_Attack <= 0) Player_Attack = 0
        if(MonsterAttack <= 0) MonsterAttack = 0
        if(MonsterHealth <= 0) MonsterHealth = 0
        if(MonsterHealth <= 0) MonsterHealth = 0

        function winPercentage(){
            var totalStatsPlayer = Player_Attack * (squadData.squadboss.bosshealth + squadData.squadboss.bossdefense)
            var totalStatsMonster = MonsterAttack * (MonsterHealth + MonsterDefense)

            var totalStats = totalStatsPlayer + totalStatsMonster

            var percentageWin = (100 * totalStatsPlayer) / totalStats

            var percentageWin = new Discord.EmbedBuilder()
                .setColor('#ce2dcb')
                .setTitle(`${EMOJICONFIG.attack6} ${squad.squadName}'s Win %`)
                .setDescription(`📰 ${inlineCode(squad.squadName)} vs ${inlineCode(monsterName)}\n`)
                .addFields(
                    {name: `${EMOJICONFIG.helmet} ${squad.squadName}:`, value:`${EMOJICONFIG.attack}: ${Player_Attack}\n${EMOJICONFIG.shield2}: ${squadData.squadboss.bossdefense}\n${EMOJICONFIG.heart}: ${squadData.squadboss.bosshealth}`, inline: true},
                    {name: `${EMOJICONFIG.hat7} ${monsterName}:`, value:`${EMOJICONFIG.attack}: ${MonsterAttack}\n${EMOJICONFIG.shield2}: ${MonsterDefense}\n${EMOJICONFIG.heart}: ${MonsterHealth}`, inline: true},
                    {name: `${EMOJICONFIG.scroll4} Result :`, value:`Your percentage chance of winning is : **${Math.floor(percentageWin)}%**`, inline: false},
                )
                .setTimestamp();
            return percentageWin
        };

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('yes')
                .setLabel('ATTACK')
                .setEmoji(EMOJICONFIG.yes)
                .setStyle(ButtonStyle.Success),
            
            new ButtonBuilder()
                .setCustomId('no')
                .setLabel('RUN')
                .setEmoji(EMOJICONFIG.no)
                .setStyle(ButtonStyle.Danger),
            
            new ButtonBuilder()
                .setCustomId('percentage')
                .setLabel('WIN %')
                .setStyle(ButtonStyle.Secondary),
        );
        const embedMessage = new EmbedBuilder()
        .setColor('#ce2dcb')
        .setTitle(`${raidDisplay} - Floor ${squadData.other[progressProperty]} / 3`)
        .addFields(
            { name: `**${EMOJICONFIG.helmet} ${squad.squadName} :**\n`, value: `${EMOJICONFIG.attack}: ${squadData.squadboss.bossattack}\n${EMOJICONFIG.shield2}: ${squadData.squadboss.bossdefense}\n${EMOJICONFIG.heart}: ${squadData.squadboss.bosshealth}`, inline: true},
            { name: `**${EMOJICONFIG.hat7} ${monsterName}, lvl: ${MonsterLevel} :**\n`, value: `${EMOJICONFIG.attack}: ${MonsterAttack}\n${EMOJICONFIG.shield2}: ${MonsterDefense}\n${EMOJICONFIG.heart}: ${MonsterHealth}`, inline: true},
        )
        .setTimestamp()

    const msg = await message.reply({ embeds: [embedMessage], ephemeral: true, components: [row] } );
    const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        max: 1,
        time: 30_000
    });
    
    collector.on('collect', async interaction => {
        try {
        if (interaction.customId == 'yes') {
            


            // ================= LEVEL CONFIG =================
            await interaction.reply({ embeds:[battle(Player_Attack, MonsterAttack, squadData.squadboss.bosshealth, MonsterHealth, MonsterDefense, Dodge_PLayer, Crit_PLayer, Math.floor(Math.random() * (squadData.squadboss.bosshealth*18)/10), selectedMonster, squadData.squadboss.bossdefense)], ephemeral: false });
        }
        else if (interaction.customId == 'percentage') {
            collector.options.max = 2

            await interaction.reply({ embeds: [winPercentage()], ephemeral: false });
        }
        else if (interaction.customId === 'no') 
        { await interaction.reply({content: `${EMOJICONFIG.no} Your guild decides to not take on this monster... who knows what horrors await`, ephemeral: false}); 
    }
    } catch (error) {

        console.error('Error handling button interaction:', error);

        await interaction.reply({ content: 'There was an error handling this interaction.', ephemeral: true }).catch(console.error);
    }
});

} 
    },
    info: {

        names: ['raidfight'],

    }

};