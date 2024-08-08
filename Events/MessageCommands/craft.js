const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const CRAFT = require('../../config/craft.json');
const Party = require('../../modules/party.js');
const { prefix } = require('../../App/config.json')
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const EMOJICONFIG = require('../../config/emoji.json');
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
            const bar = args[0].toLowerCase();

            let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
            if (!playerStats) {
                return message.reply('You are not a player! Use `@FlipMMO start` to begin your adventure.');
            }
            let recipe = CRAFT.find(item => item.smithalias === bar);
            if (!recipe) {
                return message.reply(`The recipe for the specified totem doesn't exist.`);
            }            

            if (playerStats.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@FlipMMO energy')}`)

            var user = message.author;
            let quantity;
            if (!parseInt(args[1])) {
                let maxQuantities = [];
                for (const item of recipe.combination) {
                    let itemInInventory;
                    if (item.type === 'log') {
                        itemInInventory = playerStats.player.stuff.logs.find(o => o.id === item.id);
                    } else if (item.type === 'bar') {
                        itemInInventory = playerStats.player.stuff.bars.find(o => o.id === item.id);
                    }
                    if (itemInInventory) {
                        let maxQuantityForThisItem = Math.floor(itemInInventory.amount / item.amount);
                        maxQuantities.push(maxQuantityForThisItem);
                    }
                }
                quantity = Math.min(...maxQuantities);
            } else {
                quantity = parseInt(args[1]) || 1;
            }
            
            for (const item of recipe.combination) {
                let itemInInventory;
                if (item.type === 'log') {
                    itemInInventory = playerStats.player.stuff.logs.find(o => o.id === item.id);
                } else if (item.type === 'bar') {
                    itemInInventory = playerStats.player.stuff.bars.find(o => o.id === item.id);
                }
                if (!itemInInventory || itemInInventory.amount < item.amount * quantity) {
                    return message.reply(`You do not have enough ${item.name}.`);
                }
            }
            
            if (playerStats.player.crafting.level < recipe.level) {
                return message.reply(`You need to be at least level ${recipe.level} to craft this totem`);
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
        playerStats.player.cooldowns = playerStats.player.cooldowns || {};
        playerStats.player.cooldowns.skilling = {
            timestamp: new Date().getTime(),
            duration: shuffleTime
        };

        await playerStats.save();
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
                return message.reply(`This totem cannot be made. Please specify a valid totem.`);
            }

            // Remove the required ores from the player's inventory and add the new bars
            for (const item of recipe.combination) {
                let itemInInventory;
                if (item.type === 'log') {
                    itemInInventory = playerStats.player.stuff.logs.find(o => o.id === item.id);
                } else if (item.type === 'bar') {
                    itemInInventory = playerStats.player.stuff.bars.find(o => o.id === item.id);
                }
                if (itemInInventory && itemInInventory.amount >= item.amount * quantity) {
                    itemInInventory.amount -= item.amount * quantity;
                } else {
                    return message.reply(`You do not have enough ${item.name}.`);
                }
            }
    
            const barId = recipe.id;
            const barName = recipe.name;
            
            let bar1 = playerStats.player.stuff.gem.find(b => b.id === barId);
            if (!bar1) {
                playerStats.player.stuff.gem.push({
                    id: barId,
                    name: barName,
                    amount: quantity
                });            
            } else if (bar1){
                bar1.amount += quantity;
            }
            const totalxp = Math.abs(Math.floor(quantity * recipe.xp));
            playerStats.player.crafting.xp += totalxp;
            playerStats.player.crafting.totalxp += totalxp;


            let fishingMessage = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${EMOJICONFIG.totem} Crafting Results`);
            let fields = [];
            fields.push({ name: `You Crafted`, value: `${EMOJICONFIG.totem} ${quantity} ${recipe.name}`});
            fields.push({ name: `XP Gained`, value: `${totalxp} XP`});



            const party = await Party.findOne({ member: { $elemMatch: { id: message.author.id } } });
                let sharedXpPercentage = 0;
                let inparty = false;            
                if (party && party.member.length > 1) {
                    inparty=true;
                const additionalXPPerMember = Math.floor(totalxp * 0.02);
                const totalAdditionalXP = Math.min(additionalXPPerMember * party.member.length, Math.floor(totalxp * 0.10));
                sharedXpPercentage = (totalAdditionalXP / totalxp) * 100;
                  //  for (const member of party.member) {
                        let promises = party.member.map(async member => {
                        if (member.id === message.author.id) Promise.resolve();
                        let memberBalance = await PLAYERDATA.findOne({ userId: member.id });
                        if (memberBalance) {
                        memberBalance.player.crafting.xp += totalAdditionalXP;
                        memberBalance.player.crafting.totalxp += totalAdditionalXP;
                     await memberBalance.save();
                }
            });
            await Promise.all(promises);
    
        //    }
        }
        let xpNeeded = xpToNextLevel(playerStats.player.crafting.level);
        
        if (playerStats.player.crafting.xp >= xpNeeded) {
            if (playerStats.player.crafting.level >= 120) {
            }
            else if (playerStats.player.crafting.level <= 120) {
                while (playerStats.player.crafting.xp >= xpToNextLevel(playerStats.player.crafting.level)) {
                    playerStats.player.crafting.level += 1;
                    let xpNeeded = xpToNextLevel(playerStats.player.crafting.level - 1);
                    if (playerStats.player.crafting.xp >= xpNeeded) {
                        playerStats.player.crafting.xp -= xpNeeded;
                    } else {
                        playerStats.player.crafting.xp = 0;
                    }
                }
                fields.push({ name: `Congratulations! You leveled up!`, value: `Your new level is ${playerStats.player.crafting.level}.\n`});
                if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
            const logChannel = client.channels.cache.get('1169491579774443660');
            var now = new Date();
            var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            var messageEmbed = new EmbedBuilder()
            .setColor('#D5EB0D')
            .setTitle(`Log ${date}`)
            .setDescription(`${EMOJICONFIG.totem} ${inlineCode(user.username)} is now crafting level **${playerStats.player.crafting.level}**!`);
            logChannel.send({embeds: [messageEmbed], ephemeral: true });


        } } else{
            if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
    }

    fishingMessage.addFields(fields);
    message.reply({ embeds: [fishingMessage] });

    playerStats.player.energy -= 2;
    await playerStats.save();
} catch (err) {
    console.log(err);
} }

}
            

        
    },
info: {
    names: ['craft'],
} }