const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const SQUADDATA = require('../../modules/squad.js')
const BALANCEDATA = require('../../modules/economie.js');
const { numStr } = require('../../functionNumber/functionNbr.js')
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { prefix } = require('../../App/config.json')
const configLevel = require('../../config/configLevel.json');
const {client} = require('../../App/index.js');
const PARTYDATA = require('../../modules/party.js');
const PETS = require('../../config/pets.json');

// Config Cooldown :
const shuffleTime = 5000;
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

  var user = message.author;
  var userInput = Array.from(message.mentions.users.values())[1];

  if(userInput == ' ' || userInput == '' || userInput == undefined || userInput.id == user.id){
    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    if (!playerStats) return message.reply(`${inlineCode('❌')} you are not a player ! : ${inlineCode('@Eternals start')}`);
    else {

      let balance = await BALANCEDATA.findOne({ userId: user.id });
      if (!balance) return message.reply(`${inlineCode('❌')} you are not a player ! : ${inlineCode('@Eternals start')}`);
      else {

        var squadMessage = ``
        var partyMessage = ``
        if(playerStats.player.other.squadName == 'undefined'){
        squadMessage = 'Not in a Guild'
        } else {
          let squad = await SQUADDATA.findOne({ squadName: playerStats.player.other.squadName });
          if(squad.leader[0] == user.id) squadMessage = `${playerStats.player.other.squadName} (leader)`
          else squadMessage = `${playerStats.player.other.squadName} (member)`
        };
        if(playerStats.player.other.partyName == 'undefined'){
          partyMessage = 'Not in a Party'
          } else {
            let party = await PARTYDATA.findOne({ partyName: playerStats.player.other.partyName });
            if(party.leader[0] == user.id) partyMessage = `${playerStats.player.other.partyName} (leader)`
            else partyMessage = `${playerStats.player.other.partyName} (member)`
          };
  
        const playerLevel = playerStats.player.level;
        const maxHealth = configLevel[`level${playerLevel}`].stats.health;
        const levell = configLevel[`level${playerLevel}`];
        //const xpneeded = levell.XPcost - balance.eco.xp;

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
  

        var statsEmbed = new Discord.EmbedBuilder()
          .setColor('#fc9803')
          .setTitle(`${user.username}'s Stats`)
          .addFields(
            { name: `**${EMOJICONFIG.scroll4} Info :**\n`, value: `${EMOJICONFIG.paper} Level: ${inlineCode(playerStats.player.level)}\n${EMOJICONFIG.attack6} ELO: ${inlineCode(playerStats.player.elo)}\n${EMOJICONFIG.hellspawn} Pet ELO: ${inlineCode(playerStats.player.petelo)}\n${EMOJICONFIG.map} Area: ${inlineCode(playerStats.player.other.area)}\n${EMOJICONFIG.helmet} Ironman: ${inlineCode(playerStats.player.other.ironman ? 'yes' : 'no')}`, inline: true },
            { name: `**${EMOJICONFIG.coinchest} Balance :**\n`, value: `${EMOJICONFIG.coin}: ${inlineCode(numStr(balance.eco.coins))}\n${EMOJICONFIG.xp}: ${inlineCode(numStr(balance.eco.xp))}\n${EMOJICONFIG.xp} Needed: ${inlineCode(numStr((xpToNextLevel(playerStats.player.level) - balance.eco.xp)))}\n${EMOJICONFIG.xp} Total: ${inlineCode(numStr(balance.eco.totalxp))} `, inline: true },
            { name: `**${EMOJICONFIG.scroll4} Groups :**\n`, value: `${EMOJICONFIG.paper} GUILD: ${inlineCode(squadMessage)}\n${EMOJICONFIG.paper} Party: ${inlineCode(partyMessage)}`, inline: true },
            { name: `**${EMOJICONFIG.paper} Stats :**\n`, value: `${EMOJICONFIG.heart} Health: ${inlineCode(numStr(playerStats.player.health))} / ${inlineCode(numStr(maxHealth))}\n${EMOJICONFIG.attack} Attack: ${inlineCode(numStr(playerStats.player.attack))}\n${EMOJICONFIG.shield2} Defense: ${inlineCode(numStr(playerStats.player.defense))}\n${EMOJICONFIG.shieldblockagain} Dodge Chance: ${inlineCode(playerStats.player.dodge + '%')}\n${EMOJICONFIG.attack6} Penetration: ${inlineCode(playerStats.player.penetration + '%')}\n${EMOJICONFIG.shieldblockagain} Critical Chance: ${inlineCode(playerStats.player.crit + '%')}\n${EMOJICONFIG.attack} Life Steal: ${inlineCode(playerStats.player.lifeSteal + "%")}`, inline: true },
            { name: `**${EMOJICONFIG.speech} Others :**\n`, value: `${EMOJICONFIG.paper} Energy: ${inlineCode(playerStats.player.energy)}\n${EMOJICONFIG.attack6} Monster killed: ${inlineCode(playerStats.player.other.monsterKill)}\n${EMOJICONFIG.hellspawn} Active Pet: ${inlineCode(playerStats.player.activePet.nickname || playerStats.player.activePet.name || 'none')}\n${EMOJICONFIG.hellspawn} Pets: ${inlineCode(playerStats.player.pets.length.toString())}\n${EMOJICONFIG.coinchest} Top.gg Votes: ${inlineCode(playerStats.player.other.topggVotes)}\n${EMOJICONFIG.coinchest} Top.gg Streak: ${inlineCode(playerStats.player.other.topggStreak)}\n${EMOJICONFIG.necromancy} Endless Tower: ${inlineCode(playerStats.player.other.towerFloor)}`, inline: true },
            { name: `**${EMOJICONFIG.scroll4} Boxes :**\n`, value: `${EMOJICONFIG.coinchest} Common Box: ${inlineCode(playerStats.player.other.box)}\n${EMOJICONFIG.coinchest} Rare Box: ${inlineCode(playerStats.player.other.rarebox)}\n${EMOJICONFIG.coinchest} Top.gg Box: ${inlineCode(playerStats.player.other.topggbox)}\n${EMOJICONFIG.coinchest} Pet Box: ${inlineCode(playerStats.player.other.petbox)}\n${EMOJICONFIG.coinchest} Ore Pack: ${inlineCode(playerStats.player.other.orepack)}\n${EMOJICONFIG.coinchest} Fish Pack: ${inlineCode(playerStats.player.other.fishpack)}\n${EMOJICONFIG.coinchest} Log Pack: ${inlineCode(playerStats.player.other.logpack)}\n `, inline: true },
          )
          .setTimestamp();

      }
    }

  
  var messageEmbed = await message.reply({ embeds: [statsEmbed], components: [new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('showProfile').setLabel('Profile').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('showSkills').setLabel('Skills').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('cooldowns').setLabel('Cooldowns').setStyle(ButtonStyle.Secondary)
  
    )] });
    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = messageEmbed.createMessageComponentCollector({ filter, time: 180000 });

  
  collector.on('collect', async (interaction) => {
        if (!interaction.isButton()) return;
  
    if (interaction.customId === 'showSkills') {
      let skillsEmbed = new Discord.EmbedBuilder()
        .setColor('#fc9803')
        .setTitle(`${user.username}'s Skills`)
        .addFields(
          { name: `${EMOJICONFIG.fish22} **Fishing** :`, value: `${inlineCode('Level: ' + playerStats.player.fishing.level.toString())}\n${inlineCode('XP: ' + playerStats.player.fishing.xp.toString())}\n${inlineCode('XP to next level: ' + (playerStats.player.fishing.level === 120 ? 0 : xpToNextLevel(playerStats.player.fishing.level) - playerStats.player.fishing.xp).toString())}\n${inlineCode('Total XP: ' + playerStats.player.fishing.totalxp.toString())}`, inline: true },
          { name: `${EMOJICONFIG.cookedmeat} **Cooking** :`, value: `${inlineCode('Level: ' + playerStats.player.cooking.level.toString())}\n${inlineCode('XP: ' + playerStats.player.cooking.xp.toString())}\n${inlineCode('XP to next level: ' + (playerStats.player.cooking.level === 120 ? 0 : xpToNextLevel(playerStats.player.cooking.level) - playerStats.player.cooking.xp).toString())}\n${inlineCode('Total XP: ' + playerStats.player.cooking.totalxp.toString())}`, inline: true },
          { name: `${EMOJICONFIG.wood2} **Woodcutting** :`, value: `${inlineCode('Level: ' + playerStats.player.woodcutting.level.toString())}\n${inlineCode('XP: ' + playerStats.player.woodcutting.xp.toString())}\n${inlineCode('XP to next level: ' + (playerStats.player.woodcutting.level === 120 ? 0 : xpToNextLevel(playerStats.player.woodcutting.level) - playerStats.player.woodcutting.xp).toString())}\n${inlineCode('Total XP: ' + playerStats.player.woodcutting.totalxp.toString())}`, inline: true },
          { name: `${EMOJICONFIG.pickaxe2} **Mining** :`, value: `${inlineCode('Level: ' + playerStats.player.mining.level.toString())}\n${inlineCode('XP: ' + playerStats.player.mining.xp.toString())}\n${inlineCode('XP to next level: ' + (playerStats.player.mining.level === 120 ? 0 : xpToNextLevel(playerStats.player.mining.level) - playerStats.player.mining.xp).toString())}\n${inlineCode('Total XP: ' + playerStats.player.mining.totalxp.toString())}`, inline: true },
          { name: `${EMOJICONFIG.hammer2} **Smithing** :`, value: `${inlineCode('Level: ' + playerStats.player.smithing.level.toString())}\n${inlineCode('XP: ' + playerStats.player.smithing.xp.toString())}\n${inlineCode('XP to next level: ' + (playerStats.player.smithing.level === 120 ? 0 : xpToNextLevel(playerStats.player.smithing.level) - playerStats.player.smithing.xp).toString())}\n${inlineCode('Total XP: ' + playerStats.player.smithing.totalxp.toString())}`, inline: true },
          { name: `${EMOJICONFIG.orb} **Magic** :`, value: `${inlineCode('Level: ' + playerStats.player.magic.level.toString())}\n${inlineCode('XP: ' + playerStats.player.magic.xp.toString())}\n${inlineCode('XP to next level: ' + (playerStats.player.magic.level === 120 ? 0 : xpToNextLevel(playerStats.player.magic.level) - playerStats.player.magic.xp).toString())}\n${inlineCode('Total XP: ' + playerStats.player.magic.totalxp.toString())}`, inline: true },
          { name: `${EMOJICONFIG.totem} **Crafting** :`, value: `${inlineCode('Level: ' + playerStats.player.crafting.level.toString())}\n${inlineCode('XP: ' + playerStats.player.crafting.xp.toString())}\n${inlineCode('XP to next level: ' + (playerStats.player.crafting.level === 120 ? 0 : xpToNextLevel(playerStats.player.crafting.level) - playerStats.player.crafting.xp).toString())}\n${inlineCode('Total XP: ' + playerStats.player.crafting.totalxp.toString())}`, inline: true },
          { name: `${EMOJICONFIG.hellspawn} **Taming** :`, value: `${inlineCode('Level: ' + playerStats.player.taming.level.toString())}\n${inlineCode('XP: ' + playerStats.player.taming.xp.toString())}\n${inlineCode('XP to next level: ' + (playerStats.player.taming.level === 120 ? 0 : xpToNextLevel(playerStats.player.taming.level) - playerStats.player.taming.xp).toString())}\n${inlineCode('Total XP: ' + playerStats.player.taming.totalxp.toString())}`, inline: true },
          { name: `${EMOJICONFIG.boots2} **Agility** :`, value: `${inlineCode('Level: ' + playerStats.player.agility.level.toString())}\n${inlineCode('XP: ' + playerStats.player.agility.xp.toString())}\n${inlineCode('XP to next level: ' + (playerStats.player.agility.level === 120 ? 0 : xpToNextLevel(playerStats.player.agility.level) - playerStats.player.agility.xp).toString())}\n${inlineCode('Total XP: ' + playerStats.player.agility.totalxp.toString())}`, inline: true },
          { name: `${EMOJICONFIG.necromancy} **Slayer** :`, value: `${inlineCode('Level: ' + playerStats.player.slayer.level.toString())}\n${inlineCode('XP: ' + playerStats.player.slayer.xp.toString())}\n${inlineCode('XP to next level: ' + (playerStats.player.slayer.level === 120 ? 0 : xpToNextLevel(playerStats.player.slayer.level) - playerStats.player.slayer.xp).toString())}\n${inlineCode('Total XP: ' + playerStats.player.slayer.totalxp.toString())}`, inline: true },
          { name: `${EMOJICONFIG.hoe2} **Farming** :`, value: `${inlineCode('Level: ' + playerStats.player.farming.level.toString())}\n${inlineCode('XP: ' + playerStats.player.farming.xp.toString())}\n${inlineCode('XP to next level: ' + (playerStats.player.farming.level === 120 ? 0 : xpToNextLevel(playerStats.player.farming.level) - playerStats.player.farming.xp).toString())}\n${inlineCode('Total XP: ' + playerStats.player.farming.totalxp.toString())}`, inline: true },
          )
        .setTimestamp();
  
      await interaction.update({ embeds: [skillsEmbed] });
      
    }
    if (interaction.customId === 'cooldowns') {
      const shuffleTimes = {
        beg: 3600000,
        daily: 8.64e7,
        worldBoss: 8.64e7,
        guildReward: 8.64e7,
        guildAttack: 8.64e7,
        guildRaid: 8.64e7,
        motherload: 8.64e7,
        barbarian: 8.64e7,
        emberforest: 8.64e7,
        dungeon: 30000,
        catchpet:30000,
        trainpet: 900000,
        gathering: 30000,
        funkyfarm: 8.64e7,
        nightmare: 8.64e7,

    };
  
    const cooldownKeys = {
        beg: '**Begging**',
        daily: '**Daily Reward**',
        worldBoss: '**World Boss Attack**',
        guildReward: '**Guild Reward**',
        guildRaid: '**Guild Raid** (Guild Leader Only)',
        guildAttack: '**Guild Attack** (Guild Leader Only)',
        motherload: '**Motherload Mine**',
        barbarian: '**Barbarian Fishing**',
        emberforest: '**Ember Forest**',
        funkyfarm: '**Funky Farm**',
        nightmare: '**Nightmare Zone**',
        skilling: '**Skilling**',
        fighting: '**Fighting**',
        gathering: '**Gathering**',
        dungeon: '**Dungeon**',
        catchpet: '** Catch Pet**',
        trainpet: '** Train Pet**' 
  
    };
  
  
    let cooldownMessages = [];
    for (const [key, name] of Object.entries(cooldownKeys)) { 
      if (playerStats.player.cooldowns[key]) {
          let cooldownTimestamp;
          if (key === 'fighting' || key === 'skilling') {
              const cooldownData = playerStats.player.cooldowns[key];
              cooldownTimestamp = cooldownData.timestamp + cooldownData.duration;
          } else {
              cooldownTimestamp = playerStats.player.cooldowns[key].getTime() + shuffleTimes[key];
          }
  
          const currentTime = new Date().getTime();
          const timeDifference = cooldownTimestamp - currentTime;
  
          if (timeDifference > 0) {
              const timeLeft = convertMillisecondsToTime(timeDifference);
              cooldownMessages.push(`${name}: ${inlineCode(timeLeft)}`);
          } else {
              cooldownMessages.push(`${name}: ${inlineCode('Ready')}`);
          }
      } 
  }
      
      function convertMillisecondsToTime(milliseconds) {
          let seconds = Math.floor(milliseconds / 1000);
          let minutes = Math.floor(seconds / 60);
          seconds = seconds % 60;
          let hours = Math.floor(minutes / 60);
          minutes = minutes % 60;
          return `${hours}h ${minutes}m ${seconds}s`;
      }

      let cooldownsEmbed = new Discord.EmbedBuilder()
        .setColor('#fc9803')
        .setTitle(`${user.username}'s Cooldowns`)
        .setDescription(cooldownMessages.join('\n\n'))
        .setTimestamp();
        await interaction.update({ embeds: [cooldownsEmbed] });
    }
    if (interaction.customId === 'showProfile') {
      await interaction.update({ embeds: [statsEmbed] });
    }
    
  });
  

  } else {
    /**=== Account Stats Other ===*/
    let playerStats2 = await PLAYERDATA.findOne({ userId: userInput.id });
    if (!playerStats2) return message.reply(`${EMOJICONFIG.no} this user is not player !`);
    else {

      /**=== Account Economie Other ===*/
      let balance2 = await BALANCEDATA.findOne({ userId: userInput.id });
      if (!balance2) return message.reply(`${EMOJICONFIG.no} this user is not player !`);
      else {

        var squadMessage = ``
        var partyMessage = ``
        if(playerStats2.player.other.squadName == 'undefined'){
          squadMessage = 'No Guild'
        } else {
          let squad = await SQUADDATA.findOne({ squadName: playerStats2.player.other.squadName });
          if(squad.leader[0] == userInput.id) squadMessage = `${playerStats2.player.other.squadName} (leader)`
          else squadMessage = `${playerStats2.player.other.squadName} (member)`
        };

        if(playerStats2.player.other.partyName == 'undefined'){
          partyMessage = 'Not in a Party'
          } else {
            let party = await PARTYDATA.findOne({ partyName: playerStats2.player.other.partyName });
            if(party.leader[0] == user.id) partyMessage = `${playerStats2.player.other.partyName} (leader)`
            else partyMessage = `${playerStats2.player.other.partyName} (member)`
          };



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
      const playerLevel = playerStats2.player.level;
      const maxHealth = configLevel[`level${playerLevel}`].stats.health;


        var statsEmbed = new Discord.EmbedBuilder()
          .setColor('#fc9803')
          .setTitle(`${userInput.username}'s Stats`)
          .addFields(
            { name: `**${EMOJICONFIG.scroll4} Info :**\n`, value: `${EMOJICONFIG.paper} Level: ${inlineCode(playerStats2.player.level)}\n${EMOJICONFIG.attack6} ELO: ${inlineCode(playerStats2.player.elo)}\n${EMOJICONFIG.hellspawn} Pet ELO: ${inlineCode(playerStats2.player.petelo)}\n${EMOJICONFIG.map} Area: ${inlineCode(playerStats2.player.other.area)}\n${EMOJICONFIG.helmet} Ironman: ${inlineCode(playerStats2.player.other.ironman ? 'yes' : 'no')}`, inline: true },
            { name: `**${EMOJICONFIG.coinchest} Balance :**\n`, value: `${EMOJICONFIG.coin}: ${inlineCode(numStr(balance2.eco.coins))}\n${EMOJICONFIG.xp}: ${inlineCode(numStr(balance2.eco.xp))}\n${EMOJICONFIG.xp} Needed: ${inlineCode(numStr((xpToNextLevel(playerStats2.player.level) - balance2.eco.xp)))}\n${EMOJICONFIG.xp} Total: ${inlineCode(numStr(balance2.eco.totalxp))} `, inline: true },
            { name: `**${EMOJICONFIG.scroll4} Groups :**\n`, value: `${EMOJICONFIG.paper} Guild: ${inlineCode(squadMessage)}\n${EMOJICONFIG.paper} Party: ${inlineCode(partyMessage)}`, inline: true },
            { name: `**${EMOJICONFIG.paper} Stats :**\n`, value: `${EMOJICONFIG.heart} Health: ${inlineCode(numStr(playerStats2.player.health))} / ${inlineCode(numStr(maxHealth))}\n${EMOJICONFIG.attack} Attack: ${inlineCode(numStr(playerStats2.player.attack))}\n${EMOJICONFIG.shield2} Defense: ${inlineCode(numStr(playerStats2.player.defense))}\n${EMOJICONFIG.shieldblockagain} Dodge Chance: ${inlineCode(playerStats2.player.dodge + '%')}\n${EMOJICONFIG.attack6} Penetration: ${inlineCode(playerStats2.player.penetration + '%')}\n${EMOJICONFIG.shieldblockagain} Critical Chance: ${inlineCode(playerStats2.player.crit + '%')}\n${EMOJICONFIG.attack} Life Steal: ${inlineCode(playerStats2.player.lifeSteal + "%")}`, inline: true },
            { name: `**${EMOJICONFIG.speech} Others :**\n`, value: `${EMOJICONFIG.paper} Energy: ${inlineCode(playerStats2.player.energy)}\n${EMOJICONFIG.attack6} Monster killed: ${inlineCode(playerStats2.player.other.monsterKill)}\n${EMOJICONFIG.hellspawn} Active Pet: ${inlineCode(playerStats2.player.activePet.nickname || playerStats2.player.activePet.name || 'none')}\n${EMOJICONFIG.hellspawn} Pets: ${inlineCode(playerStats2.player.pets.length.toString())}`, inline: true },
            { name: `**${EMOJICONFIG.scroll4} Boxes :**\n`, value: `${EMOJICONFIG.coinchest} Common Box: ${inlineCode(playerStats2.player.other.box)}\n${EMOJICONFIG.coinchest} Rare Box: ${inlineCode(playerStats2.player.other.rarebox)}\n${EMOJICONFIG.coinchest} Top.gg Box: ${inlineCode(playerStats2.player.other.topggbox)}\n${EMOJICONFIG.coinchest} Pet Box: ${inlineCode(playerStats2.player.other.petbox)}\n${EMOJICONFIG.coinchest} Ore Pack: ${inlineCode(playerStats2.player.other.orepack)}\n${EMOJICONFIG.coinchest} Fish Pack: ${inlineCode(playerStats2.player.other.fishpack)}\n${EMOJICONFIG.coinchest} Log Pack: ${inlineCode(playerStats2.player.other.logpack)}\n `, inline: true },
          )
          .setTimestamp();
        
      };
    };

    var messageEmbed = await message.reply({ embeds: [statsEmbed], components: [new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('showProfile').setLabel('Profile').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('showSkills').setLabel('Skills').setStyle(ButtonStyle.Secondary)
    
      )] });
      const filter = (interaction) => interaction.user.id === message.author.id;
      const collector = messageEmbed.createMessageComponentCollector({ filter, time: 180000 });
  
    
    collector.on('collect', async (interaction) => {
          if (!interaction.isButton()) return;
    
      if (interaction.customId === 'showSkills') {
        let skillsEmbed = new Discord.EmbedBuilder()
          .setColor('#fc9803')
          .setTitle(`${userInput.username}'s Skills`)
          .addFields(
            { name: `${EMOJICONFIG.fish22} **Fishing** :`, value: `${inlineCode('Level: ' + playerStats2.player.fishing.level.toString())}\n${inlineCode('XP: ' + playerStats2.player.fishing.xp.toString())}\n${inlineCode('XP to next level: ' + (xpToNextLevel(playerStats2.player.fishing.level) - playerStats2.player.fishing.xp).toString())}\n${inlineCode('Total XP: ' + playerStats2.player.fishing.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.cookedmeat} **Cooking** :`, value: `${inlineCode('Level: ' + playerStats2.player.cooking.level.toString())}\n${inlineCode('XP: ' + playerStats2.player.cooking.xp.toString())}\n${inlineCode('XP to next level: ' + (xpToNextLevel(playerStats2.player.cooking.level) - playerStats2.player.cooking.xp).toString())}\n${inlineCode('Total XP: ' + playerStats2.player.cooking.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.wood2} **Woodcutting** :`, value: `${inlineCode('Level: ' + playerStats2.player.woodcutting.level.toString())}\n${inlineCode('XP: ' + playerStats2.player.woodcutting.xp.toString())}\n${inlineCode('XP to next level: ' + (xpToNextLevel(playerStats2.player.woodcutting.level) - playerStats2.player.woodcutting.xp).toString())}\n${inlineCode('Total XP: ' + playerStats2.player.woodcutting.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.pickaxe2} **Mining** :`, value: `${inlineCode('Level: ' + playerStats2.player.mining.level.toString())}\n${inlineCode('XP: ' + playerStats2.player.mining.xp.toString())}\n${inlineCode('XP to next level: ' + (xpToNextLevel(playerStats2.player.mining.level) - playerStats2.player.mining.xp).toString())}\n${inlineCode('Total XP: ' + playerStats2.player.mining.totalxp.toString())}`, inline: true } ,       
            { name: `${EMOJICONFIG.hammer2} **Smithing** :`, value: `${inlineCode('Level: ' + playerStats2.player.smithing.level.toString())}\n${inlineCode('XP: ' + playerStats2.player.smithing.xp.toString())}\n${inlineCode('XP to next level: ' + (xpToNextLevel(playerStats2.player.smithing.level) - playerStats2.player.smithing.xp).toString())}\n${inlineCode('Total XP: ' + playerStats2.player.smithing.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.orb} **Magic** :`, value: `${inlineCode('Level: ' + playerStats2.player.magic.level.toString())}\n${inlineCode('XP: ' + playerStats2.player.magic.xp.toString())}\n${inlineCode('XP to next level: ' + (xpToNextLevel(playerStats2.player.magic.level) - playerStats2.player.magic.xp).toString())}\n${inlineCode('Total XP: ' + playerStats2.player.magic.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.totem} **Crafting** :`, value: `${inlineCode('Level: ' + playerStats2.player.crafting.level.toString())}\n${inlineCode('XP: ' + playerStats2.player.crafting.xp.toString())}\n${inlineCode('XP to next level: ' + (xpToNextLevel(playerStats2.player.crafting.level) - playerStats2.player.crafting.xp).toString())}\n${inlineCode('Total XP: ' + playerStats2.player.crafting.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.hellspawn} **Taming** :`, value: `${inlineCode('Level: ' + playerStats2.player.taming.level.toString())}\n${inlineCode('XP: ' + playerStats2.player.taming.xp.toString())}\n${inlineCode('XP to next level: ' + (xpToNextLevel(playerStats2.player.taming.level) - playerStats2.player.taming.xp).toString())}\n${inlineCode('Total XP: ' + playerStats2.player.taming.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.boots2} **Agility** :`, value: `${inlineCode('Level: ' + playerStats2.player.agility.level.toString())}\n${inlineCode('XP: ' + playerStats2.player.agility.xp.toString())}\n${inlineCode('XP to next level: ' + (xpToNextLevel(playerStats2.player.agility.level) - playerStats2.player.agility.xp).toString())}\n${inlineCode('Total XP: ' + playerStats2.player.agility.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.necromancy} **Slayer** :`, value: `${inlineCode('Level: ' + playerStats2.player.slayer.level.toString())}\n${inlineCode('XP: ' + playerStats2.player.slayer.xp.toString())}\n${inlineCode('XP to next level: ' + (xpToNextLevel(playerStats2.player.slayer.level) - playerStats2.player.slayer.xp).toString())}\n${inlineCode('Total XP: ' + playerStats2.player.slayer.totalxp.toString())}`, inline: true },
            { name: `${EMOJICONFIG.hoe2} **Farming** :`, value: `${inlineCode('Level: ' + playerStats2.player.farming.level.toString())}\n${inlineCode('XP: ' + playerStats2.player.farming.xp.toString())}\n${inlineCode('XP to next level: ' + (xpToNextLevel(playerStats2.player.farming.level) - playerStats2.player.farming.xp).toString())}\n${inlineCode('Total XP: ' + playerStats2.player.farming.totalxp.toString())}`, inline: true },



            )
          .setTimestamp();
    
        await interaction.update({ embeds: [skillsEmbed] });
        
      }
      if (interaction.customId === 'showProfile') {
        await interaction.update({ embeds: [statsEmbed] });
      }
      
    });
  

  };
};
  },
info: {
  names: ['profile', 'user', 'p'],
}
}
