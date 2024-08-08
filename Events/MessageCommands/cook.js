const PLAYER = require('../../modules/player.js');
const RAW_FISHES = require('../../config/fish.json'); // Raw fish config
const COOKED_FISHES = require('../../config/cook.json'); // Cooked fish config
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const Party = require('../../modules/party.js');
const EMOJICONFIG = require('../../config/emoji.json');
const shuffleTime = 30000;
const crops = require('../../config/crops.json');

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


    var user = message.author;
    var fishToCookName = args[0];

try {

    if (!fishToCookName) {
        message.reply("Please specify a fish to cook.");
        return;  
    }

    // Find the player
    let player = await PLAYER.findOne({ userId: user.id }).exec();
    if (!player) {
        message.reply("You are not a player yet.");
        return;
    }
    if (player.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@FlipMMO energy')}`)

                const itemToCook = COOKED_FISHES.find(item => item.eatalias === fishToCookName.toLowerCase());
                if (itemToCook.type === 'fish') {

                const fishToCook = player.player.stuff.fish.find(f => f.name.toLowerCase() === fishToCookName.toLowerCase());
                if (!fishToCook || fishToCook.amount <= 0) {
                message.reply(`You do not have any ${fishToCookName} to cook.`);
                    return;
                }

                const cookedFishConfig = COOKED_FISHES.find(f => f.eatalias.toLowerCase() === fishToCookName.toLowerCase());
                if (!cookedFishConfig) {
                    message.reply(`The fish ${fishToCookName} cannot be cooked.`);
                    return;
                }

                if (player.player.cooking.level < cookedFishConfig.level) {
                    message.reply(`You need to be cooking level ${cookedFishConfig.level} to cook ${fishToCookName}.`);
                    return;
                }

/*
                if (player.player.cooldowns && player.player.cooldowns.skilling) {
                    const cooldownData = player.player.cooldowns.skilling;
                    const timeSinceLastFight = new Date().getTime() - cooldownData.timestamp;
                    if (timeSinceLastFight < cooldownData.duration) {
                        var measuredTime = new Date(null);
                        measuredTime.setSeconds(Math.ceil((cooldownData.duration - timeSinceLastFight) / 1000));
                        var MHSTime = measuredTime.toISOString().substr(11, 8);
                        message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                        return;
                    }
                }    
                player.player.cooldowns = player.player.cooldowns || {};
                player.player.cooldowns.skilling = {
                    timestamp: new Date().getTime(),
                    duration: shuffleTime
                };
*/
                player.player.energy -= 2;
                await player.save();
                    performCooking();

async function performCooking () {

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

                    const player = await PLAYER.findOne({ userId: user.id });
                     function calculateSuccessRate(cookingLevel) {
                        const failureRate = (120 - cookingLevel) / 98 * 0.5;
                        return 1 - failureRate;
                    }
                    const fishToCook = player.player.stuff.fish.find(f => f.name.toLowerCase() === fishToCookName.toLowerCase());
                    const cookedFishConfig = COOKED_FISHES.find(f => f.eatalias.toLowerCase() === fishToCookName.toLowerCase());
                    const successRate = calculateSuccessRate(player.player.cooking.level);
                    const amountToCook = fishToCook.amount;
                    const cookedAmount = Math.floor(amountToCook * successRate);
                    const failedAmount = amountToCook - cookedAmount;
                    if (isNaN(cookedAmount) || isNaN(failedAmount)) {

                        console.error('Calculated cookedAmount or failedAmount is NaN');
                    
                        return;
                    
                    }
                            fishToCook.amount -= amountToCook;
                            if (!player.player.stuff.food) {

                                player.player.stuff.food = [];
                            
                            }
                            
                            const cookedFish = player.player.stuff.food.find(f => f.name.toLowerCase() === `cooked ${fishToCookName}`.toLowerCase());
                            const cookedFish2 = COOKED_FISHES.find(f => f.name.toLowerCase() === `cooked ${fishToCookName}`.toLowerCase());
                            console.log(fishToCook);

                            if (!cookedFish) {

                                player.player.stuff.food.push({
                    
                                    id: cookedFish2.id,    
                                    name: `cooked ${fishToCookName.toLowerCase()}`,   
                                    amount: cookedAmount    
                                });     
                            } else {     
                                cookedFish.amount += cookedAmount;
                            }
                           
                            const cookingXP = Math.abs(Math.floor(cookedFish2.xp * cookedAmount));
                            if (isNaN(cookingXP)) {
                                console.error('Calculated cookingXP is NaN');
                                 return;
                            }
                            player.player.cooking.xp += cookingXP;
                            player.player.cooking.totalxp += cookingXP;

                            let fishingMessage = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle(`${EMOJICONFIG.cookedmeat} Cooking Results`);
                            let fields = [];
                            fields.push({ name: `You cooked`, value: `${cookedAmount} ${fishToCookName} and failed ${failedAmount}`});
                            fields.push({ name: `XP Gained`, value: `${cookingXP} XP`});

                            const party = await Party.findOne({ member: { $elemMatch: { id: message.author.id } } });
                            let sharedXpPercentage = 0;
                            let inparty = false;            
                            if (party && party.member.length > 1) {
                                inparty=true;
                            const additionalXPPerMember = Math.floor(cookingXP * 0.02);
                            const totalAdditionalXP = Math.min(additionalXPPerMember * party.member.length, Math.floor(cookingXP * 0.10));
                            sharedXpPercentage = (totalAdditionalXP / cookingXP) * 100;
                                let promises = party.member.map(async member => {
                                    if (member.id === message.author.id) return;
                                    let memberBalance = await PLAYER.findOne({ userId: member.id });
                                    if (memberBalance) {
                                    memberBalance.player.cooking.xp += totalAdditionalXP;
                                    memberBalance.player.cooking.totalxp += totalAdditionalXP;
                                }
                                 await memberBalance.save();
                    });
                            }
                            
                            let xpNeeded = xpToNextLevel(player.player.cooking.level);
                            if (player.player.cooking.xp >= xpNeeded) {
                                if (player.player.cooking.level >= 120) {
                                }
                                else if (player.player.cooking.level <= 120) {
                
                                    while (player.player.cooking.xp >= xpToNextLevel(player.player.cooking.level)) {
                                        player.player.cooking.level += 1;
                                        let xpNeeded = xpToNextLevel(player.player.cooking.level - 1);
                                        if (player.player.cooking.xp >= xpNeeded) {
                                            player.player.cooking.xp -= xpNeeded;
                                        } else {
                                            player.player.cooking.xp = 0;
                                        }
                                    }                    
                                                    
                            
                            
                                    fields.push({ name: `Congratulations! You leveled up!`, value: `Your new level is ${player.player.cooking.level}.\n`});
                                    if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
                                const logChannel = client.channels.cache.get('1169491579774443660');
                                var now = new Date();
                                var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                                var messageEmbed = new EmbedBuilder()
                                .setColor('#D5EB0D')
                                .setTitle(`Log ${date}`)
                                .setDescription(`${EMOJICONFIG.cookedmeat} ${inlineCode(user.username)} is now cooking level **${player.player.cooking.level}**!`);
                                logChannel.send({embeds: [messageEmbed], ephemeral: true });    
                            } } else{
                                if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
                        }

                        fishingMessage.addFields(fields);
                        message.reply({ embeds: [fishingMessage] });
                

                        await player.save();
                    } catch (err) {
                        console.log(err);
                    } }
                }
                if (itemToCook.type === 'crop') {
                    const cookedFishConfig = COOKED_FISHES.find(f => f.eatalias.toLowerCase() === fishToCookName.toLowerCase());
                    if (!cookedFishConfig) {
                        message.reply(`Invalid food item: ${fishToCookName}`);
                        return;
                    }
                    const cropConfig = crops.find(c => c.foodid === cookedFishConfig.id);
                    const fishToCook = player.player.stuff.crops.find(c => c.id === cropConfig.id);
                    if (!fishToCook || fishToCook.amount <= 0) {
                        message.reply(`You do not have any ${fishToCookName} to cook.`);
                        return;
                    }
                    
                    if (!cookedFishConfig) {
                        message.reply(`The fish ${fishToCookName} cannot be cooked.`);
                        return;
                    }
    
                    if (player.player.cooking.level < cookedFishConfig.level) {
                        message.reply(`You need to be cooking level ${cookedFishConfig.level} to cook ${fishToCookName}.`);
                        return;
                    }
    
    /*
                    if (player.player.cooldowns && player.player.cooldowns.skilling) {
                        const cooldownData = player.player.cooldowns.skilling;
                        const timeSinceLastFight = new Date().getTime() - cooldownData.timestamp;
                        if (timeSinceLastFight < cooldownData.duration) {
                            var measuredTime = new Date(null);
                            measuredTime.setSeconds(Math.ceil((cooldownData.duration - timeSinceLastFight) / 1000));
                            var MHSTime = measuredTime.toISOString().substr(11, 8);
                            message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                            return;
                        }
                    }    
                    player.player.cooldowns = player.player.cooldowns || {};
                    player.player.cooldowns.skilling = {
                        timestamp: new Date().getTime(),
                        duration: shuffleTime
                    };
    */
                    player.player.energy -= 2;
                    await player.save();
                        performCooking();
    
    async function performCooking () {
    
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
    
                        const player = await PLAYER.findOne({ userId: user.id });
                         function calculateSuccessRate(cookingLevel) {
                            const failureRate = (120 - cookingLevel) / 98 * 0.5;
                            return 1 - failureRate;
                        }
                        const cookedFishConfig = COOKED_FISHES.find(f => f.eatalias.toLowerCase() === fishToCookName.toLowerCase());
                        const cropConfig = crops.find(c => c.foodid === cookedFishConfig.id);
                        const fishToCook = player.player.stuff.crops.find(c => c.id === cropConfig.id);
                        const successRate = calculateSuccessRate(player.player.cooking.level);
                        const amountToCook = fishToCook.amount;
                        const cookedAmount = Math.floor(amountToCook * successRate);
                        const failedAmount = amountToCook - cookedAmount;
                        if (isNaN(cookedAmount) || isNaN(failedAmount)) {
    
                            console.error('Calculated cookedAmount or failedAmount is NaN');
                        
                            return;
                        
                        }
                                fishToCook.amount -= amountToCook;
                                if (!player.player.stuff.food) {
    
                                    player.player.stuff.food = [];
                                
                                }
                                
                                const cookedFish = player.player.stuff.food.find(f => f.name.toLowerCase() === cookedFishConfig.name.toLowerCase());
                                if (!cookedFish) {
    
                                    player.player.stuff.food.push({
                        
                                        id: cookedFishConfig.id,    
                                        name: cookedFishConfig.name.toLowerCase(),   
                                        amount: cookedAmount    
                                    });     
                                } else {     
                                    cookedFish.amount += cookedAmount;
                                }
                                const fishie = COOKED_FISHES.find(cf => cf.id === fishToCook.id).xp
                                const cookingXP = Math.abs(Math.floor(fishie * cookedAmount));
                                if (isNaN(cookingXP)) {
                                    console.error('Calculated cookingXP is NaN');
                                     return;
                                }
                                player.player.cooking.xp += cookingXP;
                                player.player.cooking.totalxp += cookingXP;
    
                                let fishingMessage = new EmbedBuilder()
                                .setColor('#0099ff')
                                .setTitle(`${EMOJICONFIG.cookedmeat} Cooking Results`);
                                let fields = [];
                                fields.push({ name: `You cooked`, value: `${cookedAmount} ${cookedFishConfig.name.toLowerCase()} and failed ${failedAmount}`});
                                fields.push({ name: `XP Gained`, value: `${cookingXP} XP`});
    
                                const party = await Party.findOne({ member: { $elemMatch: { id: message.author.id } } });
                                let sharedXpPercentage = 0;
                                let inparty = false;            
                                if (party && party.member.length > 1) {
                                    inparty=true;
                                const additionalXPPerMember = Math.floor(cookingXP * 0.02);
                                const totalAdditionalXP = Math.min(additionalXPPerMember * party.member.length, Math.floor(cookingXP * 0.10));
                                sharedXpPercentage = (totalAdditionalXP / cookingXP) * 100;
                                    let promises = party.member.map(async member => {
                                        if (member.id === message.author.id) return;
                                        let memberBalance = await PLAYER.findOne({ userId: member.id });
                                        if (memberBalance) {
                                        memberBalance.player.cooking.xp += totalAdditionalXP;
                                        memberBalance.player.cooking.totalxp += totalAdditionalXP;
                                    }
                                     await memberBalance.save();
                        });
                                }
                    
                                const xpNeeded = xpToNextLevel(player.player.cooking.level);
                                if (player.player.cooking.xp >= xpNeeded) {
                                    if (player.player.cooking.level >= 120) {
                                    }
                                    else if (player.player.cooking.level <= 120) {
    
                                        while (player.player.cooking.xp >= xpToNextLevel(player.player.cooking.level)) {
                                            player.player.cooking.level += 1;
                                            player.player.cooking.xp -= xpToNextLevel(player.player.cooking.level);
                                        }
                                        
                                
                                
                                        fields.push({ name: `Congratulations! You leveled up!`, value: `Your new level is ${player.player.cooking.level}.\n`});
                                        if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
                                    const logChannel = client.channels.cache.get('1169491579774443660');
                                    var now = new Date();
                                    var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                                    var messageEmbed = new EmbedBuilder()
                                    .setColor('#D5EB0D')
                                    .setTitle(`Log ${date}`)
                                    .setDescription(`${EMOJICONFIG.cookedmeat} ${inlineCode(user.username)} is now cooking level **${player.player.cooking.level}**!`);
                                    logChannel.send({embeds: [messageEmbed], ephemeral: true });    
                                } } else{
                                    if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
                            }
    
                            fishingMessage.addFields(fields);
                            message.reply({ embeds: [fishingMessage] });
                    
    
                            await player.save();
                        } catch (err) {
                            console.log(err);
                        } }
                    }
                }
                catch (error) {
                    console.log(error);
            
            }; 
                      
        }
    },
info: {
    names: ['cook'],
} }