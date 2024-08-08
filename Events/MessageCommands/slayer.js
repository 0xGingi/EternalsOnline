const Discord = require('discord.js');
const monsters = require('../../config/monster.json');
const PLAYERDATA = require('../../modules/player.js');
const STATS = require('../../modules/statsBot.js');
const SQUADDATA = require('../../modules/squad.js')
const EMOJICONFIG = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { numStr } = require('../../functionNumber/functionNbr.js');
const crypto = require("crypto");
const { prefix } = require('../../App/config.json')
const configLevel = require('../../config/configLevel.json');
const CONFIGITEM = require('../../config/stuff.json')
const Party = require('../../modules/party.js');
const player = require('../../modules/player.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {

        var user = message.author
        const input = args[0];
        let playerStats = await PLAYERDATA.findOne({ userId: user.id });
        let balance = await BALANCEDATA.findOne({ userId: user.id });

        if (!playerStats) return message.reply(`${inlineCode('❌')} you are not a player ! : ${inlineCode('mmo start')}`);
        else {
            let randomxp = Math.floor(Math.random() * (50 - 25 + 1)) + 25;
            let monstersKilled = playerStats.player.slayer.task.kills;
            //let randomxp = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
            async function partyxp() {
                const party = await Party.findOne({ member: { $elemMatch: { id: message.author.id } } });
                let sharedXpPercentage = 0;
                let inparty = false;            
                if (party && party.member.length > 1) {
                    inparty = true;
                    const additionalXPPerMember = Math.floor(randomxp * monstersKilled * 0.02);
                    const totalAdditionalXP = Math.min(additionalXPPerMember * party.member.length, Math.floor(randomxp * monstersKilled * 0.10));
                    sharedXpPercentage = (totalAdditionalXP / monstersKilled * randomxp) * 100;
                    for (const member of party.member) {
                        if (member.id === message.author.id) return;
                        let memberBalance = await PLAYERDATA.findOne({ userId: member.id });
                        if (memberBalance) {    
                            memberBalance.player.slayer.xp += totalAdditionalXP;
                            memberBalance.player.slayer.totalxp += totalAdditionalXP;
                            await memberBalance.save();
                        }
                    }
                }
            return {inparty, sharedXpPercentage};
            }
            if (!input) {
                
                if (playerStats.player.slayer.task.monster === "") {
                    if (Math.random() < 0.5 || playerStats.player.slayer.level < 10){
                    let eligiblemonsters = monsters.filter(monster => 
                        Math.abs(monster.level - playerStats.player.slayer.level) <= 15
                    );
                    let randomMonster = Math.floor(Math.random() * eligiblemonsters.length);
                    let monster = eligiblemonsters[randomMonster];
                    let monsterName = monster.name;
                    let monsterLevel = monster.level;
                    let monsterArea = monster.area;
                    let monsterDesc = monster.description;
                    let maxKills = 70;
                    let minKills = 10;
                    let killsNeeded = Math.floor(Math.random() * (maxKills - minKills + 1)) + minKills;
                    playerStats.player.slayer.task.monster = monsterName;
                    playerStats.player.slayer.task.kills = 0;
                    playerStats.player.slayer.task.neededKills = killsNeeded;
                    await playerStats.save();

                    var battleEmbed = new Discord.EmbedBuilder()
                    .setColor('#fc9803')
                    .setTitle(`${user.username} slayer task`)
                    .setDescription(`\n`)
                    .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                    .addFields(
                        { name: `New Slayer Task`, value: 'You have been given a new slayer task' },
                        { name: `${killsNeeded} x ${monsterName}`, value: `Level: ${monsterLevel}\nArea: ${monsterArea}\nDescription: ${monsterDesc}` },
                    )
                    .setFooter({ text: 'FlipMMO Slayer Task'});
                    message.channel.send({ embeds: [battleEmbed] });
                }
                else {
                    let dungeonFloor = Math.min(Math.floor(playerStats.player.slayer.level / 10), 9);
                    let maxKills = 25;
                    let minKills = 10;
                    let monsterName = `Slayer Dungeon Floor ${dungeonFloor}`;
                    let monsterArea = "Slayer Dungeon";
                    let monsterDesc = `Any monster from the Slayer Dungeon in Floor ${dungeonFloor}`;
                    let killsNeeded = Math.floor(Math.random() * (maxKills - minKills + 1)) + minKills;
                    playerStats.player.slayer.task.monster = `Slayer Dungeon Floor ${dungeonFloor}`;
                    playerStats.player.slayer.task.kills = 0;
                    playerStats.player.slayer.task.neededKills = killsNeeded;
                    await playerStats.save();
                    var battleEmbed = new Discord.EmbedBuilder()
                    .setColor('#fc9803')
                    .setTitle(`${user.username} slayer task`)
                    .setDescription(`\n`)
                    .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                    .addFields(
                        { name: `New Slayer Task`, value: 'You have been given a new slayer task' },
                        { name: `${killsNeeded} x ${monsterName}`, value: `Level: ${dungeonFloor * 10}\nArea: ${monsterArea}\nDescription: ${monsterDesc}` },
                    )
                    .setFooter({ text: 'FlipMMO Slayer Task'});
                    message.channel.send({ embeds: [battleEmbed] });
                }
            }
                if (playerStats.player.slayer.task.monster !== "" && playerStats.player.slayer.task.kills < playerStats.player.slayer.task.neededKills) {
                    let monster = monsters.find(m => m.name === playerStats.player.slayer.task.monster);
                    let monsterLevel = monster?.level || '';
                    let monsterArea = monster?.area || '';
                    let monsterDesc = monster?.description || '';

                    var battleEmbed = new Discord.EmbedBuilder()
                    .setColor('#fc9803')
                    .setTitle(`${user.username} slayer task`)
                    .setDescription(`\n`)
                    .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                    .addFields(
                        { name: `Current Slayer Task`, value: 'You have a current slayer task' },
                        { name: `${playerStats.player.slayer.task.monster}`, value: `Kills: ${playerStats.player.slayer.task.kills} / ${playerStats.player.slayer.task.neededKills}\nLevel: ${monsterLevel}\nArea: ${monsterArea}\nDescription: ${monsterDesc}` },
                    )
                    .setFooter({ text: 'FlipMMO Slayer Task'});
                    message.channel.send({ embeds: [battleEmbed] });
                    }
                    if (playerStats.player.slayer.task.monster !== "" && playerStats.player.slayer.task.kills >= playerStats.player.slayer.task.neededKills) {
                        
                        var randombox = Math.floor(Math.random() * 99);
                        if (randombox >= 50){
                            var boxwin = 1;
                                playerStats.player.other.box += 1
                            }
                            else {
                                var boxwin = 0;
                            }
                            if (randombox >= 90){
                                var boxwin2 = 1;
                                    playerStats.player.other.rarebox += 1
                                }
                                else {
                                    var boxwin2 = 0;
                                }
    
                                async function xpToLevel(level) {
                                    let total = 0;
                                    for (let l = 1; l < level; l++) {
                                        total += Math.floor(l + 300 * Math.pow(2, l / 7.0));
                                    }
                                    return Math.floor(total / 4);
                                }
                            
                                async function xpToNextLevel(currentLevel) {
                                    return await xpToLevel(currentLevel + 1) - await xpToLevel(currentLevel);
                                }
                            
                        let xpNeeded;
                        let randomcoin = Math.floor(Math.random() * (5000 - 100 + 1)) + 100;
                        xpNeeded = await xpToNextLevel(playerStats.player.slayer.level);
                        playerStats.player.slayer.points += 1;
                        playerStats.player.slayer.xp += Math.abs(Math.floor(randomxp * monstersKilled));
                        playerStats.player.slayer.totalxp += Math.abs(Math.floor(randomxp * monstersKilled));
                        //playerStats.player.slayer.xp += randomxp;
                        //playerStats.player.slayer.totalxp += randomxp;
                        playerStats.player.slayer.task.monster = "";
                        playerStats.player.slayer.task.kills = 0;
                        playerStats.player.slayer.task.neededKills = 0;
                        balance.eco.coins += randomcoin;

                    
                        var battleEmbed = new Discord.EmbedBuilder()
                        .setColor('#fc9803')
                        .setTitle(`${user.username} slayer task`)
                        .setDescription(`\n`)
                        .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                        .addFields(
                            { name: `Congratulations!`, value: 'You have completed your slayer task!' },
                            { name: `Rewards`, value: `**${inlineCode(numStr(randomxp * monstersKilled))}** ${EMOJICONFIG.xp} - **${inlineCode(numStr(randomcoin))}** ${EMOJICONFIG.coin} - **${inlineCode(numStr(boxwin))}** Common Box ${EMOJICONFIG.coinchest} - **${inlineCode(numStr(boxwin2))}** Rare Box ${EMOJICONFIG.coinchest} - +1 Slayer Point` },
                        )
                        .setFooter({ text: 'FlipMMO Slayer Task'});
                            console.log(playerStats.player.slayer.xp)
                            console.log(xpNeeded)
                            if (playerStats.player.slayer.xp >= xpNeeded) {
                                if (playerStats.player.slayer.level >= 120) {
                                }
                                else if (playerStats.player.slayer.level <= 120) {
                                    while (playerStats.player.slayer.xp >= await xpToNextLevel(playerStats.player.slayer.level)) {
                                        playerStats.player.slayer.level += 1;
                                        xpNeeded = await xpToNextLevel(playerStats.player.slayer.level);
                                        if (playerStats.player.slayer.xp >= xpNeeded) {
                                            playerStats.player.slayer.xp -= xpNeeded;
                                        } else {
                                            playerStats.player.slayer.xp = 0;
                                        }
                                    }
                            battleEmbed.addFields({ name: `Congratulations! You leveled up!`, value: `Your new slayer level is ${playerStats.player.slayer.level}.\n`});
                            const logChannel = client.channels.cache.get('1169491579774443660');
                            var now = new Date();
                            var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                            var messageEmbed = new EmbedBuilder()
                            .setColor('#D5EB0D')
                            .setTitle(`Log ${date}`)
                            .setDescription(`${EMOJICONFIG.necromancy} ${inlineCode(user.username)} is now slayer level **${playerStats.player.slayer.level}**!`);
                            logChannel.send({embeds: [messageEmbed], ephemeral: true });
                            } }
                             else {
                        }
                        await playerStats.save();
                        await balance.save();
                        message.channel.send({ embeds: [battleEmbed] });
                        }
                }
            }
            if (input == 'shop'){
                var shopEmbed = new Discord.EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} slayer shop`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .addFields(
                    { name: `${user.username} Slayer Points`, value: `${playerStats.player.slayer.points}` },
                    { name: `Slayer Shop`, value: `Cancel Task (${inlineCode(`@FlipMMO slayer cancel`)}) - **${inlineCode('5')}** Slayer Points\n\nSelect Area (${inlineCode(`@FlipMMO slayer area <areaname>`)}) - **${inlineCode('10')}** Slayer Points\n\nSlayer Dungeon (${inlineCode(`@FlipMMO slayer dungeon`)}) - **${inlineCode('2')}** Slayer Points\n\nSlayer Dagger (${inlineCode(`@FlipMMO slayer dagger`)}) - **${inlineCode('5')}** Slayer Points\n\nSlayer Gloves (${inlineCode(`@FlipMMO slayer gloves`)}) - **${inlineCode('7')}** Slayer Points\n\nSlayer Shortsword (${inlineCode(`@FlipMMO slayer shortsword`)}) - **${inlineCode('10')}** Slayer Points\n\nSlayer Boots (${inlineCode(`@FlipMMO slayer boots`)}) - **${inlineCode('12')}** Slayer Points\n\nSlayer Axe (${inlineCode(`@FlipMMO slayer axe`)}) - **${inlineCode('15')}** Slayer Points\n\nSlayer Pants (${inlineCode(`@FlipMMO slayer pants`)}) - **${inlineCode('17')}** Slayer Points\n\nSlayer Sword (${inlineCode(`@FlipMMO slayer sword`)}) - **${inlineCode('20')}** Slayer Points\n\nSlayer Chestplate (${inlineCode(`@FlipMMO slayer chestplate`)}) - **${inlineCode('25')}** Slayer Points\n\nSlayer Warhammer (${inlineCode(`@FlipMMO slayer warhammer`)}) - **${inlineCode('30')}** Slayer Points` },
                )
                .setFooter({ text: 'FlipMMO Slayer Shop'});
                message.channel.send({ embeds: [shopEmbed] });

            }
            if (input == 'cancel'){
                if (playerStats.player.slayer.points < 5) return message.reply(`${inlineCode('❌')} You do not have enough slayer points to cancel your task.`);
                playerStats.player.slayer.task.monster = "";
                playerStats.player.slayer.task.kills = 0;
                playerStats.player.slayer.task.neededKills = 0;
                playerStats.player.slayer.points -= 5;
                await playerStats.save();
                message.reply(`${EMOJICONFIG.yes} You have successfully cancelled your slayer task`);
            }
            if (input == 'area'){
                if (playerStats.player.slayer.points < 10) return message.reply(`${inlineCode('❌')} You do not have enough slayer points to select an area.`);
                let area = args[1];
                if (!area) return message.reply(`${inlineCode('❌')} Please provide an area name.`);
                let eligiblemonsters = monsters.filter(monster => 
                    monster.area.toLowerCase() === area.toLowerCase() && Math.abs(monster.level - playerStats.player.slayer.level) <= 15
                );
                if (eligiblemonsters.length < 1) return message.reply(`${inlineCode('❌')} There are no monsters in this area that you can kill.`);
                let randomMonster = Math.floor(Math.random() * eligiblemonsters.length);
                let monster = eligiblemonsters[randomMonster];
                let monsterName = monster.name;
                let monsterLevel = monster.level;
                let monsterArea = monster.area;
                let monsterDesc = monster.description;
                let maxKills = 70;
                let minKills = 10;
                let killsNeeded = Math.floor(Math.random() * (maxKills - minKills + 1)) + minKills;
                playerStats.player.slayer.task.monster = monsterName;
                playerStats.player.slayer.task.kills = 0;
                playerStats.player.slayer.task.neededKills = killsNeeded;
                playerStats.player.slayer.points -= 10;
                await playerStats.save();
                var battleEmbed = new Discord.EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} slayer task`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .addFields(
                    { name: `New Slayer Task`, value: 'You have been given a new slayer task' },
                    { name: `${killsNeeded} x ${monsterName}`, value: `Level: ${monsterLevel}\nArea: ${monsterArea}\nDescription: ${monsterDesc}` },
                )
                .setFooter({ text: 'FlipMMO Slayer Task'});
                message.channel.send({ embeds: [battleEmbed] });

            }
            if (input == 'dungeon'){
                if (playerStats.player.slayer.points < 2) return message.reply(`${inlineCode('❌')} You do not have enough slayer points to get this task.`);
                let level = playerStats.player.slayer.level;
                let dungeonFloor = Math.min(Math.floor(level / 10), 9);
                let maxKills = 25;
                let minKills = 10;
                let monsterName = `Slayer Dungeon Floor ${dungeonFloor}`;
                let monsterArea = "Slayer Dungeon";
                let monsterDesc = `Any monster from the Slayer Dungeon in Floor ${dungeonFloor}`;
                let killsNeeded = Math.floor(Math.random() * (maxKills - minKills + 1)) + minKills;
                playerStats.player.slayer.task.monster = `Slayer Dungeon Floor ${dungeonFloor}`;
                playerStats.player.slayer.task.kills = 0;
                playerStats.player.slayer.task.neededKills = killsNeeded;
                playerStats.player.slayer.points -= 2;
                await playerStats.save();
            
                var battleEmbed = new Discord.EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} slayer task`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .addFields(
                    { name: `New Slayer Task`, value: 'You have been given a new slayer task' },
                    { name: `${killsNeeded} x ${monsterName}`, value: `Level: ${dungeonFloor * 10}\nArea: ${monsterArea}\nDescription: ${monsterDesc}` },
                )
                .setFooter({ text: 'FlipMMO Slayer Task'});
                message.channel.send({ embeds: [battleEmbed] });

            }
            if (input == 'dagger' || input == 'syd'){
                if (playerStats.player.slayer.points < 5) return message.reply(`${EMOJICONFIG.no} You do not have enough slayer points to purchase this item!`)
                var itemInInventory = playerStats.player.stuff.stuffUnlock.find(item => item.id === 103);
                if (itemInInventory){
                    itemInInventory.amount += 1;
                }
                else{                
                playerStats.player.stuff.stuffUnlock.push({id: 103, name:"Slayer Dagger", amount: 1, level: 1 });
                }
                playerStats.player.slayer.points -= 5;
                await playerStats.save();
                var battleEmbed = new Discord.EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} Slayer Shop`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .addFields(
                    { name: `Slayer Dagger`, value: `You have successfully purchased a ${inlineCode(`Slayer Dagger (SYD)`)} for ${inlineCode(`5`)} Slayer Points!` },
                )
                .setFooter({ text: 'FlipMMO Slayer Task'});
                message.channel.send({ embeds: [battleEmbed] });


            }
            if (input == 'gloves' || input == 'syg'){
                if (playerStats.player.slayer.points < 7) return message.reply(`${EMOJICONFIG.no} You do not have enough slayer points to purchase this item!`)
                var itemInInventory = playerStats.player.stuff.stuffUnlock.find(item => item.id === 103);
                if (itemInInventory){
                    itemInInventory.amount += 1;
                }
                else{                
                playerStats.player.stuff.stuffUnlock.push({id: 104, name:"Slayer Gloves", amount: 1, level: 1 });
                }
                playerStats.player.slayer.points -= 7;
                await playerStats.save();
                var battleEmbed = new Discord.EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} Slayer Shop`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .addFields(
                    { name: `Slayer Gloves`, value: `You have successfully purchased a ${inlineCode(`Slayer Gloves (SYG)`)} for ${inlineCode(`7`)} Slayer Points!` },
                )
                .setFooter({ text: 'FlipMMO Slayer Shop'});
                message.channel.send({ embeds: [battleEmbed] });


            }
            if (input == 'shortsword' || input == 'syss'){
                if (playerStats.player.slayer.points < 10) return message.reply(`${EMOJICONFIG.no} You do not have enough slayer points to purchase this item!`)
                var itemInInventory = playerStats.player.stuff.stuffUnlock.find(item => item.id === 105);
                if (itemInInventory){
                    itemInInventory.amount += 1;
                }
                else{                
                playerStats.player.stuff.stuffUnlock.push({id: 105, name:"Slayer Shortsword", amount: 1, level: 1 });
                }
                playerStats.player.slayer.points -= 10;
                await playerStats.save();
                var battleEmbed = new Discord.EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} Slayer Shop`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .addFields(
                    { name: `Slayer Shortsword`, value: `You have successfully purchased a ${inlineCode(`Slayer Shortsword (SYSS)`)} for ${inlineCode(`10`)} Slayer Points!` },
                )
                .setFooter({ text: 'FlipMMO Slayer Shop'});
                message.channel.send({ embeds: [battleEmbed] });
            }
            if (input == 'boots' || input == 'syb'){
                if (playerStats.player.slayer.points < 12) return message.reply(`${EMOJICONFIG.no} You do not have enough slayer points to purchase this item!`)
                var itemInInventory = playerStats.player.stuff.stuffUnlock.find(item => item.id === 106);
                if (itemInInventory){
                    itemInInventory.amount += 1;
                }
                else{                
                playerStats.player.stuff.stuffUnlock.push({id: 106, name:"Slayer Shortsword", amount: 1, level: 1 });
                }
                playerStats.player.slayer.points -= 12;
                await playerStats.save();
                var battleEmbed = new Discord.EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} Slayer Shop`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .addFields(
                    { name: `Slayer Boots`, value: `You have successfully purchased a ${inlineCode(`Slayer Boots (SYB)`)} for ${inlineCode(`12`)} Slayer Points!` },
                )
                .setFooter({ text: 'FlipMMO Slayer Shop'});
                message.channel.send({ embeds: [battleEmbed] });
            }
            if (input == 'axe' || input == 'sya'){
                if (playerStats.player.slayer.points < 15) return message.reply(`${EMOJICONFIG.no} You do not have enough slayer points to purchase this item!`)
                var itemInInventory = playerStats.player.stuff.stuffUnlock.find(item => item.id === 107);
                if (itemInInventory){
                    itemInInventory.amount += 1;
                }
                else{                
                playerStats.player.stuff.stuffUnlock.push({id: 107, name:"Slayer Axe", amount: 1, level: 1 });
                }
                playerStats.player.slayer.points -= 15;
                await playerStats.save();
                var battleEmbed = new Discord.EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} Slayer Shop`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .addFields(
                    { name: `Slayer Axe`, value: `You have successfully purchased a ${inlineCode(`Slayer Axe (SYA)`)} for ${inlineCode(`15`)} Slayer Points!` },
                )
                .setFooter({ text: 'FlipMMO Slayer Shop'});
                message.channel.send({ embeds: [battleEmbed] });
            }
            if (input == 'pants' || input == 'syp'){
                if (playerStats.player.slayer.points < 17) return message.reply(`${EMOJICONFIG.no} You do not have enough slayer points to purchase this item!`)
                var itemInInventory = playerStats.player.stuff.stuffUnlock.find(item => item.id === 108);
                if (itemInInventory){
                    itemInInventory.amount += 1;
                }
                else{                
                playerStats.player.stuff.stuffUnlock.push({id: 108, name:"Slayer Pants", amount: 1, level: 1 });
                }
                playerStats.player.slayer.points -= 17;
                await playerStats.save();
                var battleEmbed = new Discord.EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} Slayer Shop`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .addFields(
                    { name: `Slayer Pants`, value: `You have successfully purchased a ${inlineCode(`Slayer Pants (SYP)`)} for ${inlineCode(`17`)} Slayer Points!` },
                )
                .setFooter({ text: 'FlipMMO Slayer Shop'});
                message.channel.send({ embeds: [battleEmbed] });
            }
            if (input == 'sword' || input == 'sys'){
                if (playerStats.player.slayer.points < 20) return message.reply(`${EMOJICONFIG.no} You do not have enough slayer points to purchase this item!`)
                var itemInInventory = playerStats.player.stuff.stuffUnlock.find(item => item.id === 109);
                if (itemInInventory){
                    itemInInventory.amount += 1;
                }
                else{                
                playerStats.player.stuff.stuffUnlock.push({id: 109, name:"Slayer Sword", amount: 1, level: 1 });
                }
                playerStats.player.slayer.points -= 20;
                await playerStats.save();
                var battleEmbed = new Discord.EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} Slayer Shop`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .addFields(
                    { name: `Slayer Sword`, value: `You have successfully purchased a ${inlineCode(`Slayer Sword (SYS)`)} for ${inlineCode(`20`)} Slayer Points!` },
                )
                .setFooter({ text: 'FlipMMO Slayer Shop'});
                message.channel.send({ embeds: [battleEmbed] });
            }
            if (input == 'chestplate' || input == 'sycp' || input == 'chest'){
                if (playerStats.player.slayer.points < 25) return message.reply(`${EMOJICONFIG.no} You do not have enough slayer points to purchase this item!`)
                var itemInInventory = playerStats.player.stuff.stuffUnlock.find(item => item.id === 110);
                if (itemInInventory){
                    itemInInventory.amount += 1;
                }
                else{                
                playerStats.player.stuff.stuffUnlock.push({id: 110, name:"Slayer Chestplate", amount: 1, level: 1 });
                }
                playerStats.player.slayer.points -= 25;
                await playerStats.save();
                var battleEmbed = new Discord.EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} Slayer Shop`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .addFields(
                    { name: `Slayer Chestplate`, value: `You have successfully purchased a ${inlineCode(`Slayer Chestplate (SYCP)`)} for ${inlineCode(`25`)} Slayer Points!` },
                )
                .setFooter({ text: 'FlipMMO Slayer Shop'});
                message.channel.send({ embeds: [battleEmbed] });
            }
            if (input == 'warhammer' || input == 'sywh' || input == 'hammer'){
                if (playerStats.player.slayer.points < 30) return message.reply(`${EMOJICONFIG.no} You do not have enough slayer points to purchase this item!`)
                var itemInInventory = playerStats.player.stuff.stuffUnlock.find(item => item.id === 111);
                if (itemInInventory){
                    itemInInventory.amount += 1;
                }
                else{                
                playerStats.player.stuff.stuffUnlock.push({id: 111, name:"Slayer Warhammer", amount: 1, level: 1 });
                }
                playerStats.player.slayer.points -= 30;
                await playerStats.save();
                var battleEmbed = new Discord.EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} Slayer Shop`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .addFields(
                    { name: `Slayer Warhammer`, value: `You have successfully purchased a ${inlineCode(`Slayer Warhammer (SYWH)`)} for ${inlineCode(`30`)} Slayer Points!` },
                )
                .setFooter({ text: 'FlipMMO Slayer Shop'});
                message.channel.send({ embeds: [battleEmbed] });
            }


      }
    },
    info: {
        names: ['slayer'],
    },
};