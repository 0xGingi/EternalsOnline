const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const SQUADDATA = require('../../modules/squad.js')
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { numStr } = require('../../functionNumber/functionNbr.js')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, Collection } = require('discord.js');
const {client} = require('../../App/index.js');

// Config Cooldown :
const shuffleTime = 8.64e7;

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

async execute(message, args, commandName) {
  //  const args = message.content.slice(prefix.length).trim().split(/ +/);
 //   const commandName = args.shift().toLowerCase();
    if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {


    var user = message.author;
    var squadNameAttack = args[0]

    if(squadNameAttack == undefined || squadNameAttack == ' ' || squadNameAttack == '') return message.reply(`${EMOJICONFIG.no} error command, type: ${inlineCode("@Eternals guild attack <guildname>")}`);

    function playerInSquad(playerStats){
        if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are a not player ! : ${inlineCode('@Eternals start')}`);
        else {
            if(playerStats.player.other.squadName != 'undefined') return true
        }
        return false
    };

    // == Player DB ==
    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are a not player ! : ${inlineCode('@Eternals start')}`);

    else {
        if (playerStats.player.cooldowns && playerStats.player.cooldowns.guildAttack) {
            const timeSinceLastDaily = new Date().getTime() - new Date(playerStats.player.cooldowns.guildAttack).getTime();
            if (timeSinceLastDaily < shuffleTime) {
                var measuredTime = new Date(null);
                measuredTime.setSeconds(Math.ceil((shuffleTime - timeSinceLastDaily) / 1000));
                var MHSTime = measuredTime.toISOString().substr(11, 8);
                message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                return;
            }
        }
    
        // == Squad DB ==
        let squadPLayer = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName });
        if (!squadPLayer) return message.reply(`${EMOJICONFIG.no} you are not in a guild...`)
        else {
            
            // == Squad DB ==
            let squadEnemy = await SQUADDATA.findOne({ squadName: squadNameAttack });
            if (!squadEnemy) return message.reply(`${EMOJICONFIG.no} guild is not available...`)
            else {

                if(squadPLayer.squadName == squadEnemy.squadName || squadPLayer.leader[0] == squadEnemy.leader[0]) return message.reply(`${EMOJICONFIG.no} You can't attack your own guild you traitor...`)
                // === Player is in Squad ===
                if(playerInSquad(playerStats)){
                    // === Initialize Player is the leader of the team ===
                    if(playerStats.userId === squadPLayer.leader[0]){
                    

                        var memberLenght
                        if(squadEnemy.member.length == undefined) memberLenght = 0
                        else memberLenght = squadEnemy.member.length

                        function addSquadXp(squad){
                            if(squad){
                                squad.squadXp += Math.floor(Math.random() * 10000) + 1;
                                squad.save()
                            };
                        };

                        function squadBattle(squadPlayerAttack, squadPlayerHealth, squadEnemyAttack, squadEnemyHealth, squadPlayerDefense, squadEnemyDefense){
                            var healthSquadPlayer = squadPlayerHealth
                            var totalDamageSquadPLayer = 0

                            var healthSquadEnemy = squadEnemyHealth
                            var totalDamageSquadEnemy = 0

                            var round = 0

                            while(healthSquadPlayer != 0 || healthSquadEnemy != 0){
                                round += 1

                                // == Squad Player Attack ==
                                var playerDamage = Math.floor(Math.random() * squadPlayerAttack) + 1 - (squadEnemyDefense * 0.5);
                                playerDamage = isNaN(playerDamage) ? 0 : playerDamage;
                                playerDamage = playerDamage < 0 ? 0 : playerDamage;
    

                                healthSquadEnemy -= playerDamage;

                                totalDamageSquadPLayer += playerDamage
                                
                                // == Squad Ennemi Attack ==
                                var ennemiDamage = Math.floor(Math.random() * squadEnemyAttack) + 1 - (squadPlayerDefense * 0.5);
                                ennemiDamage = isNaN(ennemiDamage) ? 0 : ennemiDamage;
                                ennemiDamage = ennemiDamage < 0 ? 0 : ennemiDamage;

                                healthSquadPlayer -= ennemiDamage;

                                totalDamageSquadEnemy += ennemiDamage
                                

                                if(healthSquadPlayer <= 0){
                                    var loseCoin = Math.floor((squadPLayer.squadbank * 5)/100)
                                    var squadBank = squadPLayer.squadbank
                                    addSquadXp(squadPLayer)

                                    if((squadBank -= loseCoin) <= 0) squadPLayer.squadbank = 0
                                    else squadPLayer.squadbank -= loseCoin
                                     SQUADDATA.findOneAndUpdate();

                                     playerStats.player.cooldowns = playerStats.player.cooldowns || {};
                                     playerStats.player.cooldowns.guildAttack = new Date().toISOString();
                                     console.log(playerStats.player.cooldowns.guildAttack);
                                     PLAYERDATA.findOneAndUpdate();


                                    var squadPlayerLose = new EmbedBuilder()
                                        .setColor('#ec2323')
                                        .setTitle(`${EMOJICONFIG.attack} Guild Attack ${inlineCode(squadEnemy.squadName)}`)
                                        .setDescription(`${inlineCode(squadPLayer.squadName)} vs ${inlineCode(squadEnemy.squadName)}`)
                                        .addFields(
                                            { name: `${EMOJICONFIG.helmet} ${inlineCode(squadEnemy.squadName + " Boss")}`, value: `${EMOJICONFIG.attack}: ${squadEnemy.squadboss.bossattack}\n${EMOJICONFIG.shield2}: ${squadEnemy.squadboss.bossdefense}\n${EMOJICONFIG.heart}: ${squadEnemy.squadboss.bosshealth}`, inline: true},
                                            { name: `${EMOJICONFIG.hat7} ${inlineCode("Your Boss")}`, value: `${EMOJICONFIG.attack}: ${squadPLayer.squadboss.bossattack}\n${EMOJICONFIG.shield2}: ${squadPLayer.squadboss.bossdefense}\n${EMOJICONFIG.heart}: ${squadPLayer.squadboss.bosshealth}`, inline: true},
                                            { name: `${EMOJICONFIG.scroll4} STATS :`, value: `You attack ${inlineCode(round)} times and do ${inlineCode(totalDamageSquadPLayer)} damage to the enemy boss.\nThe enemy boss attacks ${inlineCode(round)} times and does ${inlineCode(totalDamageSquadEnemy)} damage to your boss.\n\n**${inlineCode("YOUR GUILD LOSES!")}**\n${EMOJICONFIG.paper} You lose ${numStr(loseCoin)} ${EMOJICONFIG.coin} from your Guild bank`, inline: false},
                                        )
                                        .setTimestamp();
                                    return squadPlayerLose
                                };

                                if(healthSquadEnemy <= 0){
                                    var earnCoin = Math.floor((squadPLayer.squadbank * 5)/100)
                                    addSquadXp(squadEnemy)

                                    squadPLayer.squadbank += earnCoin
                                     squadPLayer.save();

                                     playerStats.player.cooldowns = playerStats.player.cooldowns || {};
                                     playerStats.player.cooldowns.guildAttack = new Date().toISOString();
                                     playerStats.save();
                         

                                    var squadPlayerWin = new EmbedBuilder()
                                        .setColor('#23ec37')
                                        .setTitle(`🗿 Guild Attack ${inlineCode(squadEnemy.squadName)}`)
                                        .setDescription(`${inlineCode(squadPLayer.squadName)} vs ${inlineCode(squadEnemy.squadName)}`)
                                        .addFields(
                                            { name: `${EMOJICONFIG.helmet} ${inlineCode(squadEnemy.squadName + " Boss")}`, value: `${EMOJICONFIG.attack}: ${squadEnemy.squadboss.bossattack}\n${EMOJICONFIG.shield2}: ${squadEnemy.squadboss.bossdefense}\n${EMOJICONFIG.heart}: ${squadEnemy.squadboss.bosshealth}`, inline: true},
                                            { name: `${EMOJICONFIG.hat7} ${inlineCode("Your Boss")}`, value: `${EMOJICONFIG.attack}: ${squadPLayer.squadboss.bossattack}\n${EMOJICONFIG.shield2}: ${squadPLayer.squadboss.bossdefense}\n${EMOJICONFIG.heart}: ${squadPLayer.squadboss.bosshealth}`, inline: true},
                                            { name: `${EMOJICONFIG.scroll4} STATS :`, value: `You attack ${inlineCode(round)} times and do ${inlineCode(totalDamageSquadPLayer)} damage to the enemy boss.\nThe enemy boss attacks ${inlineCode(round)} times and does ${inlineCode(totalDamageSquadEnemy)} damage to your boss.\n\n**${inlineCode("YOUR GUILD WINS!")}**\n${EMOJICONFIG.paper} You earn ${numStr(earnCoin)} ${EMOJICONFIG.coin} to your Guild bank`, inline: false},
                                        )
                                        .setTimestamp();
                                    return squadPlayerWin
                                };
                            };
                        };

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('yes')
                                    .setLabel('ATTACK')
                                    .setEmoji(`${EMOJICONFIG.yes}`)
                                    .setStyle(ButtonStyle.Success),

                                new ButtonBuilder()
                                    .setCustomId('no')
                                    .setLabel("RUN")
                                    .setEmoji(`${EMOJICONFIG.no}`)
                                    .setStyle(ButtonStyle.Danger),
                            );

                        var squadAttackMessage = new EmbedBuilder()
                            .setColor('#2f3136')
                            .setTitle(`${EMOJICONFIG.attack6} Guild Attack ${inlineCode(squadEnemy.squadName)}`)
                            .setDescription(`${EMOJICONFIG.shield2} Name of the Guild to attack : ${inlineCode(squadEnemy.squadName)}\n${EMOJICONFIG.helmet} Leader : ${inlineCode(squadEnemy.leader[1])}\n${EMOJICONFIG.paper} Level : ${inlineCode(Math.floor(squadEnemy.squadXp / 1000))}\n${EMOJICONFIG.scroll4} Member(s) : ${inlineCode(memberLenght)}\n\n${EMOJICONFIG.scroll4} Squad Bosses: ${EMOJICONFIG.attack}: ${inlineCode(squadEnemy.squadboss.bossattack)} **/** ${EMOJICONFIG.heart}: ${inlineCode(squadEnemy.squadboss.bosshealth)}`)
                            .setTimestamp();
                        const msg = await message.reply({embeds: [squadAttackMessage], components: [row]});
                        
                        const collector = msg.createMessageComponentCollector({
                            componentType: ComponentType.Button,
                            max: 1,
                            time: 30_000
                        });

                        collector.on('collect', async interaction => {
                            if (interaction.customId == 'yes') {

                                
                                // ===============================

                                // == Log : ==
                                const logChannel = client.channels.cache.get('1169491579774443660');
                                var now = new Date();
                                var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                                var messageEmbed = new EmbedBuilder()
                                    .setColor('#e1e920')
                                    .setTitle(`Log ${date}`)
                                    .setDescription(`${EMOJICONFIG.scroll4} **GUILD BATTLE!** between ${inlineCode(squadPLayer.squadName)} and ${inlineCode(squadEnemy.squadName)}\nThe fight is tough, but only one will win!`);
                                logChannel.send({embeds: [messageEmbed] });

                                await interaction.reply({ embeds: [squadBattle(squadPLayer.squadboss.bossattack, squadPLayer.squadboss.bosshealth, squadEnemy.squadboss.bossattack, squadEnemy.squadboss.bosshealth,squadPLayer.squadboss.bossdefense,squadEnemy.squadboss.bossdefense)]});
                            };
                            if (interaction.customId == 'no') {
                                await interaction.reply({ content: 'You were afraid, the fight is cancelled'});
                            }
                        });
                    } else return message.reply(`${EMOJICONFIG.no} you are not the leader of the Guild: ${inlineCode(squadPLayer.squadName)}`);
                } else return message.reply(`${EMOJICONFIG.no} you are not in a Guild...`);
            };
        };
    };
};
},
info: {
    names: ['guildattack', 'attackguild', 'guilda','ga'],
} }
