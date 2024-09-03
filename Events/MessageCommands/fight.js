const Discord = require('discord.js');
const BALANCEDATA = require('../../modules/economie.js');
const SQUADDATA = require('../../modules/squad.js')
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { numStr } = require('../../functionNumber/functionNbr.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const {client} = require('../../App/index.js');

// Config Cooldown :
const shuffleTime = 1.08e+7;
var cooldownPlayers = new Discord.Collection();

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
                 
    
    var user = message.author
    var userInput = Array.from(message.mentions.users.values())[1];

    if (userInput === ' ' || userInput === '') return message.reply(`${EMOJICONFIG.no} player undefined : ${inlineCode("@Eternals brawl <@user>")}`);
    if (user === userInput) return message.reply(`${EMOJICONFIG.no} You can't fight yourself, I mean theoretically you could, but...`);

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

    if(userReal(userInput)){

        // === Player 1 : DataBase ===
        let playerOne = await PLAYERDATA.findOne({ userId: message.author.id });
        if (!playerOne) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
        if (playerOne.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)

        else {

            // === Balance Player 1 : DataBase ===
            let balance = await BALANCEDATA.findOne({ userId: message.author.id });
            if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
            else {

                // === Player 2 : DataBase ===
                let playerTwo = await PLAYERDATA.findOne({ userId: userInput.id });
                if (!playerTwo) return message.reply(`${EMOJICONFIG.no} the user mentioned is not a player...`);
                else {

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
                            
                            if (HEALTH_PLAYERONE <= 0){
                                // =================================
                                // ======== PLAYER ONE LOSE ========
                                var losecoin = Math.floor((balance.eco.coins*5)/100)
                                balance.eco.coins -= losecoin
                                playerOne.player.energy -= 2;
                                if(balance.eco.coins <= 0) balance.eco.coins = 0
                                balance.save()
                                playerOne.save()
                                // == Embed LOSE : ==
                                var battleEmbed = new EmbedBuilder()
                                    .setColor('#000000')
                                    .setTitle(`${user.username}'s Battle`)
                                    .setDescription(`:crossed_swords: : ${user.username} vs ${playerTwo.pseudo}\n`)
                                    .addFields(
                                    { name: `**${EMOJICONFIG.helmet} ${user.username} :**\n`, value: `**Attack** : ${playerOne.player.attack}\n**Defense** : ${playerOne.player.defense}\n**Health** : ${playerOne.player.health}\n`, inline: true },
                                    { name: `**${EMOJICONFIG.hat7} ${playerTwo.pseudo.toUpperCase()} :**\n`, value: `**Attack** : ${playerTwo.player.attack}\n**Defense** : ${playerTwo.player.defense}\n**Health** : ${playerTwo.player.health}\n `, inline: true },
                                    { name: `**${EMOJICONFIG.scroll4} STATS :**\n`, value: `You attacked **${NB_ATTACK_PLAYERONE} times** and did **${ATK_SOMME_PLAYERONE}** damage to ${playerTwo.pseudo}\n${playerTwo.pseudo} attacked **${NB_ATTACK_PLAYERTWO} times** and did **${ATK_SOMME_PLAYERTWO}** damage to you\n\n You lose ${inlineCode('-' + numStr(losecoin))} ${EMOJICONFIG.coin} (5% of your coins)`, inline: false },
                                    )
                                    .setTimestamp();
                                return battleEmbed
                            };
                            if (HEALTH_PLAYERTWO <= 0){
                                // ======================================
                                // =========== PLAYER ONE WIN ===========

                                var earnCoins = Math.floor(Math.random((playerOne.player.level * 55)));
                                balance.eco.coins += earnCoins
                                balance.save()
                                playerOne.player.energy -= 2;
                                playerOne.save()
                                // == Embed WIN : ==
                                var battleEmbed = new EmbedBuilder()
                                    .setColor('#000000')
                                    .setTitle(`${user.username}'s Battle`)
                                    .setDescription(`:crossed_swords: : ${user.username} vs ${playerTwo.pseudo}\n`)
                                    .addFields(
                                        { name: `**${EMOJICONFIG.helmet} ${user.username} :**\n`, value: `**Attack** : ${playerOne.player.attack}\n**Defense** : ${playerOne.player.defense}\n**Health** : ${playerOne.player.health}\n`, inline: true },
                                        { name: `**${EMOJICONFIG.hat7} ${playerTwo.pseudo.toUpperCase()} :**\n`, value: `**Attack** : ${playerTwo.player.attack}\n**Defense** : ${playerTwo.player.defense}\n**Health** : ${playerTwo.player.health}\n `, inline: true },
                                        { name: `**${EMOJICONFIG.scroll4} STATS :**\n`, value: `You attacked **${NB_ATTACK_PLAYERONE} times** and did **${ATK_SOMME_PLAYERONE}** damage to ${playerTwo.pseudo}\n${playerTwo.pseudo} attacked **${NB_ATTACK_PLAYERTWO} times** and did **${ATK_SOMME_PLAYERTWO}** damage to you\n\n**YOU WIN** \n${EMOJICONFIG.coinchest} You earn ${inlineCode('+' + numStr(earnCoins))} ${EMOJICONFIG.coin}`, inline: false },
                                    )
                                    .setTimestamp();
                                return battleEmbed
                            };
                        };
                    };
                    // [================ Function Battle End ================]

                    function winPercentage(){
                        var playerA = playerTwo.player.attack
                        var playerH = playerTwo.player.health
                        var playerD = playerTwo.player.defense
        
                        var totalStatsPlayer = playerOne.player.attack * (playerOne.player.health + playerOne.player.defense)
                        var totalStatsMonster = playerA * (playerH + playerD)
        
                        var totalStats = totalStatsPlayer + totalStatsMonster
        
                        var percentageWin = (100 * totalStatsPlayer) / totalStats
        
                        var percentageWin = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setTitle(`🧮 ${user.username}'s Win %`)
                            .setDescription(`📰 ${inlineCode(user.username)} vs ${inlineCode(playerTwo.pseudo)}\n`)
                            .addFields(
                                {name: `${EMOJICONFIG.helmet} Your Stats:`, value:`${EMOJICONFIG.attack}: ${playerOne.player.attack}\n${EMOJICONFIG.shield2}: ${playerOne.player.defense}\n${EMOJICONFIG.heart}: ${playerOne.player.health}`, inline: true},
                                {name: `${EMOJICONFIG.hat7} ${playerTwo.pseudo.toUpperCase()} Stats:`, value:`${EMOJICONFIG.attack}: ${playerA}\n${EMOJICONFIG.shield2}: ${playerD}\n${EMOJICONFIG.heart}: ${playerH}`, inline: true},
                                {name: `📭 Result :`, value:`Your percentage chance of winning is : **${Math.floor(percentageWin)}%**`, inline: false},
                            )
                            .setTimestamp();
                        return percentageWin
                    };

                    // [=========== BUTTON MESSAGE ===========]
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('yes')
                                .setLabel('ATTACK')
                                .setEmoji(`${EMOJICONFIG.yes}`)
                                .setStyle(ButtonStyle.Success),
                            
                            new ButtonBuilder()
                                .setCustomId('no')
                                .setLabel('RUN')
                                .setEmoji(`${EMOJICONFIG.no}`)
                                .setStyle(ButtonStyle.Danger),

                            new ButtonBuilder()
                                .setCustomId('percentage')
                                .setLabel('WIN %')
                                .setStyle(ButtonStyle.Secondary),
                        );
        
                    const embedMessage = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle(`${user.username}'s Battle`)
                        .addFields(
                            { name: `**${EMOJICONFIG.helmet} ${user.username} :**\n`, value: `${EMOJICONFIG.attack}: ${playerOne.player.attack}\n${EMOJICONFIG.shield2}: ${playerOne.player.defense}\n${EMOJICONFIG.heart}: ${playerOne.player.health}`, inline: true},
                            { name: `**${EMOJICONFIG.hat7} ${playerTwo.pseudo.toUpperCase()} :**\n`, value: `${EMOJICONFIG.attack}: ${playerTwo.player.attack}\n${EMOJICONFIG.shield2}: ${playerTwo.player.defense}\n${EMOJICONFIG.heart}: ${playerTwo.player.health}`, inline: true},
                        )
                        .setTimestamp()
        
                    const msg = await message.reply({ embeds: [embedMessage], components: [row] });
        
                    const collector = msg.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        max: 1,
                        time: 15_000
                    });
                    
                    collector.on('collect', async interaction => {
                        if (interaction.customId == 'yes') {
        
                        // ================ AD SQUAD XP ================
                        squad = await SQUADDATA.findOne({ squadName: playerOne.player.other.squadName })
    
                        var randomxp = Math.floor(Math.random() * (playerOne.player.health / 60)) + 1;
                        addSquadXp(squad, randomxp)
    
                        // ================= LEVEL CONFIG =================
                        if(interaction.user.id === message.author.id) await interaction.reply({ embeds:[battle(playerOne.player.attack , playerTwo.player.attack, playerOne.player.health, playerTwo.player.health, playerOne.player.defense, playerTwo.player.defense)], ephemeral: true });
                        else await interaction.reply({ content: 'Its not your turn', ephemeral: true });
                        };

                        if (interaction.customId == 'percentage') {
                            collector.options.max = 2
        
                            await interaction.reply({ embeds: [winPercentage()], ephemeral: true });
                        };

                        if(interaction.customId === 'no') await interaction.reply('You run');
                    });
                };
            };
        };
    } else return message.reply(`${EMOJICONFIG.no} player undefined : ${inlineCode("@Eternals duel <@user>")}`);
};
},

info: {
    names: ['brawl']
}
}
