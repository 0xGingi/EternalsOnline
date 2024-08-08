const Discord = require('discord.js');
const MONSTERCONFIG = require('../../config/monster.json');
const PLAYERDATA = require('../../modules/player.js');
const STATS = require('../../modules/statsBot.js');
const SQUADDATA = require('../../modules/squad.js')
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
const shuffleTime = 1200000;
//const shuffleTime = 1;
module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName) {
		if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
 
    var user = message.author;
    let stats;
    stats = await STATS.findOne({ botID: 899 });


    try {

        let player1 = await PLAYERDATA.findOne({ userId: user.id }).exec();
        if (!player1) {
            message.reply("You are not a player yet.");
            return;
        }
        if (player1.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@FlipMMO energy')}`)
        let slayer = 0;
        const currentArea = player1.player.other.area;
        const eligibleFishes = MONSTERCONFIG.filter(monster => monster.area === currentArea);
        if (eligibleFishes.length === 0){
            await player1.save();
            message.reply("No monsters are eligible for your current level in this area. Try going to another area.");
            return;
        }

        if (player1.player.cooldowns && player1.player.cooldowns.fighting) {
            const cooldownData = player1.player.cooldowns.fighting;
            const timeSinceLastFight = new Date().getTime() - cooldownData.timestamp;
            if (timeSinceLastFight < cooldownData.duration) {
                var measuredTime = new Date(null);
                measuredTime.setSeconds(Math.ceil((cooldownData.duration - timeSinceLastFight) / 1000));
                var MHSTime = measuredTime.toISOString().substr(11, 8);
                message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                return;
            }
        }    
        player1.player.cooldowns = player1.player.cooldowns || {};
        player1.player.cooldowns.fighting = {
            timestamp: new Date().getTime(),
            duration: shuffleTime
        };
        await player1.save();

        let countdown = 20 * 60;
        //let countdown = 5;

        message.reply(`You started ${EMOJICONFIG.attack6} idle fighting. Please wait 20 Minutes...`).then(msg => {
            let countdownInterval = setInterval(() => {
            countdown--;
                 if (countdown === 0) {

                    clearInterval(countdownInterval);
                    performFishing();
                 } }, 1000);

        async function performFishing() {
try {

    let player = await PLAYERDATA.findOne({ userId: user.id }).exec();
    let balance = await BALANCEDATA.findOne({ userId: message.author.id });

    function calculateTotalItemBonuses(player) {
        let totalBonuses = {
            attack: 0,
            defense: 0,
            health: 0,
            crit: 0,
            dodge: 0,
        };
    
        // Loop through each slot and add the item bonuses to totalBonuses
        for (const slot in player.player.slotItem) {
            const itemId = player.player.slotItem[slot];
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
    
    async function xpToLevel(level) {
        let total = 0;
        for (let l = 1; l < level; l++) {
            total += Math.floor(l + 300 * Math.pow(2, l / 7.0));
        }
        return Math.floor(total / 4);
    }
    
    async function xpToNextLevel(currentLevel) {
        return await xpToLevel(currentLevel + 1) - await xpToLevel(currentLevel);
    }
    
                  async function checkForLevelUp(player) {
                    let leveledUp = false;
                    let currentLevel = player.player.level;
                    let currentXP = balance.eco.xp;
                    let xpNeeded = await xpToNextLevel(currentLevel);
                    let levelConfig = configLevel[`level${currentLevel}`];
                    if (!levelConfig) {
                        console.log("Level configuration not found for level:", currentLevel);   
                        return;           
                    }
                    
                    
                    if (currentXP >= await xpToNextLevel(currentLevel)){
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
                    
    
                    const itemBonuses = calculateTotalItemBonuses(player);
                    totalatk = levelConfig.stats.attack + itemBonuses.attack;
                    totaldef = levelConfig.stats.defense + itemBonuses.defense;
                    totalhealth = levelConfig.stats.health;
                    totaldod = levelConfig.stats.dodge + itemBonuses.dodge;
                    totalcrit = levelConfig.stats.crit + itemBonuses.crit;
                    player.player.attack = totalatk;
                    player.player.defense = totaldef;
                    player.player.health = totalhealth;
                    player.player.dodge = totaldod;
                    player.player.crit = totalcrit;
                    player.player.level = currentLevel;
                    balance.eco.xp = currentXP;
                    await Promise.all([player.save(), balance.save()]);
                
                }           
    
    return leveledUp;
                
        }
        function dropItems(monster) {
            let drops = monster.drops;
            if (!drops) {
                return [];
            }
            let result = [];
            for (let i = 0; i < drops.length; i++) {
                let drop = drops[i];
                let randomNum = Math.random();
                if (randomNum <= drop.dropRate) {
                    result.push(drop);
                }
            }
            return result;
        }
    
        
    
            let slayer = 0;
            const currentArea = player.player.other.area;
            const eligibleFishes = MONSTERCONFIG.filter(monster => monster.area === currentArea);
            if (eligibleFishes.length === 0){
                message.reply("No monsters are eligible for your current level in this area. Try going to another area.");
                return;
            }

            const numFishTypes = Math.floor(Math.random() * 10) + 10;

            const selectedFishes = [];
            for (let i = 0; i < numFishTypes; i++) {
                let fish = eligibleFishes[Math.floor(Math.random() * eligibleFishes.length)];
                selectedFishes.push(fish);
            }
            
            let fishCounts = {};
            for (let i = 0; i < numFishTypes; i++) {
                let fish = eligibleFishes[Math.floor(Math.random() * eligibleFishes.length)];
                if (fish.name in fishCounts) {
                    fishCounts[fish.name].count++;
                } else {
                    fishCounts[fish.name] = {
                        fish: fish,
                        count: 1
                };
            } 
        }
    
        let fishingMessage = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${EMOJICONFIG.attack6} Idle Fight Results`);
            let fields = [];
            let itemMessage = '';
            let totalXP = 0;

//===== BATTLE 
async function battle(player, MAXATK_PLAYER, MAXATK_MONSTER, HEALTH_PLAYER, HEALTH_MONSTER, DEFENSE_MONSTER, DODGEPLAYER, CRITPLAYER, DEFENSE_PLAYER, MONSTER_NAME){
    var monsterStats_atk = MAXATK_MONSTER
    var monsterStats_hth = HEALTH_MONSTER
    var NB_CRIT = 0
    var NB_DODGE = 0
    var NB_ATTACK_PLAYER = 0
    var NB_ATTACK_MONSTER = 0
    var ATK_SOMME_PLAYER = 0
    var ATK_SOMME_MONSTER = 0
    let result;
    var dodgeChance = Math.random() * 100;
    var critChance = Math.random() * 100;

    while(HEALTH_PLAYER > 0 && HEALTH_MONSTER > 0){

        if(CRITPLAYER == false){
            var attackDamagePLayer = Math.floor(Math.random() * MAXATK_PLAYER) + 1 - (DEFENSE_MONSTER * 0.5);
            attackDamagePLayer = isNaN(attackDamagePLayer) ? 10 : attackDamagePLayer;
            attackDamagePLayer = attackDamagePLayer < 0 ? 10 : attackDamagePLayer;
            NB_ATTACK_PLAYER = NB_ATTACK_PLAYER + 1;
            ATK_SOMME_PLAYER = ATK_SOMME_PLAYER + attackDamagePLayer;
            HEALTH_MONSTER = HEALTH_MONSTER - attackDamagePLayer;
        } else {
            var attackDamagePLayerCrit = Math.floor(Math.random() * (MAXATK_PLAYER + player.player.crit)) + 1 - (DEFENSE_MONSTER * 0.5);
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
        let currentLevel = player.player.level;
        let levelConfig = configLevel[`level${currentLevel}`];
        const itemBonuses = calculateTotalItemBonuses(player);
        var totalhealth = levelConfig.stats.health + itemBonuses.health;

           player.player.health = totalhealth;
           await player.save();

            result = "lose"
            break;
        };
        if (HEALTH_MONSTER <= 0){
        // =========== PLAYER WIN ===========

           // player.player.health = HEALTH_PLAYER;
          //  await player.save();
            stats = await STATS.findOne({ botID: 899 });
            if(NB_DODGE == undefined) NB_DODGE = 0
            if(NB_CRIT == undefined) NB_CRIT = 0
            stats.amoutMonsterKilled += 1;
            await stats.save();
            result = "win"
            if (player.player.slayer.task.monster === MONSTER_NAME) {
                player.player.slayer.task.kills += 1;
                await player.save();
                if (slayer !== 1) {
                    slayer = 1;
                }
            }
            break;
            
        }
    
    }
   // console.log(HEALTH_PLAYER);
    return {result, HEALTH_PLAYER, slayer };

}
//===== BATTLE END
 let HEALTH_PLAYER = player.player.health;
for (let fishName of Object.keys(fishCounts)) {
    let fishData = fishCounts[fishName];
    let fish = fishData.fish;
    let fishCaught = fishData.count;
    let MAXATK_PLAYER = player.player.attack;
    let MAXATK_MONSTER = fishData.fish.attack;
   // let HEALTH_PLAYER;
    let HEALTH_MONSTER = fishData.fish.health;
    let DEFENSE_MONSTER = fishData.fish.defense;
    let MONSTER_NAME = fishData.fish.name;
    let DODGEPLAYER = player.player.dodge;
    let CRITPLAYER = player.player.crit;
    for (let i = 0; i < fishCaught; i++) {
    let battleResult = await battle(player, MAXATK_PLAYER, MAXATK_MONSTER, HEALTH_PLAYER, HEALTH_MONSTER, DEFENSE_MONSTER, DODGEPLAYER, CRITPLAYER, player.player.defense, MONSTER_NAME);
    if (battleResult.result === "win") {
        HEALTH_PLAYER = battleResult.HEALTH_PLAYER;
            stats = await STATS.findOne({ botID: 899 });
            let fishingXP = Math.abs(Math.floor(fish.xpReward));
            if (player.player.other.ironman === true) {
                fishingXP = Math.floor(fishingXP * 1.2);
            }
            let goldWon = Math.floor(Math.random() * 500) + 1;
            totalXP += fishingXP;
            stats.amoutCoin += goldWon;   
            player.player.health = HEALTH_PLAYER;
            player.player.other.monsterKill += fishCaught
            await player.save();
            balance.eco.xp += fishingXP;
            balance.eco.totalxp += fishingXP;
            balance.eco.coins += goldWon;
            await balance.save();
            fields.push({ name: `You won against ${fish.name}!`, value: `You earned ${fishingXP} XP and ${goldWon} ${EMOJICONFIG.coin}` });
            let droppedItems = dropItems(fish);
            for (let droppedItem of droppedItems) {
                let alreadyHasItem = player.player.stuff.stuffUnlock.find(item => item.id === Number(droppedItem.itemId));
                stats = await STATS.findOne({ botID: 899 });
                stats.amoutItem += 1;
                if (alreadyHasItem) {
                    alreadyHasItem.amount += 1;
                } else {
                    player.player.stuff.stuffUnlock.push({
                        id: droppedItem.itemId,
                        name: droppedItem.name,
                        level: 1,
                        amount: 1
                    });
                }
                    await player.save();
                    itemMessage += `Drop: **${droppedItem.name}**\n`;
            }

            await stats.save();
        
        }
    
        else if (battleResult.result === "lose") {
            stats = await STATS.findOne({ botID: 899 });
            let currentLevel = player.player.level;
            let levelConfig = configLevel[`level${currentLevel}`];
            const itemBonuses = calculateTotalItemBonuses(player);
            var totalhealth = levelConfig.stats.health + itemBonuses.health;
            let goldLost = Math.floor(balance.eco.coins * 0.1);
            stats.amoutCoin -= goldLost;
            player.player.health = totalhealth;
            balance.eco.coins -= goldLost;
            await player.save();
            await balance.save();
            await stats.save();
            fields.push({ name: `You lost against ${fish.name}!`, value: `You lost ${goldLost} ${EMOJICONFIG.coin}` });
        }
    }
} 

async function xpCap(level) {
    let xp = await xpToNextLevel(level) * 0.10;
    return Math.round(xp);
}
                const party = await Party.findOne({ member: { $elemMatch: { id: message.author.id } } });
                let sharedXpPercentage = 0;
                let inparty = false;
            if (party && party.member.length > 1) {
                inparty = true;
            const additionalXPPerMember = Math.floor(totalXP * 0.02);
            const totalAdditionalXP = Math.min(additionalXPPerMember * party.member.length, Math.floor(totalXP * 0.10));
             sharedXpPercentage = (totalAdditionalXP / totalXP) * 100;
            //    for (const member of party.member) {
                    let promises = party.member.map(async member => {
                    if (member.id === message.author.id) return;
                    let memberBalance = await BALANCEDATA.findOne({ userId: member.id });
                    let memberBalance2 = await PLAYERDATA.findOne({ userId: member.id });
                    if (memberBalance) {
                        memberBalance.eco.xp = Math.round(memberBalance.eco.xp + totalAdditionalXP);
                        memberBalance.eco.totalxp = Math.round(memberBalance.eco.totalxp + totalAdditionalXP);
                        const xpCapForLevel = await xpCap(memberBalance2.player.level);
                    if (memberBalance.eco.xp > xpCapForLevel) {
                        memberBalance.eco.xp = xpCapForLevel;
                    }
                    try {
                 await memberBalance.save();
                 await memberBalance2.save();
                } catch (error) {
                    console.error(`Error saving memberBalance or memberBalance2 for user ${member.id}:`, error);
                }
            }
        });

     //   }
    }
        fields.push({ name:`Total XP`, value: ` ${totalXP} XP!\n`});
        let playerLeveledUp;
        if (player.player.level >= 120) {
        }
        else if (player.player.level < 120){
             playerLeveledUp = await checkForLevelUp(player);
            await checkForLevelUp(player);
        }
            if(playerLeveledUp) {
                fields.push({ name: `Level Up!`, value: `Your new level is ${player.player.level}.\n`});
            if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
            const logChannel = client.channels.cache.get('1169491579774443660');
            var now = new Date();
            var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            var messageEmbed = new EmbedBuilder()
            .setColor('#D5EB0D')
            .setTitle(`Log ${date}`)
            .setDescription(`${EMOJICONFIG.attack6} ${inlineCode(user.username)} is now level **${player.player.level}**!`);
            logChannel.send({embeds: [messageEmbed], ephemeral: true });
            
            } else {
                if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
            }
            fields.push({ name: itemMessage || 'No Drops', value: '\u200B' });

            fishingMessage.addFields(fields);
            player = await PLAYERDATA.findOne({ userId: user.id });
            if (slayer === 1) {
                fishingMessage.addFields({
                name: '**Slayer Task Progress**',
                value: `You have killed ${player.player.slayer.task.kills} / ${player.player.slayer.task.neededKills} ${player.player.slayer.task.monster}!`
                });
            }

            message.reply({ embeds: [fishingMessage] });
            player.player.energy -= 2;    
            await player.save();
    
} catch (err) {
    console.log(err);
} }
        
    });
    }
    catch (err) {
        console.log(err);

};
        }
    },

info: {
    names: ['idlefight'],
}
    }