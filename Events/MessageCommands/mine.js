const PLAYER = require('../../modules/player.js');
const ORE = require('../../config/mine.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { prefix } = require('../../App/config.json')
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const Party = require('../../modules/party.js');
const EMOJICONFIG = require('../../config/emoji.json');
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
    let constore = args[0];
    
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

        if (constore && !eligibleOre.some(ore => ore.alias.toLowerCase() === constore.toLowerCase())) {
            message.reply(`You cannot mine ${constore} in your current area.`);
            return;
        }
        
        if (constore && eligibleOre.some(ore => ore.alias.toLowerCase() === constore.toLowerCase() && player.player.mining.level < ore.level)) {
            message.reply(`Your mining level is not high enough to mine ${constore} in your current area.`);
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


     //   let countdown = 30;
     //   message.reply(`You started ${EMOJICONFIG.pickaxe2} Mining. Please wait ${countdown} Seconds...`).then(msg => {
     //       let countdownInterval = setInterval(() => {
     //       countdown--;
     //            if (countdown === 0) {

     //               clearInterval(countdownInterval);
                    performFishing();
      //           } }, 1000);


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
            let ore;
            if (constore){
              ore = eligibleOre.find(ore => ore.alias.toLowerCase() === constore.toLowerCase());
            } else {
             ore = eligibleOre[Math.floor(Math.random() * eligibleOre.length)];
            }
            let oreCaught;
            if (ore.id === 3) {
                oreCaught *= 5;
            }
            if (constore){
                oreCaught = Math.floor(Math.random() * 75) + 1;
            }
            else{
                oreCaught = Math.floor(Math.random() * 25) + 1;
            }

            const playerFish = player.player.stuff.ore.find(f => f.name === ore.name);
            if (!playerFish) {
                player.player.stuff.ore.push({
                    id: ore.id,
                    name: ore.name,
                    amount: oreCaught
                });
            } else {
                playerFish.amount += oreCaught;
            }
            const oreXP = Math.abs(Math.floor(ore.xp * oreCaught));
            player.player.mining.xp += oreXP;
            player.player.mining.totalxp += oreXP;

            let fishingMessage = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${EMOJICONFIG.pickaxe2} Mining Results`);
            let fields = [];
            fields.push({ name: `You mined`, value: `${EMOJICONFIG.ore} ${oreCaught} ${ore.name}`});
            fields.push({ name: `XP Gained`, value: `${oreXP} XP`});


                const party = await Party.findOne({ member: { $elemMatch: { id: message.author.id } } });
                let sharedXpPercentage = 0;
                let inparty = false;
            if (party && party.member.length > 1) {
                inparty = true;
            const additionalXPPerMember = Math.floor(oreXP * 0.02);
            const totalAdditionalXP = Math.min(additionalXPPerMember * party.member.length, Math.floor(oreXP * 0.10));
             sharedXpPercentage = (totalAdditionalXP / oreXP) * 100;
             //   for (const member of party.member) {
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
                        if (memberBalance.player.mining.level < 120) {
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
        
  //  });
    }
    catch (error) {
        console.log(err);

};
        }
    },

info: {
    names: ['mine'],
}
    }