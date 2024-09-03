const PLAYER = require('../../modules/player.js');
const ORE = require('../../config/mine.json');
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


    try {

        let player = await PLAYER.findOne({ userId: user.id }).exec();
        if (!player) {
            message.reply("You are not a player yet.");
            return;
        }
        if (player.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)

        const currentArea = player.player.other.area;
        const eligibleOre = ORE.filter(ore => player.player.mining.level >= ore.level && ore.area.includes(currentArea));
        if (eligibleOre.length === 0){
            message.reply("No mining nodes are eligible for your current mining level in this area. Try going to another area.");
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
      //  player.player.cooldowns = player.player.cooldowns || {};
        player.player.cooldowns.skilling = {
            timestamp: new Date().getTime(),
            duration: shuffleTime
        };
        await player.save();

        let countdown = 20 * 60;
        message.reply(`You started ${EMOJICONFIG.pickaxe2} Mining. Please wait 20 Minutes...`).then(msg => {
            let countdownInterval = setInterval(() => {
            countdown--;
                 if (countdown === 0) {

                    clearInterval(countdownInterval);
                    performFishing();
                 } }, 1000);


        // Save the player
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
            const eligibleOre = ORE.filter(ore => player.player.mining.level >= ore.level && ore.area.includes(currentArea));
            if (eligibleOre.length === 0){
                message.reply("No mining nodes are eligible for your current mining level in this area. Try going to another area.");
                return;
            }

            const numOreTypes = Math.floor(Math.random() * 4) + 2;
            const selectedOre = [];
            for (let i = 0; i < numOreTypes; i++) {
                const ore = eligibleOre[Math.floor(Math.random() * eligibleOre.length)];
                selectedOre.push(ore);
            }

            let fishingMessage = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${EMOJICONFIG.pickaxe2} Idle Mining Results`);
            
            let fields = [];
            let totalXP = 0;
            let fishCaughtMessage = '';
            for (const ore of selectedOre) {
            let oreCaught = Math.floor(Math.random() * 120) + 1;
            if (ore.id === 3) {
                oreCaught *= 5;
            }            
            let playerFish = player.player.stuff.ore.find(f => f.name === ore.name);
            if (player.player.other.ironman === true) {
                playerFish = Math.floor(playerFish * 1.2);
            }
            
            if (!playerFish) {
                player.player.stuff.ore.push({
                    id: ore.id,
                    name: ore.name,
                    amount: oreCaught
                });
            } else {
                playerFish.amount += oreCaught;
            }



            let oreXP = Math.abs(Math.floor(ore.xp * oreCaught));
            if (player.player.other.ironman === true) {
                oreXP = Math.floor(oreXP * 1.2);
            }
            
            player.player.mining.xp += oreXP;
            player.player.mining.totalxp += oreXP;

            totalXP += oreXP;
            fishCaughtMessage += `${EMOJICONFIG.ore} ${oreCaught} ${ore.name}\n`;
        }
        fields.push({ name: `You mined`, value: fishCaughtMessage });
                const party = await Party.findOne({ member: { $elemMatch: { id: message.author.id } } });
                let sharedXpPercentage = 0;
                let inparty = false;
            if (party && party.member.length > 1) {
                inparty = true;
            const additionalXPPerMember = Math.floor(totalXP * 0.02);
            const totalAdditionalXP = Math.min(additionalXPPerMember * party.member.length, Math.floor(totalXP * 0.10));
             sharedXpPercentage = (totalAdditionalXP / totalXP) * 100;
           //     for (const member of party.member) {
                    let promises = party.member.map(async member => {
                    if (member.id === message.author.id) Promise.resolve();
                    let memberBalance = await PLAYER.findOne({ userId: member.id });
                    if (memberBalance) {
                    memberBalance.player.mining.xp += totalAdditionalXP;
                    memberBalance.player.mining.totalxp += totalAdditionalXP;
                /*
                    let xpNeeded = xpToNextLevel(memberBalance.player.mining.level);
                    let initialLevel = memberBalance.player.mining.level;
                    while (memberBalance.player.mining.xp >= xpNeeded) {
                        if (memberBalance.player.mining.level < 99) {
                            memberBalance.player.mining.level += 1;
                            memberBalance.player.mining.xp -= xpNeeded;
                            xpNeeded = xpToNextLevel(memberBalance.player.mining.level);

                
                        }
                    }    
                    if (memberBalance.player.mining.level > initialLevel) {
                    const logChannel = client.channels.cache.get('1169491579774443660');
                    var now = new Date();
                    var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                    var messageEmbed = new EmbedBuilder()
                    .setColor('#D5EB0D')
                    .setTitle(`Log ${date}`)
                    .setDescription(`${EMOJICONFIG.pickaxe2} ${inlineCode(member.pseudo)} is now mining level **${memberBalance.player.mining.level}**!`);
                    logChannel.send({embeds: [messageEmbed], ephemeral: true });
                    }

            */
                 await memberBalance.save();
            }
        });
        await Promise.all(promises);

     //   }
    }

    fields.push({ name: `Total XP Gained`, value: `${totalXP} XP!` });

            let xpNeeded = xpToNextLevel(player.player.mining.level);
            if (player.player.mining.xp >= xpNeeded) {
                if (player.player.mining.level >= 120) {
                }
                else if (player.player.mining.level <= 120) {

                    while (player.player.mining.xp >= xpToNextLevel(player.player.mining.level)) {
                        player.player.mining.level += 1;
                        let xpNeeded = xpToNextLevel(player.player.mining.level - 1);
                        if (player.player.mining.xp >= xpNeeded) {
                            player.player.mining.xp -= xpNeeded;
                        } else {
                            player.player.mining.xp = 0;
                        }
                    }                    
                    fields.push({ name: `Congratulations! You leveled up!`, value: `Your new level is ${player.player.mining.level}.\n`});
                if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});

            const logChannel = client.channels.cache.get('1169491579774443660');
            var now = new Date();
            var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            var messageEmbed = new EmbedBuilder()
            .setColor('#D5EB0D')
            .setTitle(`Log ${date}`)
            .setDescription(`${EMOJICONFIG.pickaxe2} ${inlineCode(user.username)} is now mining level **${player.player.mining.level}**!`);
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
    names: ['idlemine'],
}
    }