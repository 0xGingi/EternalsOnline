const PLAYER = require('../../modules/player.js');
const ORE = require('../../config/motherload.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { prefix } = require('../../App/config.json')
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const Party = require('../../modules/party.js');
const EMOJICONFIG = require('../../config/emoji.json');
const shuffleTime = 8.64e7;
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


    try {

        let player = await PLAYER.findOne({ userId: user.id }).exec();
        if (!player) {
            message.reply("You are not a player yet.");
            return;
        }
        if (player.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)

        if (player.player.mining.level < 50) {
            message.reply("You need to be at least mining level 50 to enter the motherload mine");
            return;
        }
    
        if (player.player.cooldowns && player.player.cooldowns.motherload) {
            const timeSinceLastDaily = new Date().getTime() - new Date(player.player.cooldowns.motherload).getTime();
            if (timeSinceLastDaily < shuffleTime) {
                var measuredTime = new Date(null);
                measuredTime.setSeconds(Math.ceil((shuffleTime - timeSinceLastDaily) / 1000));
                var MHSTime = measuredTime.toISOString().substr(11, 8);
                message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                return;
            }
        }


       // let countdown = 3600;
        player.player.cooldowns = player.player.cooldowns || {};
        player.player.cooldowns.motherload = new Date().toISOString();
        player.player.energy -= 2;
        await player.save();

    //    message.reply(`You started ${EMOJICONFIG.pickaxe2} Mining in the Motherload Mine. Please wait 1 Hour...`).then(msg => {
   //         let countdownInterval = setInterval(() => {
  //          countdown--;
   //              if (countdown === 0) {

    //                clearInterval(countdownInterval);
                    performFishing();
     //            } }, 1000);


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
            const eligibleOre = ORE;
            if (eligibleOre.length === 0){
                player.player.isFishing = false;
                await player.save();
                message.reply("No mining nodes are eligible for your current mining level in this area. Try going to another area.");
                return;
            }

            let totalChance = eligibleOre.reduce((total, ore) => total + ore.chance, 0);
            let random = Math.random() * totalChance;
            let sum = 0;
            let selectedOres = [];

            while (selectedOres.length < 2) {
                let random = Math.random() * totalChance;
                for (const ore of eligibleOre) {
                    random -= ore.chance;
                    if (random < 0 && !selectedOres.includes(ore)) {
                        selectedOres.push(ore);
                        break;
                    }
                }
            }            let fishingMessage = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${EMOJICONFIG.pickaxe2} Motherload Mining Results`);
            
            let fields = [];
            let totalXP = 0;
            let fishCaughtMessage = '';
            for (const selectedOre of selectedOres) {
            const oreCaught = Math.floor(Math.random() * 2000) + 500;
            const playerFish = player.player.stuff.ore.find(f => f.name === selectedOre.name);
            
            if (!playerFish) {
                player.player.stuff.ore.push({
                    id: selectedOre.id,
                    name: selectedOre.name,
                    amount: oreCaught
                });
            } else {
                playerFish.amount += oreCaught;
            }



            const oreXP = Math.abs(Math.floor(selectedOre.xp * oreCaught));
            player.player.mining.xp += oreXP;
            player.player.mining.totalxp += oreXP;

            totalXP += oreXP;
            fishCaughtMessage += `${EMOJICONFIG.ore} ${oreCaught} ${selectedOre.name}\n`;
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

   //     }
    }

    fields.push({ name: `Total XP Gained`, value: `${totalXP} XP!` });

            let xpNeeded = xpToNextLevel(player.player.mining.level);
            player.player.isFishing = false;
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
    await player.save();
} catch (err) {
    console.log(err);
} }
        
 //   });
    }
    catch (error) {
        console.log(err);

};
        }
    },

info: {
    names: ['mlm', 'motherload', 'motherloadmine', 'motherloadmining', 'motherloadmines', 'motherloadminein'],
}
    }