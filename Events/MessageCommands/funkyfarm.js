const PLAYER = require('../../modules/player.js');
const ORE = require('../../config/funkyfarmseeds.json');
const ORE2 = require('../../config/funkyfarmcrops.json');
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
        if (player.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@FlipMMO energy')}`)

        if (player.player.farming.level < 50) {
            message.reply("You need to be at least farming level 50 to start a funky farm");
            return;
        }
    
        if (player.player.cooldowns && player.player.cooldowns.funkyfarm) {
            const timeSinceLastDaily = new Date().getTime() - new Date(player.player.cooldowns.funkyfarm).getTime();
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
        player.player.cooldowns.funkyfarm = new Date().toISOString();
        player.player.energy -= 2;
        await player.save();
        const random = Math.random();
           if (random <= 0.3) {
               return message.reply(`You attempted to start a funky farm, but the Adventure's guild was tipped off and burned it all, You can try again another day...`);
           }
   
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
    
            const player = await PLAYER.findOne({ userId: user.id });  
            const eligibleOre = ORE;
            const eligibleOre2 = ORE2;
            if (eligibleOre.length === 0){
                player.player.isFishing = false;
                await player.save();
                message.reply("No funky farm stuff is eligible for your current farming level in this area. Try going to another area.");
                return;
            }
            if (eligibleOre2.length === 0){
                player.player.isFishing = false;
                await player.save();
                message.reply("No funky farm stuff is eligible for your current farming level in this area. Try going to another area.");
                return;
            }        
            console.log("check1");
            let totalChance = eligibleOre.reduce((total, ore) => total + ore.chance, 0);
            let totalChance2 = eligibleOre2.reduce((total, ore) => total + ore.chance, 0);
            let random = Math.random() * totalChance;
            let sum = 0;
            let selectedOres = [];
            let selectedOres2 = [];

            while (selectedOres.length < 2) {
                let randomIndex = Math.floor(Math.random() * eligibleOre.length);
                let selectedOre = eligibleOre[randomIndex];
                if (!selectedOres.includes(selectedOre)) {
                    selectedOres.push(selectedOre);
                }
            }    
            
            while (selectedOres2.length < 2) {
                let randomIndex = Math.floor(Math.random() * eligibleOre2.length);
                let selectedOre = eligibleOre2[randomIndex];
                if (!selectedOres2.includes(selectedOre)) {
                    selectedOres2.push(selectedOre);
                }
            }
                
            
            console.log("check2");
            let fishingMessage = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${EMOJICONFIG.hoe2} Funky Farms Results`);
            
            let fields = [];
            let totalXP = 0;
            let fishCaughtMessage = '';
            
        for (const selectedOre of selectedOres) {
            const oreCaught = Math.floor(Math.random() * 200) + 100;
            const playerFish = player.player.stuff.seeds.find(f => f.name === selectedOre.name);
            
            if (!playerFish) {
                player.player.stuff.seeds.push({
                    id: selectedOre.id,
                    name: selectedOre.name,
                    amount: oreCaught
                });
            } else {
                playerFish.amount += oreCaught;
            }

            const oreXP = Math.abs(Math.floor(selectedOre.xp * oreCaught));
            player.player.farming.xp += oreXP;
            player.player.farming.totalxp += oreXP;

            totalXP += oreXP;
            fishCaughtMessage += `${EMOJICONFIG.hoe2} ${oreCaught} ${selectedOre.name}\n`;

        }
        console.log("check3");
        for (const selectedOre of selectedOres2) {
            const oreCaught = Math.floor(Math.random() * 200) + 100;
            const playerFish = player.player.stuff.crops.find(f => f.name === selectedOre.name);
            
            if (!playerFish) {
                player.player.stuff.crops.push({
                    id: selectedOre.id,
                    name: selectedOre.name,
                    amount: oreCaught
                });
            } else {
                playerFish.amount += oreCaught;
            }

            const oreXP = selectedOre.xp * oreCaught;
            player.player.farming.xp += oreXP;
            player.player.farming.totalxp += oreXP;

            totalXP += oreXP;
            fishCaughtMessage += `${EMOJICONFIG.sunflower1} ${oreCaught} ${selectedOre.name}\n`;

        }
        

        console.log("check4");


        fields.push({ name: `You farmed`, value: fishCaughtMessage });
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
                    memberBalance.player.farming.xp += totalAdditionalXP;
                    memberBalance.player.farming.totalxp += totalAdditionalXP;
                 await memberBalance.save();
            }
        });
        await Promise.all(promises);

   //     }
    }
    console.log("check5");
    fields.push({ name: `Total XP Gained`, value: `${totalXP} XP!` });

            let xpNeeded = xpToNextLevel(player.player.farming.level);
            player.player.isFishing = false;
            if (player.player.farming.xp >= xpNeeded) {
                if (player.player.farming.level >= 120) {
                }
                else if (player.player.farming.level <= 120) {

                    while (player.player.farming.xp >= xpToNextLevel(player.player.farming.level)) {
                        player.player.farming.level += 1;
                        let xpNeeded = xpToNextLevel(player.player.farming.level - 1);
                        if (player.player.farming.xp >= xpNeeded) {
                            player.player.farming.xp -= xpNeeded;
                        } else {
                            player.player.farming.xp = 0;
                        }
                    }
        
                    fields.push({ name: `Congratulations! You leveled up!`, value: `Your new level is ${player.player.farming.level}.\n`});
                if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});

            const logChannel = client.channels.cache.get('1169491579774443660');
            var now = new Date();
            var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            var messageEmbed = new EmbedBuilder()
            .setColor('#D5EB0D')
            .setTitle(`Log ${date}`)
            .setDescription(`${EMOJICONFIG.hoe2} ${inlineCode(user.username)} is now farming level **${player.player.farming.level}**!`);
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
        
}
    catch (error) {
        console.log(error);

};
        }
    },

info: {
    names: ['funky','funkyfarm', 'ff'],
}
    }