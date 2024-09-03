const Discord = require('discord.js');
const BALANCEDATA = require('../../modules/economie.js');
const SQUADDATA = require('../../modules/squad.js')
const PLAYERDATA = require('../../modules/player.js');
const { numStr } = require('../../functionNumber/functionNbr.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const emo = require('../../config/emoji.json');
const EMOJICONFIG = require('../../config/emoji.json');
const { get } = require('mongoose');

// Config Cooldown :
const shuffleTime = 1.08e+7;
var cooldownPlayers = new Discord.Collection();
module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName, mentionedUser) {
		if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {

    
    var user = message.author
    var userInput = mentionedUser
    if (!userInput) return message.reply(`${EMOJICONFIG.no} Please mention a user to fight with !`);
    let wager = args[1];
    if (!wager || isNaN(wager)) wager = 0;
    if (wager < 0) wager = 0;
    const wagerAmount = Number(wager);
    
        
    if (user === userInput) return message.reply(`${EMOJICONFIG.no} You can't fight yourself, well I mean technically you can, but... no...`);

    // === Try if player are real ===
    function userReal(userInput){
        try {
            var test = userInput.id
            return true
        } catch {
            return false
        }
    };

    // === Add Xp for his squad ===
    function addSquadXp(squad, xpUserEarn){
        if (!squad) return
        else {
            squad.squadXp += Math.floor(xpUserEarn * 0.15)
            squad.save()
        }
    };
    function getActivePetDetails(pets, activePetId) {
        return pets.find(pet => pet.id === activePetId);
    
    }    

    function getActivePetAttack(pets, activePetId) {
        const pet = pets.find(p => p.id === activePetId);
        return pet ? pet.attack : null;
    }
    
    function getActivePetDefense(pets, activePetId) {
        const pet = pets.find(p => p.id === activePetId);
        return pet ? pet.defense : null;
    }
    
    function getActivePetHealth(pets, activePetId) {
        const pet = pets.find(p => p.id === activePetId);
        return pet ? pet.health : null;
    }

    if(userReal(userInput)){

        // === Player 1 : DataBase ===
        let playerOne = await PLAYERDATA.findOne({ userId: message.author.id });
        if (wager > 0 && playerOne.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You are an ironman, you can't bet on a pet battle!`);
        if (!playerOne) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
        if (playerOne.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)

        else {

            // === Balance Player 1 : DataBase ===
            let balance = await BALANCEDATA.findOne({ userId: message.author.id });
            if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
            else {
            if (balance.eco.coins < wagerAmount) return message.reply(`${EMOJICONFIG.no} You don't have enough coins for the wager`);
                            // === Balance Player 1 : DataBase ===
            let balanceTwo = await BALANCEDATA.findOne({ userId: userInput.id });
            if (!balanceTwo || balanceTwo.eco.coins < wagerAmount) return message.reply(`${EMOJICONFIG.no} The user mentioned doesn't have enough coins for the wager`);
            else {


                // === Player 2 : DataBase ===
                let playerTwo = await PLAYERDATA.findOne({ userId: userInput.id });
                if (!playerTwo) return message.reply(`${EMOJICONFIG.no} the user mentioned is not a player...`);
                if (wager > 0 && playerTwo.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} This player is an ironman, and can't bet on a pet battle!`);
                if (playerTwo.player.activePet.id == -1) return message.reply(`${EMOJICONFIG.no} the user mentioned doesn't have a active pet selected...`);
                else {
                    let pets = playerOne.player.pets;
                    let pets2 = playerTwo.player.pets;
                    
                    let activePetDetails = getActivePetDetails(playerOne.player.pets, playerOne.player.activePet.id);
                    let activePetDetails2 = getActivePetDetails(playerTwo.player.pets, playerTwo.player.activePet.id);
                    const attack1 = getActivePetAttack(pets, playerOne.player.activePet.id);
                    const defense1 = getActivePetDefense(pets, playerOne.player.activePet.id);
                    const health1 = getActivePetHealth(pets, playerOne.player.activePet.id);
                    
                    const attack2 = getActivePetAttack(pets2, playerTwo.player.activePet.id);
                    const defense2 = getActivePetDefense(pets2, playerTwo.player.activePet.id);
                    const health2 = getActivePetHealth(pets2, playerTwo.player.activePet.id);


                    function battle(MAXATK_PLAYERONE, MAXATK_PLAYERTWO, HEALTH_PLAYERONE, HEALTH_PLAYERTWO, DEFENSE_PLAYERONE, DEFENSE_PLAYERTWO){
                        var NB_ATTACK_PLAYERONE = 0
                        var NB_ATTACK_PLAYERTWO = 0
                        var ATK_SOMME_PLAYERONE = 0
                        var ATK_SOMME_PLAYERTWO = 0
        
                        while(HEALTH_PLAYERONE != 0 || HEALTH_PLAYERTWO != 0){
                            // ========= Player 1 Fight =========
                            var attackDamagePLayerOne = Math.floor(Math.random() * MAXATK_PLAYERONE) + 1 - (DEFENSE_PLAYERTWO * 0.5);
                            attackDamagePLayerOne = isNaN(attackDamagePLayerOne) ? 0 : attackDamagePLayerOne;
                            attackDamagePLayerOne = attackDamagePLayerOne < 0 ? 0 : attackDamagePLayerOne;
    
                            NB_ATTACK_PLAYERONE += + 1
                            ATK_SOMME_PLAYERONE += attackDamagePLayerOne
                            
                            HEALTH_PLAYERTWO -= attackDamagePLayerOne;
                            
                            // ========= Player 2 Fight =========
                            var attackDamagePLayerTwo = Math.floor(Math.random() * MAXATK_PLAYERTWO) + 1 - (DEFENSE_PLAYERONE * 0.5);
                            attackDamagePLayerTwo = isNaN(attackDamagePLayerTwo) ? 0 : attackDamagePLayerTwo;
                            attackDamagePLayerTwo = attackDamagePLayerTwo < 0 ? 0 : attackDamagePLayerTwo;

                            NB_ATTACK_PLAYERTWO += 1;
                            ATK_SOMME_PLAYERTWO += attackDamagePLayerTwo;

                            HEALTH_PLAYERONE -= attackDamagePLayerTwo;

                            function eloAdd(){
                                if(typeof playerOne.player.petelo !== 'number' || typeof playerTwo.player.petelo !== 'number'){
                                    return 0;
                                }
                                if(playerOne.player.petelo >= playerTwo.player.petelo){
                                    return Math.floor(Math.random() * 30) + 16;
                                } else {
                                    return Math.floor(Math.random() * 16) + 2;
                                }
                            };
        
                            

                            if (HEALTH_PLAYERONE <= 0){
                                // =================================
                                // ======== PLAYER ONE LOSE ========
                                var eloLoseVar = eloAdd()
                                playerOne.player.petelo -= eloLoseVar
                                playerTwo.player.petelo += eloLoseVar

                                const expAwarded = Math.floor(Math.random() * 350) + 1;
                                activePetDetails2.experience += expAwarded;
                        
                                // Check for level up
                                let xpNeeded = xpToLevel(activePetDetails2.level + 1);
                                let initialLevel = activePetDetails2.level;
                                while (activePetDetails2.experience >= xpNeeded) {
                                    activePetDetails2.level++;
                                    activePetDetails2.attack += 10;
                                    activePetDetails2.health += 100;
                                    activePetDetails2.defense += 10;
                                    activePetDetails2.experience -= xpNeeded;
                                    xpNeeded = xpToLevel(activePetDetails2.level + 1);
                                }
                        
                                
                                playerOne.player.energy -= 2;
                                playerOne.save();
                                playerTwo.save();
                                balance.eco.coins -= wagerAmount;
                                balanceTwo.eco.coins += wagerAmount;
                                balance.save();
                                balanceTwo.save();
                                // == Embed LOSE : ==
                                var battleEmbed = new EmbedBuilder()
                                    .setColor('#000000')
                                    .setTitle(`${user.username}'s Battle`)
                                    .setDescription(`${EMOJICONFIG.hellspawn} : ${user.username} ${inlineCode("VS")} ${playerTwo.pseudo}\n`)
                                    .addFields(
                                    { name: `**${emo.helmet} ${playerOne.player.activePet.name.toUpperCase()} :**\n`, value: `**Attack** : ${attack1}\n**Defense** : ${defense1}\n**Health** : ${health1}\n`, inline: true },
                                    { name: `**${emo.hat7} ${playerTwo.player.activePet.name.toUpperCase()} :**\n`, value: `**Attack** : ${attack2}\n**Defense** : ${defense2}\n**Health** : ${health2}\n `, inline: true },
                                    { name: `**${emo.paper} STATS :**\n`, value: `${user.username}'s ${activePetDetails.name} attacked **${NB_ATTACK_PLAYERONE} times** and did **${ATK_SOMME_PLAYERONE}** damage to ${playerTwo.pseudo}'s ${activePetDetails2.name}\n${playerTwo.pseudo}'s ${activePetDetails2.name} attacked **${NB_ATTACK_PLAYERTWO} times** and did **${ATK_SOMME_PLAYERTWO}** damage to ${user.username}'s ${activePetDetails.name}\n\n**${EMOJICONFIG.attack6} ${playerTwo.pseudo} WINS!**\n and gains ${inlineCode('+' +  numStr(eloLoseVar))} ELO & ${emo.coin} ${wagerAmount} from ${user.username}\n**Experience Awarded:** ${expAwarded}\n${initialLevel < activePetDetails.level ? `**Level Up!** ${playerTwo.player.activePet.name} is now level ${activePetDetails.level}` : ''}`, inline: false },
                                    )
                                    .setTimestamp();
                                return battleEmbed
                            };
                            if (HEALTH_PLAYERTWO <= 0){
                                // ======================================
                                // =========== PLAYER ONE WIN ===========
                                var eloAddVar = eloAdd()
                                playerOne.player.petelo += eloAddVar
                                playerTwo.player.petelo += eloAddVar

                                const expAwarded = Math.floor(Math.random() * 350) + 1;
                                activePetDetails.experience += expAwarded;
                        
                                // Check for level up
                                let xpNeeded = xpToLevel(activePetDetails.level + 1);
                                let initialLevel = activePetDetails.level;
                                while (activePetDetails.experience >= xpNeeded) {
                                    activePetDetails.level++;
                                    activePetDetails.attack += 10;
                                    activePetDetails.health += 100;
                                    activePetDetails.defense += 10;
                                    activePetDetails.experience -= xpNeeded;
                                    xpNeeded = xpToLevel(activePetDetails.level + 1);
                                }

                                playerOne.player.energy -= 2;
                                playerOne.save();
                                balance.eco.coins += wagerAmount;
                                balanceTwo.eco.coins -= wagerAmount;
                                balance.save();
                                balanceTwo.save();
        
                                // == Embed WIN : ==
                                var battleEmbed = new EmbedBuilder()
                                    .setColor('#000000')
                                    .setTitle(`${user.username}'s Battle`)
                                    .setDescription(`${EMOJICONFIG.hellspawn} : ${user.username} ${inlineCode("VS")} ${playerTwo.pseudo}\n`)
                                    .addFields(
                                        { name: `**${emo.helmet} ${playerOne.player.activePet.name.toUpperCase()} :**\n`, value: `**Attack** : ${attack1}\n**Defense** : ${defense1}\n**Health** : ${health1}\n`, inline: true },
                                        { name: `**${emo.hat7} ${playerTwo.player.activePet.name.toUpperCase()} :**\n`, value: `**Attack** : ${attack2}\n**Defense** : ${defense2}\n**Health** : ${health2}\n `, inline: true },
                                        { name: `**${emo.paper} STATS :**\n`, value: `${user.username}'s ${activePetDetails.name} attacked **${NB_ATTACK_PLAYERONE} times** and did **${ATK_SOMME_PLAYERONE}** damage to ${playerTwo.pseudo}'s ${activePetDetails2.name}\n${playerTwo.pseudo}'s ${activePetDetails2.name} attacked **${NB_ATTACK_PLAYERTWO} times** and did **${ATK_SOMME_PLAYERTWO}** damage to ${user.username}'s ${activePetDetails.name}\n\n**${EMOJICONFIG.attack6} ${user.username} WINS !**\n and gains ${inlineCode('+' + numStr(eloAddVar))} ELO & ${emo.coin} ${wagerAmount} from ${playerTwo.pseudo}\n**Experience Awarded:** ${expAwarded}\n${initialLevel < activePetDetails.level ? `**Level Up!** ${playerOne.player.activePet.name} is now level ${activePetDetails.level}` : ''}`, inline: false },
                                    )
                                    .setTimestamp();
                                return battleEmbed
                            };
                        };
                    };

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('yes')
                                .setLabel(`Accept Duel`)
                                .setEmoji(`${EMOJICONFIG.yes}`)
                                .setStyle(ButtonStyle.Success),
                            
                            new ButtonBuilder()
                                .setCustomId('no')
                                .setLabel(`Decline Duel`)
                                .setEmoji(`${EMOJICONFIG.no}`)
                                .setStyle(ButtonStyle.Danger),
                        );
        
                    const embedMessage = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle(`${user.username} VS ${playerTwo.pseudo} ${emo.coin} ${wagerAmount}`)
                        .addFields(
                            { name: `**${emo.helmet} ${activePetDetails.name.toUpperCase()} :**\n`, value: `${emo.attack6}: ${attack1}\n${emo.shield2}: ${defense1}\n${emo.heart}: ${health1}`, inline: true},
                            { name: `**${emo.hat7} ${playerTwo.player.activePet.name.toUpperCase()} :**\n`, value: `${emo.attack6}: ${attack2}\n${emo.shield2}: ${defense2}\n${emo.heart}: ${health2}`, inline: true},
                        )
                        .setTimestamp()
        
                    const msg = await message.reply({ embeds: [embedMessage], components: [row] });
        
                    const collector = msg.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        time: 30_000,
                    });
                    
                    collector.on('collect', async interaction => {
                        if (interaction.user.id !== userInput.id) {
                            return interaction.reply({ content: 'You are not the one being challenged.', ephemeral: true });
                        }
                        if (interaction.customId == 'yes') {
                            if(interaction.user.id === userInput.id) {
        
                        // ================ AD SQUAD XP ================
                        squad = await SQUADDATA.findOne({ squadName: playerOne.player.other.squadName })
    
                        var randomxp = Math.floor(Math.random() * (playerOne.player.health / 60)) + 1;
                        addSquadXp(squad, randomxp)
    
                        // ================= LEVEL CONFIG =================
                        if (!interaction.replied) {
                        await interaction.reply({ embeds:[battle(attack1 , attack2, health1, health2, defense1, defense2)], ephemeral: false });
                        }
                        collector.stop();
                            }else 
                            {
                                if (!interaction.replied) {
                                await interaction.reply({ content: 'You are not the one being challenged.', ephemeral: true });
                            }
                        }
                        };
                        
                        if(interaction.customId === 'no') {
                            if(interaction.user.id === userInput.id) {
                                if (!interaction.replied) {
                            await interaction.reply('You declined the pet battle');
                        } }
                        collector.stop();
                    } else {
                        if (!interaction.replied) {
                        await interaction.reply({ content: 'You are not the one being challenged.', ephemeral: true });
                        }
                    }
                });
                };
            };
               }       };
        } else return message.reply(`${EMOJICONFIG.no} player undefined : ${inlineCode("@Eternals pet battle <@user>")}`);
}; 
}, 
info: {
  names: ['petbattle'],
} }
function xpToLevel(level) {
    let total = 0;
    for (let l = 1; l < level; l++) {
        total += Math.floor(l + 300 * Math.pow(2, l / 7.0));
    }
    return Math.floor(total / 4);
}