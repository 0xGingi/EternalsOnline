const PLAYER = require('../../modules/player.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const Discord = require('discord.js');
const { prefix } = require('../../App/config.json');
const cookConfig = require('../../config/cook.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
const {client} = require('../../App/index.js');
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
    let response = ``;
    let response2 = ``;
    let response3 = ``;
    let response4 = ``;
    let response5 = ``;
    let response6 = ``;
    let response7 = ``;
    let response8 = ``;
    let response9 = ``;


    // Find the player
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

    let player = await PLAYER.findOne({ userId: user.id }).exec();
        if (!player) {
            message.reply("You are not a player yet.");
            return;
        }
    
        var statsEmbed = new EmbedBuilder()
        .setColor('#fc9803')
        .setTitle(`Skills`)
        .setTimestamp();

        if (args[0] === 'inv') {

            player.player.stuff.fish.forEach(fish => {
                if (fish.amount > 0) {
                    response += (`${fish.name}: ${fish.amount}\n`);
                }
            });
            player.player.stuff.food.forEach(food => {
                if (food.amount > 0) {
                    const foodConfigItem = cookConfig.find(item => item.name === food.name);
                    const hpValue = foodConfigItem ? foodConfigItem.hp : 'Unknown HP';
                    response2 += (`${food.name}: ${food.amount} (HP: ${hpValue})\n`);
                }
            });
            player.player.stuff.logs.forEach(logs => {
                if (logs.amount > 0) {
                    response3 += (`${logs.name}: ${logs.amount}\n`);
                }
            });
            player.player.stuff.ore.forEach(ore => {
                if (ore.amount > 0) {
                    response4 += (`${ore.name}: ${ore.amount}\n`);
                }
            });
            player.player.stuff.bars.forEach(bars => {
                if (bars.amount > 0) {
                    response5 += (`${bars.name}: ${bars.amount}\n`);
                }
            });
            player.player.stuff.gem.forEach(gem => {
                if (gem.amount > 0) {
                    response6 += (`${gem.name}: ${gem.amount}\n`);
                }
            });
            player.player.stuff.seeds.forEach(seed => {
                if (seed.amount > 0) {
                    response7 += (`${seed.name}: ${seed.amount}\n`);
                }
            });
            player.player.stuff.crops.forEach(crop => {
                if (crop.amount > 0) {
                    response8 += (`${crop.name}: ${crop.amount}\n`);
                }
            });
            player.player.stuff.potions.forEach(potion => {
                if (potion.amount > 0) {
                    response9 += (`${potion.name}: ${potion.amount}\n`);
                }
            });


        
        statsEmbed.addFields(
            { name: `${EMOJICONFIG.fish22} **Fish** :`, value: `${inlineCode(response)}` , inline: true },
            { name: `${EMOJICONFIG.cookedmeat} **Food** :`, value: `${inlineCode(response2)}`, inline: true },
            { name: `${EMOJICONFIG.wood2} **Logs** :`, value: `${inlineCode(response3)}`, inline: true },
            { name: `${EMOJICONFIG.ore} **Ore** :`,  value: `${inlineCode(response4)}`, inline: true },
            { name: `${EMOJICONFIG.hammer2} **Bars** :`, value: `${inlineCode(response5)}`, inline: true },
            { name: `${EMOJICONFIG.totem} **Totems** :`, value: `${inlineCode(response6)}`, inline: true },
            { name: `${EMOJICONFIG.flower1} **Seeds** :`, value: `${inlineCode(response7)}`, inline: true },
            { name: `${EMOJICONFIG.sunflower1} **Crops** :`, value: `${inlineCode(response8)}`, inline: true },
            { name: `${EMOJICONFIG.mana3} **Potions** :`, value: `${inlineCode(response9)}`, inline: true },
        );
    } else {
        //let xpToNextLevel = currentLevel === 120 ? 0 : xpToLevel(currentLevel + 1) - xpToLevel(currentLevel);
        statsEmbed.addFields(
            { name: `${EMOJICONFIG.fish22} **Fishing** :`, value: `${inlineCode('Level: ' + player.player.fishing.level.toString())}\n${inlineCode('XP: ' + player.player.fishing.xp.toString())}\n${inlineCode('XP to next level: ' + (player.player.fishing.level === 120 ? 0 : xpToNextLevel(player.player.fishing.level) - player.player.fishing.xp).toString())}\n${inlineCode('Total XP: ' + player.player.fishing.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.cookedmeat} **Cooking** :`, value: `${inlineCode('Level: ' + player.player.cooking.level.toString())}\n${inlineCode('XP: ' + player.player.cooking.xp.toString())}\n${inlineCode('XP to next level: ' + (player.player.cooking.level === 120 ? 0 : xpToNextLevel(player.player.cooking.level) - player.player.cooking.xp).toString())}\n${inlineCode('Total XP: ' + player.player.cooking.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.wood2} **Woodcutting** :`, value: `${inlineCode('Level: ' + player.player.woodcutting.level.toString())}\n${inlineCode('XP: ' + player.player.woodcutting.xp.toString())}\n${inlineCode('XP to next level: ' + (player.player.woodcutting.level === 120 ? 0 : xpToNextLevel(player.player.woodcutting.level) - player.player.woodcutting.xp).toString())}\n${inlineCode('Total XP: ' + player.player.woodcutting.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.pickaxe2} **Mining** :`, value: `${inlineCode('Level: ' + player.player.mining.level.toString())}\n${inlineCode('XP: ' + player.player.mining.xp.toString())}\n${inlineCode('XP to next level: ' + (player.player.mining.level === 120 ? 0 : xpToNextLevel(player.player.mining.level) - player.player.mining.xp).toString())}\n${inlineCode('Total XP: ' + player.player.mining.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.hammer2} **Smithing** :`, value: `${inlineCode('Level: ' + player.player.smithing.level.toString())}\n${inlineCode('XP: ' + player.player.smithing.xp.toString())}\n${inlineCode('XP to next level: ' + (player.player.smithing.level === 120 ? 0 : xpToNextLevel(player.player.smithing.level) - player.player.smithing.xp).toString())}\n${inlineCode('Total XP: ' + player.player.smithing.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.orb} **Magic** :`, value: `${inlineCode('Level: ' + player.player.magic.level.toString())}\n${inlineCode('XP: ' + player.player.magic.xp.toString())}\n${inlineCode('XP to next level: ' + (player.player.magic.level === 120 ? 0 : xpToNextLevel(player.player.magic.level) - player.player.magic.xp).toString())}\n${inlineCode('Total XP: ' + player.player.magic.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.totem} **Crafting** :`, value: `${inlineCode('Level: ' + player.player.crafting.level.toString())}\n${inlineCode('XP: ' + player.player.crafting.xp.toString())}\n${inlineCode('XP to next level: ' + (player.player.crafting.level === 120 ? 0 : xpToNextLevel(player.player.crafting.level) - player.player.crafting.xp).toString())}\n${inlineCode('Total XP: ' + player.player.crafting.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.hellspawn} **Taming** :`, value: `${inlineCode('Level: ' + player.player.taming.level.toString())}\n${inlineCode('XP: ' + player.player.taming.xp.toString())}\n${inlineCode('XP to next level: ' + (player.player.taming.level === 120 ? 0 : xpToNextLevel(player.player.taming.level) - player.player.taming.xp).toString())}\n${inlineCode('Total XP: ' + player.player.taming.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.boots2} **Agility** :`, value: `${inlineCode('Level: ' + player.player.agility.level.toString())}\n${inlineCode('XP: ' + player.player.agility.xp.toString())}\n${inlineCode('XP to next level: ' + (player.player.agility.level === 120 ? 0 : xpToNextLevel(player.player.agility.level) - player.player.agility.xp).toString())}\n${inlineCode('Total XP: ' + player.player.agility.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.necromancy} **Slayer** :`, value: `${inlineCode('Level: ' + player.player.slayer.level.toString())}\n${inlineCode('XP: ' + player.player.slayer.xp.toString())}\n${inlineCode('XP to next level: ' + (player.player.slayer.level === 120 ? 0 : xpToNextLevel(player.player.slayer.level) - player.player.slayer.xp).toString())}\n${inlineCode('Total XP: ' + player.player.slayer.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.hoe2} **Farming** :`, value: `${inlineCode('Level: ' + player.player.farming.level.toString())}\n${inlineCode('XP: ' + player.player.farming.xp.toString())}\n${inlineCode('XP to next level: ' + (player.player.farming.level === 120 ? 0 : xpToNextLevel(player.player.farming.level) - player.player.farming.xp).toString())}\n${inlineCode('Total XP: ' + player.player.farming.totalxp.toString())}`, inline: true },
        )
    }
        message.channel.send({embeds: [statsEmbed]});

        

    }
    
catch (err) {

    console.log(err);
}

};

},
info: {

    names: ['skills', 'skill'],

}
}