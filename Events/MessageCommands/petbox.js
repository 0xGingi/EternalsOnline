const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js')
const PETS = require('../../config/pets.json')
const BALANCEDATA = require('../../modules/economie.js')
const STATS = require('../../modules/statsBot.js')
const { inlineCode } = require('@discordjs/builders')
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');


module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName) {
         if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
      
    var user = message.author
    let stats = await STATS.findOne({ botID: 899 });

    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
    else {

        let balance = await BALANCEDATA.findOne({ userId: user.id });
        if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
        else {
            if (playerStats.player.other.petbox == 0) return message.reply(`${EMOJICONFIG.no} You don't have any pet boxes to open`);
            else {
                async function randomitem(){
                    if (playerStats.player.pets.length >= PETS.length) return message.reply(`${EMOJICONFIG.no} You have all the pets! Please wait for more to be added!`);
                    let pet;
                    do {
                        const randomPetIndex = Math.floor(Math.random() * PETS.length);
                        pet = PETS[randomPetIndex];
                    } while (playerStats.player.pets.some(existingPet => existingPet.id === pet.id));
                
                    const newPet = {
                        id: pet.id,
                        name: pet.name,
                        level: 1,
                        experience: 0,
                        nickname: "",
                        attack: pet.attack,
                        defense: pet.defense,
                        health: pet.health,
                    };
                
                    playerStats.player.pets.push(newPet);
                    playerStats.player.other.petbox -= 1;
                    await playerStats.save();
                    return { 
                        error: false,
                        nname:  `${EMOJICONFIG.hellspawn} **NEW PET** : **${inlineCode(newPet.name)}** - You now have a new pet!.`,
                        nid: newPet.id
                    };
                }
                
                async function openAllBoxes() {
                    if(playerStats.player.other.petbox > 0){
                        let boxesOpened = 0;
                        let petsFound = [];
                        while (playerStats.player.other.petbox > 0) {
                            var result = await randomitem();
                            if (result.error) {
                                return message.reply(result.message);
                            }
                            boxesOpened++;
                            petsFound.push(result.nname);
                        }
                        await playerStats.save();
                        var petEmbed = new EmbedBuilder()
                        .setColor('#6d4534')
                        .setTitle(`${EMOJICONFIG.hellspawn} ${user.username}'s New Pets`)
                        .setDescription(`${EMOJICONFIG.yes} **All pet boxes opened!**\n${petsFound.join('\n')}`)
                        .setTimestamp();
                        return message.reply({ embeds: [petEmbed] });
                    } else {
                        return message.reply(`${EMOJICONFIG.no} You don't have any boxes to open`);
                    }
                }
            
            if (args[0] && args[0].toLowerCase() === 'all') {
                return openAllBoxes();
            } else {
                var result = await randomitem();
                if (result.error) {
                    return message.reply(result.message);
                }                
                var nid = result.nid;
                var itemEmbed = new EmbedBuilder()
                    .setColor('#6d4534')
                    .setTitle(`${EMOJICONFIG.hellspawn} ${user.username}'s New Pet(s)`)
                    .setDescription(`${EMOJICONFIG.yes} **Pet Box open!**\n${result.nname}`)
                    .setTimestamp()
                return message.reply({ embeds: [itemEmbed]})
            }
            
        
      } 
     } } 
}
        },
info: {
    names: ['openpetbox'],
}
}
