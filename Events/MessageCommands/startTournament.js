const Discord = require('discord.js');
const SQUADDATA = require('../../modules/squad.js')
const PLAYERDATA = require('../../modules/player.js');
const SQUADTOURNAMENT = require('../../modules/squadtournament.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const emojis = require('../../config/emoji.json');
const EMOJICONFIG = require('../../config/emoji.json');
const squad = require('../../modules/squad.js');
const STATS = require('../../modules/statsBot.js');
module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

    async execute(message, args, commandName) {
        if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {

    let stats = await STATS.findOne({ botID: 899 });
    var user = message.author;
    var nameTournament = args[0]
    var leaderboard = []
    var messageEmbedResult = ``

    // == Player DB ==
    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);

    
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    


    async function squadTournamentBattle(squadTournament){
        let queue = [...squadTournament.squadMember];
        let eliminatedSquads = [];
        while (queue.length > 1) {
            let squad1 = queue.shift();
            let squad2 = queue.shift();
            let squadboss1 = await SQUADDATA.findOne({ squadName: squad1.nameSquad });
            let squadboss2 = await SQUADDATA.findOne({ squadName: squad2.nameSquad });

            let squadPlayerAttack = squadboss1.squadboss.bossattack;
            let squadPlayerHealth = squadboss1.squadboss.bosshealth;
            let squadPlayerDefense = squadboss1.squadboss.bossdefense;
            let squadEnemyAttack = squadboss2.squadboss.bossattack;
            let squadEnemyHealth = squadboss2.squadboss.bosshealth;
            let squadEnemyDefense = squadboss2.squadboss.bossdefense;
    


            //let winner = squadBattle(squadPlayerAttack, squadPlayerHealth, squadEnemyAttack, squadEnemyHealth, squadPlayerDefense, squadEnemyDefense);
            //let loser = winner === squad1 ? squad2 : squad1;
            let { winner, loser } = await squadBattle(squad1, squad2, squadPlayerAttack, squadPlayerHealth, squadEnemyAttack, squadEnemyHealth, squadPlayerDefense, squadEnemyDefense);
            queue.push(winner);
            eliminatedSquads.push(loser);
            console.log(winner)
            console.log(loser)
            let fightResultEmbed = new EmbedBuilder()
            .setColor('#9696ab')
            .setTitle(`${squad1.nameSquad} vs ${squad2.nameSquad}` )
            .setDescription(`GUILD TOURNAMENT ROUND RESULTS \n`)
            .addFields(
            { name: `**${EMOJICONFIG.helmet} ${squad1.nameSquad} :**\n`, value: `**Attack** : ${squadPlayerAttack}\n**Defense** : ${squadPlayerDefense}\n**Health** : ${squadPlayerHealth}\n `, inline: true },
            { name: `**${EMOJICONFIG.hat7} ${squad2.nameSquad} :**\n`, value: `**Attack** : ${squadEnemyAttack}\n**Defense** : ${squadEnemyDefense}\n**Health** : ${squadEnemyHealth}\n`, inline: true },
            { name: `**${EMOJICONFIG.scroll4} FIGHT RESULTS :**\n`, value: `${winner.nameSquad} WINS!\n${EMOJICONFIG.yes} ${winner.nameSquad} advances to the next fight! \n ${EMOJICONFIG.no} ${loser.nameSquad} has been ELIMINATED!`, inline: false },)
            .setTimestamp();

            await message.reply({embeds: [fightResultEmbed]});
            await delay(5000);

           // leaderboard.push({ squadName: loser.nameSquad, position: queue.length + eliminatedSquads.length });
        }
        eliminatedSquads.push(queue[0]);
        eliminatedSquads.reverse();
        for (let i = 0; i < eliminatedSquads.length; i++) {         
        leaderboard.push({ squadName: eliminatedSquads[i].nameSquad, position: i + 1 });
        }
        //leaderboard.push({ squadName: queue[0].nameSquad, position: 1 });
        leaderboard.sort((a, b) => a.position - b.position);
        let totalPrizePool = squadTournament.squadMember.length * 10000;
        let topThreePrizePool = totalPrizePool;
        for(const result of leaderboard){
            let emoji;
            let winnings = 0;
            switch (result.position) {

            case 1: emoji = `🥇`; winnings = Math.round(topThreePrizePool * 0.5); break;
            case 2: emoji = `🥈`; winnings = Math.round(topThreePrizePool * 0.3); break;
            case 3: emoji = `🥉`; winnings = Math.round(topThreePrizePool * 0.2); break;
            default: emoji = `🎖️`;
            }
            //let queue = [...squadTournament.squadMember];
            messageEmbedResult += `${emoji} **#${result.position}** ${emojis.coin} ${winnings} ${inlineCode(result.squadName)}\n`;

            // == Add Reward for squad ==
            let squadMention = await SQUADDATA.findOne({ squadName: result.squadName });
            squadMention.squadbank += winnings
            squadMention.save()
            
        };

        var squadTournamentEmbed = new EmbedBuilder()
            .setColor('#6d4534')
            .setTitle(`${EMOJICONFIG.attack} Guild Tournament`)
            .setDescription(`${EMOJICONFIG.scroll4} **${squadTournament.squadTournamentName}** Guild Tournament\n${EMOJICONFIG.helmet} Organizer: ${inlineCode(squadTournament.squadTournamantLeader[0].pseudo)}\n${EMOJICONFIG.paper} Number of Guilds: ${inlineCode(squadTournament.squadMember.length)} (max: ${squadTournament.maxSquad})\n\n${EMOJICONFIG.yes} Result of the tournament:\n${messageEmbedResult}\n`)
            .setTimestamp();

        await message.reply({embeds: [squadTournamentEmbed]});
        await SQUADTOURNAMENT.deleteOne({ squadTournamentName: squadTournament.squadTournamentName });
        return;

    };

    async function squadBattle(squad1, squad2, squadPlayerAttack, squadPlayerHealth, squadEnemyAttack, squadEnemyHealth, squadPlayerDefense, squadEnemyDefense){
        var healthSquadPlayer = squadPlayerHealth
        var totalDamageSquadPLayer = 0
    
        var healthSquadEnemy = squadEnemyHealth
        var totalDamageSquadEnemy = 0
    
        var round = 0
    
        while(healthSquadPlayer > 0 && healthSquadEnemy > 0){
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
                return { winner: squad2, loser: squad1 };
            }
    
            if(healthSquadEnemy <= 0){
                return { winner: squad1, loser: squad2 };
            }
        }
    }


    // == Tournament DB ==
    let squadTournament = await SQUADTOURNAMENT.findOne({ squadTournamentName: nameTournament });
    if (!squadTournament) return message.reply(`${EMOJICONFIG.no} This tournament does not exist...`)
    else {

        if(squadTournament.squadMember.length <= 1) return message.reply(`${EMOJICONFIG.no} the minimum to start a tournament is 2 Guilds...`) 

        // == Check if user are the creator ==
        if(squadTournament.squadTournamantLeader[0].id == user.id){

            squadTournamentBattle(squadTournament)

        } else return message.reply(`${EMOJICONFIG.no} You are not the creator of the tournament...`)
    };
};
},
info: {
    names: ['starttournament'],
} }

