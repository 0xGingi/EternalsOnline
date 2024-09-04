const PLAYER = require('../../modules/player.js');
const FISHES = require('../../config/fish.json'); // assuming you have a fish.json file
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { prefix } = require('../../App/config.json')
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const Party = require('../../modules/party.js');
const EMOJICONFIG = require('../../config/emoji.json');
const shuffleTime = 1200000;

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName) {
		if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
 
    var user = message.author;
    let constore = args[0];


    try {

        let player = await PLAYER.findOne({ userId: user.id }).exec();
        if (!player) {
            message.reply("You are not a player yet.");
            return;
        }
        if (player.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)


        const currentArea = player.player.other.area;
        const eligibleFishes = FISHES.filter(fish => 
            player.player.fishing.level >= fish.level && 
            fish.area.includes(currentArea)
        );            
        if (eligibleFishes.length === 0){
            message.reply("No fishes are eligible for your current fishing level in this area. Try going to another area.");
            return;
        }

        if (constore && !eligibleFishes.some(fish => fish.alias.toLowerCase() === constore.toLowerCase())) {
            message.reply(`You cannot fish ${constore} in your current area.`);
            return;
        }
        
        if (constore && eligibleFishes.some(fish => fish.alias.toLowerCase() === constore.toLowerCase() && player.player.fishing.level < fish.level)) {
            message.reply(`Your fishing level is not high enough to fish for ${constore} in your current area.`);
            return;
        }

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
        await player.save();


        let countdown = 20 * 60;
        message.reply(`You started ${EMOJICONFIG.fishpole} idle fishing. Please wait 20 Minutes...`).then(msg => {
            let countdownInterval = setInterval(() => {
            countdown--;
                 if (countdown === 0) {

                    clearInterval(countdownInterval);
                    performFishing();
                 } }, 1000);

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

    
            const player = await PLAYER.findOne({ userId: user.id });  
            const currentArea = player.player.other.area;
            const eligibleFishes = FISHES.filter(fish => 
                player.player.fishing.level >= fish.level && 
                fish.area.includes(currentArea)
            );            
            if (eligibleFishes.length === 0){
                message.reply("No fishes are eligible for your current fishing level in this area. Try going to another area.");
                return;
            }

            let numFishTypes;
            if (constore){
                numFishTypes = 1;
            }
            else{
                numFishTypes = Math.floor(Math.random() * 4) + 2;
            }

            const selectedFishes = [];
            let fish;
            if (constore) {
                fish = eligibleFishes.find(fish => fish.alias.toLowerCase() === constore.toLowerCase());
                selectedFishes.push(fish);
            }
            else {
                for (let i = 0; i < numFishTypes; i++) {
                fish = eligibleFishes[Math.floor(Math.random() * eligibleFishes.length)];
                selectedFishes.push(fish);
                }
            }    
            let fishingMessage = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${EMOJICONFIG.fishpole} Idle Fishing Results`);
            let fields = [];
            
            let totalXP = 0;
            let fishCaughtMessage = '';
            for (const fish of selectedFishes) {
            let fishCaught;
            if (constore){
                fishCaught = Math.floor(Math.random() * 500) + 100;
            }
            else{
                fishCaught = Math.floor(Math.random() * 120) + 1;
            }
            
            if (player.player.other.ironman === true) {
                fishCaught = Math.floor(fishCaught * 1.2);
            }

            const playerFish = player.player.stuff.fish.find(f => f.name === fish.name);
            if (!playerFish) {
                player.player.stuff.fish.push({
                    id: fish.id,
                    name: fish.name,
                    amount: fishCaught
                });
            } else {
                playerFish.amount += fishCaught;
            }

            let fishingXP = Math.abs(Math.floor(fish.xp * fishCaught));
            if (player.player.other.ironman === true) {
                fishingXP = Math.floor(fishingXP * 1.2);
            }
            
            player.player.fishing.xp += fishingXP;
            player.player.fishing.totalxp += fishingXP;

            totalXP += fishingXP;
            fishCaughtMessage += `${EMOJICONFIG.fish22} ${fishCaught} ${fish.name}\n`;
        }
        fields.push({ name: `You caught`, value: fishCaughtMessage });
  
        
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
                    if (member.id === message.author.id) Promise.resolve();
                    let memberBalance = await PLAYER.findOne({ userId: member.id });
                    if (memberBalance) {
                    memberBalance.player.fishing.xp += totalAdditionalXP;
                    memberBalance.player.fishing.totalxp += totalAdditionalXP;
                /*
                    let xpNeeded = xpToNextLevel(memberBalance.player.fishing.level);
                    let initialLevel = memberBalance.player.fishing.level;
                    while (memberBalance.player.fishing.xp >= xpNeeded) {
                        if (memberBalance.player.fishing.level < 99) {
                            memberBalance.player.fishing.level += 1;
                            memberBalance.player.fishing.xp -= xpNeeded;
                            xpNeeded = xpToNextLevel(memberBalance.player.fishing.level);

                
                        }
                    }   
                    if (memberBalance.player.fishing.level > initialLevel) {
                    const logChannel = client.channels.cache.get('1169491579774443660');
                    var now = new Date();
                    var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                    var messageEmbed = new EmbedBuilder()
                    .setColor('#D5EB0D')
                    .setTitle(`Log ${date}`)
                    .setDescription(`${EMOJICONFIG.fishpole} ${inlineCode(member.pseudo)} is now fishing level **${memberBalance.player.fishing.level}**!`);
                    logChannel.send({embeds: [messageEmbed], ephemeral: true });
                }    
                */


                 await memberBalance.save();
            }
        });
        await Promise.all(promises);

    //    }
    }

        fields.push({ name: `Total XP Gained`, value: `${totalXP} XP!` });

            let xpNeeded = xpToNextLevel(player.player.fishing.level);
            if (player.player.fishing.xp >= xpNeeded) {
                if (player.player.fishing.level >= 120) {
                }
                else if (player.player.fishing.level <= 120) {

                    while (player.player.fishing.xp >= xpToNextLevel(player.player.fishing.level)) {
                        player.player.fishing.level += 1;
                        let xpNeeded = xpToNextLevel(player.player.fishing.level - 1);
                        if (player.player.fishing.xp >= xpNeeded) {
                            player.player.fishing.xp -= xpNeeded;
                        } else {
                            player.player.fishing.xp = 0;
                        }
                    }                    

                fields.push({ name: `Congratulations! You leveled up!`, value: `Your new level is ${player.player.fishing.level}.\n`});
                if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
            const logChannel = client.channels.cache.get('1169491579774443660');
            var now = new Date();
            var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            var messageEmbed = new EmbedBuilder()
            .setColor('#D5EB0D')
            .setTitle(`Log ${date}`)
            .setDescription(`${EMOJICONFIG.fishpole} ${inlineCode(user.username)} is now fishing level **${player.player.fishing.level}**!`);
            logChannel.send({embeds: [messageEmbed], ephemeral: true });
            } }
             else {
                if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
            } 

            fishingMessage.addFields(fields);
            message.reply({ embeds: [fishingMessage] });
        player.player.energy -= 2;
        await player.save();
} catch (err) {
    console.log(err);
} }
        
    });
    }
    catch (error) {
        console.log(err);

};
        }
    },

info: {
    names: ['idlefish'],
}
    }