const { Collection, Events, EmbedBuilder} = require('discord.js');
const Player = require('../../modules/player.js');
const Balance = require('../../modules/economie.js');
const EMOJICONFIG = require('../../config/emoji.json');
const bgemoji = require('../../config/bgemoji.json');
const { numStr } = require('../../functionNumber/functionNbr.js');
const { inlineCode } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const _ = require('lodash');
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
            var user = message.author
            if(user.id == '351859727568994314' || user.id == '919048526518960198' || user.id == '217025723573993474'){

                async function startBattleground() {    
                try {
                    const announcementEmbed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('FlipMMO Battlegrounds')
                    .setDescription('The next battleground will start in 30 minutes!')
                    .setTimestamp()
                    .setFooter({ text: 'FlipMMO Battlegrounds' });
                await message.channel.send({ embeds: [announcementEmbed] });
                const guildMembers = await message.guild.members.fetch();
                let allPlayers2 = await Player.find();
                allPlayers2 = allPlayers2.filter(player => guildMembers.has(player.userId));
                let allPlayers = _.sampleSize(allPlayers2, 16);
                const announcementEmbed2 = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('FlipMMO Battlegrounds')
                .addFields( {name: `${EMOJICONFIG.helmet} Selected Players:`, value: allPlayers.map(p => `\`${p.pseudo}\``).join('\n')})
                .setTimestamp()
                .setFooter({ text: 'FlipMMO Battlegrounds' });
            await message.channel.send({ embeds: [announcementEmbed2] });


                    setTimeout(async () => {
                    const bgemojiArray = Object.values(bgemoji);
                    function delay(duration) {
                        return new Promise(resolve => setTimeout(resolve, duration));
                    }
                    
                    const fightDescriptions = [
                        "hits {loser} in the head with a shoe",
                        "lands a sneaky punch on {loser}'s shoulder",
                        "kicks {loser} in the stomach",
                        "pokes {loser} in the eye",
                        "convines {loser} to leave their mother's basement",
                        "throws a rock at {loser}'s head",
                        "seduced {loser} with their charm",
                        "kicked {loser} in the nuts",
                        "slapped {loser} in the face",
                        "punched {loser} in the stomach",
                        "choked {loser} with a rope",
                        "kicked {loser} in the shin",
                        "punched {loser} in the face",
                        "punched {loser} in the stomach",
                        "lured {loser} in a dark cave",
                        "threw {loser} off a cliff",
                        "sold out {loser} to his debt collectors",
                        "stabbed {loser} in the back",
                        "crushed {loser} with a boulder",
                        "sliced {loser} with a sword",
                        "shot {loser} with a bow",
                        "crushed {loser} with a warhammer",
                        "slashed {loser} with a dagger",
                        "slapped {loser} with a glove",
                        "pierced {loser} with a spear",
                        "sliced {loser} with a scythe",
                        "left {loser} to die in a dungeon",
                        "told {loser} they were unarmed",
                        "left {loser} a note filled with poison",
                        "held {loser} underwater while they were playing",
                        "shot {loser} in the knee with an arrow",
                        "caught {loser} slacking",
                        "punched {loser} in the heart from 1 inch away",
                        "made {loser} enter the dungeon without a party invite",
                        "spent {loser} gold on an assassin",
                        "built {loser} hopes and dreams up",
                        "stabbed {loser} with a golden dagger in the hand",
                        "made a cake for {loser} and they choked",
                        "took {loser} to church",
                        "popped {loser} in the mouth for talking trash",
                        "thought {loser} was on their team, teamkilled anyway",
                        "sent a swarm of bees after {loser}",
                        "spooked {loser} with a ghost story",
                        "pulled the chair out from under {loser}",
                        "cast a dark spell on {loser}, draining their life force",
                        "unleashed a horde of undead minions on {loser}",
                        "enchanted their weapon to cut through {loser}'s armor effortlessly",
                        "used a necromantic ritual to raise {loser} as an undead servant",
                        "crafted a cursed artifact that drained {loser}'s soul with each touch",
                        "summoned a spectral wolf pack to hunt down {loser}",
                        "threw a rock at {loser}'s nuts"
                    ];
                    let round = 1;
                    let fightOutcomes = [];
                    while (allPlayers.length > 1) {
                        let winners = [];
                        const nextRoundPlayers = [];
                        for (let i = 0; i < allPlayers.length; i += 2) {
                            if (i + 1 < allPlayers.length) {
                                const player1 = allPlayers[i];
                                const player2 = allPlayers[i + 1];
                                const winner = Math.random() < 0.5 ? player1 : player2;
                                const loser = winner === player1 ? player2 : player1;

                                winners.push(winner);
                                const randomEmoji = bgemojiArray[Math.floor(Math.random() * bgemojiArray.length)];
                                const descriptionTemplate = fightDescriptions[Math.floor(Math.random() * fightDescriptions.length)];
                                const fightOutcome = `${randomEmoji} ${descriptionTemplate.replace("{loser}", `\`${loser.pseudo}\``)}`;                                
                                fightOutcomes.push(`${inlineCode(winner.pseudo)} ${fightOutcome}`);
                                nextRoundPlayers.push(`${inlineCode(winner.pseudo)} Advances to the next round.`);
                            } else {
                                winners.push(allPlayers[i]);
                                nextRoundPlayers.push(`${inlineCode(allPlayers[i].pseudo)} advances to the next round by default.`);
                            }
                        }

                        const battleground = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('FlipMMO Battlegrounds')
                        .setDescription(`Round ${round}`)
                        .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                        .addFields(
                            { name: 'Fight Outcomes', value: fightOutcomes.join('\n') },
                            { name: 'Next Round', value: nextRoundPlayers.join('\n') }
                        )
                        .setTimestamp()
                        .setFooter({ text: 'FlipMMO Battlegrounds'});
                
                    message.channel.send({ embeds: [battleground] });
                        //allPlayers.length = 0;
                        //allPlayers.push(...winners);
                        fightOutcomes.length = 0;
                        allPlayers = winners;
                        round++;

                        await delay(10 * 1000); 
                    }
                    const winnerRewardCoins = 100;
                    const winnerRewardXP = 50;
                    const winnerDiscordId = allPlayers[0].userId;
                    const winnerRecord = await Player.findOne({ userId: winnerDiscordId });
                    const winnerRecord2 = await Balance.findOne({ userId: winnerDiscordId });
                        
                    winnerRecord2.eco.coins += winnerRewardCoins;
                    winnerRecord2.eco.xp += winnerRewardXP;
                    await winnerRecord2.save();
                    const chance = Math.random();
                    let boxMessage = `${inlineCode(allPlayers[0].pseudo)} did not win a skilling pack`;
                    if (chance < 0.5) {
                    const packs = ['orepack', 'fishpack', 'logpack'];
                    const selectedPack = packs[Math.floor(Math.random() * packs.length)];
                    winnerRecord.player.other[selectedPack] += 1;
                    boxMessage = `${allPlayers[0].pseudo} obtained a ${selectedPack}!`;
                    await winnerRecord.save();
                    }

                    const battleground2 = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('FlipMMO Battlegrounds')
                    .setDescription(`FlipMMO Battleground Results`)
                    .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                    .addFields(
                        { name: 'Battleground Results', value: `<@${allPlayers[0].userId}> wins!` },
                        { name: 'Rewards', value: `${inlineCode(allPlayers[0].pseudo)} wins and gets **${inlineCode(numStr(winnerRewardXP))}** ${EMOJICONFIG.xp} - **${inlineCode(numStr(winnerRewardCoins))}** ${EMOJICONFIG.coin} \n ${boxMessage}` },
                    )
                    .setTimestamp()
                    .setFooter({ text: 'FlipMMO Battlegrounds'});
            
                message.channel.send({ embeds: [battleground2] });
                //setTimeout(startBattleground, 30 * 60 * 1000);

                    startBattleground();
                    }, 30 * 60 * 1000);
                   // }, 5 * 1000);
                
                } catch (error) {
                    console.error('Error executing battleground command:', error);
                    message.channel.send('An error occurred while trying to start the battleground.');
                }
            }
            startBattleground();
            } else return message.reply(`${EMOJICONFIG.no} Sorry! This command is only for admins only...`);
        }
    },
    info: {
		names: ['bg']
    }   
};  