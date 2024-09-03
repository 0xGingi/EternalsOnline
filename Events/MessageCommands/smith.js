const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const SMELT = require('../../config/smelt.json');
const smithData = require('../../config/smith.json');
const Party = require('../../modules/party.js');
const { prefix } = require('../../App/config.json')
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const EMOJICONFIG = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const player = require('../../modules/player.js');
const shuffleTime = 30000;

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
            let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
            if (!playerStats) {
                return message.reply('You are not a player! Use `@Eternals start` to begin your adventure.');
            }
            if (playerStats.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)

            const bar = args[0].toLowerCase();

            let recipe = smithData.find(item => item.equipalias.toLowerCase() === bar.toLowerCase());
            if (!recipe) {
                return message.reply(`The recipe for the specified item doesn't exist.`);
            }            

            var user = message.author; 
          //  const quantity = parseInt(args[1]) || 1;
          let quantity;
          if (!parseInt(args[1])) {
            let maxQuantities = [];
            for (const bar of recipe.combination) {
                let barInInventory = playerStats.player.stuff.bars.find(b => b.id === bar.id);
                if (!barInInventory || barInInventory.amount < bar.amount) {
                    message.channel.send(`You don't have enough ${bar.name} to smith a bar.`);
                    return;
                }
                let maxQuantityForThisBar = Math.floor(barInInventory.amount / bar.amount);
                maxQuantities.push(maxQuantityForThisBar);
            }
            quantity = Math.min(...maxQuantities);
        } else {
            quantity = parseInt(args[1]) || 1;
        }
        
        if (!Array.isArray(recipe.combination)) {
                return message.reply(`This item cannot be made. Please specify a valid item.`);
            }

            if (playerStats.player.smithing.level < recipe.level) {
                return message.reply(`You need to be at least level ${recipe.level} to craft this item.`);
            }
    /*
            if (playerStats.player.cooldowns && playerStats.player.cooldowns.skilling) {
                const cooldownData = playerStats.player.cooldowns.skilling;
                const timeSinceLastFight = new Date().getTime() - cooldownData.timestamp;
                if (timeSinceLastFight < cooldownData.duration) {
                    var measuredTime = new Date(null);
                    measuredTime.setSeconds(Math.ceil((cooldownData.duration - timeSinceLastFight) / 1000));
                    var MHSTime = measuredTime.toISOString().substr(11, 8);
                    message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                    return;
                }
            }
            */    
                            performFishing();
        
    async function performFishing() {
        try {
                            
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


            if (!Array.isArray(recipe.combination)) {
                return message.reply(`This item cannot be made. Please specify a valid item.`);
            }

            for (const ore of recipe.combination) {
                let oreInInventory = playerStats.player.stuff.bars.find(o => o.id === ore.id);
                if (oreInInventory && oreInInventory.amount >= ore.amount * quantity) {
                    oreInInventory.amount -= ore.amount * quantity;
                } else {
                    return message.reply(`You do not have enough ${ore.name}.`);              
            }
        }

            const barId = recipe.id;
            const barName = recipe.name;
            
            let bar1 = playerStats.player.stuff.stuffUnlock.find(b => b.id === barId);
            if (!bar1) {
                playerStats.player.stuff.stuffUnlock.push({
                    id: barId,
                    name: barName,
                    amount: quantity,
                    level: 1
                });            
            } else if (bar1){
                bar1.amount += quantity;
            }
            const totalxp = Math.abs(Math.floor(quantity * recipe.xp));
            playerStats.player.smithing.xp += totalxp;
            playerStats.player.smithing.totalxp += totalxp;

            let fishingMessage = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${EMOJICONFIG.hammer2} Smithing Results`);
            let fields = [];
            fields.push({ name: `You smithed`, value: `${EMOJICONFIG.ore} ${quantity} ${recipe.name}`});
            fields.push({ name: `XP Gained`, value: `${totalxp} XP`});


            const party = await Party.findOne({ member: { $elemMatch: { id: message.author.id } } });
                let sharedXpPercentage = 0;
                let inparty = false;            
                if (party && party.member.length > 1) {
                    inparty=true;
                const additionalXPPerMember = Math.floor(totalxp * 0.02);
                const totalAdditionalXP = Math.min(additionalXPPerMember * party.member.length, Math.floor(totalxp * 0.10));
                sharedXpPercentage = (totalAdditionalXP / totalxp) * 100;
                //    for (const member of party.member) {
                        let promises = party.member.map(async member => {
                        if (member.id === message.author.id) Promise.resolve();
                        let memberBalance = await PLAYERDATA.findOne({ userId: member.id });
                        if (memberBalance) {
                        memberBalance.player.smithing.xp += totalAdditionalXP;
                        console.log(memberBalance.player.smithing.xp)
                        console.log(totalAdditionalXP)
                        memberBalance.player.smithing.totalxp += totalAdditionalXP;

                     await memberBalance.save();
                }
            });
            await Promise.all(promises);
    
       //     }
        }
        let xpNeeded = xpToNextLevel(playerStats.player.smithing.level);
        
        if (playerStats.player.smithing.xp >= xpNeeded) {
            if (playerStats.player.smithing.level >= 120) {
            }
            else if (playerStats.player.smithing.level <= 120) {
                while (playerStats.player.smithing.xp >= xpToNextLevel(playerStats.player.smithing.level)) {
                    playerStats.player.smithing.level += 1;
                    let xpNeeded = xpToNextLevel(playerStats.player.smithing.level - 1);
                    if (playerStats.player.smithing.xp >= xpNeeded) {
                        playerStats.player.smithing.xp -= xpNeeded;
                    } else {
                        playerStats.player.smithing.xp = 0;
                    }
                }

                fields.push({ name: `Congratulations! You leveled up!`, value: `Your new level is ${playerStats.player.smithing.level}.\n`});
                if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
            const logChannel = client.channels.cache.get('1169491579774443660');
            var now = new Date();
            var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            var messageEmbed = new EmbedBuilder()
            .setColor('#D5EB0D')
            .setTitle(`Log ${date}`)
            .setDescription(`${EMOJICONFIG.hammer2} ${inlineCode(user.username)} is now smithing level **${playerStats.player.smithing.level}**!`);
            logChannel.send({embeds: [messageEmbed], ephemeral: true });


        } } else{                
            if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
    }

    fishingMessage.addFields(fields);
    message.reply({ embeds: [fishingMessage] });
    
    //playerStats.player.cooldowns = playerStats.player.cooldowns || {};
    //playerStats.player.cooldowns.skilling = {
    //    timestamp: new Date().getTime(),
    //    duration: shuffleTime
    //};
    playerStats.player.energy -= 2;
    await playerStats.save();
} catch (err) {
    console.log(err);
} }

}
            

        
    },
info: {
    names: ['smith'],
} }