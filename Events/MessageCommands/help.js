const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, StringSelectMenuBuilder } = require('discord.js');
const {client} = require('../../App/index.js');
const EMOJICONFIG = require('../../config/emoji.json');
const messageData = new Map();

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.mentions.users.first() !== client.user) return;
    const args = message.content.split(/ +/).slice(1);
    const commandName = args.shift().toLowerCase();
    if (this.info.names.some(name => commandName === name)) {

      const menu = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('help-menu')
            .setPlaceholder('Select a category')
            .addOptions([
                { label: `Profile`, value: 'profile', description:`User Profile`,emoji: `${EMOJICONFIG.paper}` },
                { label: `Fighting`, value: 'fighting', description :`Fighting Monsters/Players`, emoji: `${EMOJICONFIG.attack}` },
                { label: `Wilderness`, value: 'wilderness', description :`Open Area PvP`, emoji: `${EMOJICONFIG.necromancy}` },
                { label: `Skilling`, value: 'skilling', description: `Gathering, Crafting, and other skills`, emoji: `${EMOJICONFIG.fishpole}` },
                { label: `Idle Skills`, value: 'idle', description:`Idle Skills have a longer cooldown but larger rewards`, emoji: `${EMOJICONFIG.hook4}` },
                { label: `Minigames`, value: 'minigames', description:`Minigames`, emoji: `${EMOJICONFIG.slime4}`},
                { label: `Items`, value: 'items', description:`Buy, Sell, Equip, and other item commands`, emoji: `${EMOJICONFIG.coinchest}` },
                { label: `Pets`, value: 'pets', description:`Pet Commands`, emoji: `${EMOJICONFIG.hellspawn}`},
                { label: `Guilds`, value: 'guilds', description:`Guild Commands`, emoji: `${EMOJICONFIG.shieldblockagain}` },
                { label: `Party`, value: 'party', description:`Party Group Commands (Tip: Party members share a fraction of their xp with the rest of the party)`, emoji: `${EMOJICONFIG.shieldflame}` },
                { label: `Guild Tournaments`, value: 'guildt', description:`Guild Tournaments`, emoji: `${EMOJICONFIG.attack6}` },
                { label: `Lists`, value: 'lists', description:`List items and other things`, emoji: `${EMOJICONFIG.scroll4}` },
                { label: `Other`, value: 'other', description:`other commands`, emoji: `${EMOJICONFIG.speech}` }

            ]),
    );

    const embed = new EmbedBuilder()
    .setColor('#cda744')
    .setTitle(`${EMOJICONFIG.question} Help - FlipMMO`)
    .setDescription('Select a category to see the commands.');

    const sentMessage = await message.reply({ embeds: [embed], components: [menu] });
    messageData.set(sentMessage.id, { message, menu });

          } 
        },
        info: {
          names: ['help', 'h'],
      }
      
      }

      client.on('interactionCreate', async interaction => {
        if (!interaction.isMessageComponent() || interaction.customId !== 'help-menu') return;
        const data = messageData.get(interaction.message.id);
        if (!data) return;

        const category = interaction.values[0];
        const categoryEmbed = new EmbedBuilder()
          .setColor('#cda744')
          .setTitle(`${EMOJICONFIG.question} Help - ${category}`);
          switch (category) {
            case 'profile':
                categoryEmbed.addFields({ name: `${EMOJICONFIG.paper} Profile`, value: `${inlineCode("@FlipMMO action")} - Select an option to fight or skill\n${inlineCode("@FlipMMO start")} - Create your character\n${inlineCode("@FlipMMO start ironman as an ironman")} - Create your character\n ${inlineCode("@FlipMMO profile")} - View your profile\n ${inlineCode("@FlipMMO daily")} - Get a daily reward\n ${inlineCode("@FlipMMO balance")} - View your coin balance\n ${inlineCode("@FlipMMO inv")} - View your inventory and equipped items\n ${inlineCode("@FlipMMO leaderboard")} - View leaderboards`});
                break;
            case 'fighting':
                categoryEmbed.addFields({name: `${EMOJICONFIG.attack} Fighting` ,value: `${inlineCode("@FlipMMO action")} - Select an option to fight or skill\n${inlineCode("@FlipMMO fight")} - Fight a monster\n${inlineCode("@FlipMMO df <dungeon name>")} - Fight a dungeon\n${inlineCode("@FlipMMO dungeon")} - UI Dropdown to select a dungeon to fight\n${inlineCode("@FlipMMO eat <fish> <amount>")} - Eat Food\n${inlineCode("@FlipMMO drink <potion>")} - Drink a potion\n${inlineCode("@FlipMMO boss")} - View Current World Boss\n ${inlineCode("@FlipMMO boss attack")} - Attack World Boss\n ${inlineCode("@FlipMMO boss all")} - List all World Bosses\n ${inlineCode("@FlipMMO duel <@user> <stake amount>")} - Duel another user to risk ELO and Coins\n ${inlineCode("@FlipMMO brawl <@user>")} - Brawl another user to risk ELO and Coins\n${inlineCode("@FlipMMO slayer")} - Get a slaying contract to get rewards killing monsters `});
                break;
            case 'skilling':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.fishpole} Skilling`, value: `${inlineCode("@FlipMMO skills")} - View your level and xp in all skills\n${inlineCode("@FlipMMO skills inv")} - View your skills inventory\n${inlineCode("@FlipMMO fish")} - Catch Fish\n${inlineCode("@FlipMMO cook <fish>")} - Cook Fish\n${inlineCode("@FlipMMO chop")} - Chop Trees\n${inlineCode("@FlipMMO mine")} - Mine Ore\n${inlineCode("@FlipMMO smelt <bar>")} - Smelt Ore into Bars\n${inlineCode("@FlipMMO smith <item>")} -Smith Bars into Items\n${inlineCode("@FlipMMO alch <item>")} - Alch items into coins\n${inlineCode("@FlipMMO craft <totem>")} - Craft a totem to enter dungeons\n${inlineCode("@FlipMMO lap")} - Run the agility course in your area\n${inlineCode("@FlipMMO farm")} - View your farm\n${inlineCode("@FlipMMO farm plant <seed> <amount/all>")} - Plant seeds in your farm\n${inlineCode("@FlipMMO farm harvest")} - Harvest crops on your farm\n${inlineCode("@FlipMMO brew <potion>")} - Brew a potion`});
              break;
            case 'idle':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.hook4} Idle Skills`, value: `${inlineCode("@FlipMMO idle fish")} - Idle Fish\n${inlineCode("@FlipMMO idle mine")} - Idle Mine\n${inlineCode("@FlipMMO idle chop")} - Idle Chop\n${inlineCode("@FlipMMO idle fight")} - Idle Fight Monsters\n${inlineCode("@FlipMMO idle lap")} - Idle run the agility course in your area`});
              break;
            case 'items':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.coinchest} Items`, value: `${inlineCode("@FlipMMO inv")} - View Your Inventory and Equipped Items\n${inlineCode("@FlipMMO bank")} - View Your Bank\n${inlineCode("@FlipMMO bank deposit (coins / item alias) (amount)")} - Deposit Items or Coins into your Bank\n${inlineCode("@FlipMMO bank withdraw (coins / item alias) (amount)")} - Withdraw Items or Coins from your Bank\n${inlineCode("@FlipMMO ge")} - View Items listed for sale. Optionally add item or category to view only those items \n ${inlineCode("@FlipMMO buy <Item> <Coin Amount> <Item Amount")} - Buy an Item from GE\n ${inlineCode("@FlipMMO sell <Item> <Coin Amount> <Item Amount>")} - Sell an item on the GE\n${inlineCode("@FlipMMO delist <Item> <Coin Amount>")} - Delist your item from the GE\n${inlineCode("@FlipMMO equip <item>")} - Equip an item to a equipment slot\n ${inlineCode("@FlipMMO unequip <slot number>")} - unequip an item\n ${inlineCode("@FlipMMO open <common / rare / topgg / orepack / fishpack / logpack / pet> all")} - Open your loot boxes`});
              break;
            case 'guilds':
              categoryEmbed.addFields({ name:`${EMOJICONFIG.shieldblockagain} Guilds`, value: `${inlineCode("@FlipMMO guild")} - View your guild\n ${inlineCode("@FlipMMO guild join <guildname>")} - Join a guild\n ${inlineCode("@FlipMMO guild leave")} - Leave your guild\n ${inlineCode("@FlipMMO guild create <guildname>")} - Create a guild\n ${inlineCode("@FlipMMO guild ban <@Player>")} - Ban a player from your guild\n ${inlineCode("@FlipMMO guild unban <@Player>")} - Unban a player from your guild\n \n${inlineCode("@FlipMMO guild banned")} - View all banned players${inlineCode("@FlipMMO guild kick <@Player>")} - Kick a player from your guild\n ${inlineCode("@FlipMMO guild attack <guildname>")} - Attack another guild\n ${inlineCode("@FlipMMO guild reward")} - Recieve a daily reward from your guild\n ${inlineCode("@FlipMMO guild give <coins>")} - Donate to your guild bank\n ${inlineCode("@FlipMMO guild upgrade <stat> <stat increase amount>")} - Upgrade your guild boss\n${inlineCode("@FlipMMO guild raid <raid>")} - Start a guild raid\n${inlineCode("@FlipMMO guild loot <item> @Player")} - Give a guild member raid loot\n${inlineCode("@FlipMMO guild list")} - List Guilds\n${inlineCode("@FlipMMO guild inv")} - View your guild inventory\n${inlineCode("@FlipMMO guild promote @Player")} - Promote a member to officer\n${inlineCode("@FlipMMO guild demote @Player")} - Demote a member from officer`});
              break;
            case 'party':
              categoryEmbed.addFields({name: `${EMOJICONFIG.shieldflame} Party`, value: `${inlineCode("@FlipMMO party")} - View your party\n${inlineCode("@FlipMMO party create")} - Create a party\n${inlineCode("@FlipMMO party join <partyname>")} - Join a party\n${inlineCode("@FlipMMO party leave")} - Leave your party\n${inlineCode("@FlipMMO party ban <@Player>")} - Ban a player from your party\n${inlineCode("@FlipMMO party unban <@Player>")} - Unban a player from your party\n${inlineCode("@FlipMMO party banned")} - View all banned players\n${inlineCode("@FlipMMO party kick <@Player>")} - Kick a player from your party\n${inlineCode("@FlipMMO party destroy <partyname>")} - Destroy your party\n${inlineCode("@FlipMMO party list")} - List Parties\n${inlineCode("@FlipMMO partydungeon")} - Dropdown menu to enter a party dungeon\n${inlineCode("@FlipMMO pdf <dungeon>")} - Enter a party dungeon`});
              break;
            case 'guildt':
              categoryEmbed.addFields({ name:`${EMOJICONFIG.attack6} Guild Tournament`, value: `${inlineCode("@FlipMMO tournament create <name>")} - Create a guild tournament\n${inlineCode("@FlipMMO tournament join <name>")} - Enter your guild into a guild tournament\n${inlineCode("@FlipMMO tournament start <name>")} - Start the guild tournament\n${inlineCode("@FlipMMO tournament list <name>")} - view the guild tournament`});
              break;
            case 'lists':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.scroll4} Lists`, value: `${inlineCode("@FlipMMO list fish")} - List all fish\n${inlineCode("@FlipMMO list food")} - List all food\n${inlineCode("@FlipMMO list logs")} - List all logs\n${inlineCode("@FlipMMO list ore")} - List all ore\n${inlineCode("@FlipMMO list bars")} - List all bars\n${inlineCode("@FlipMMO list smithing")} - List all smithable items\n${inlineCode("@FlipMMO list weapon")} - List all Weapons\n${inlineCode("@FlipMMO list armor")} - List all Armor\n${inlineCode("@FlipMMO list magic")} - List all magic items\n${inlineCode("@FlipMMO list areas")} - List all Areas\n${inlineCode("@FlipMMO list dungeons")} - List all Dungeons\n${inlineCode("@FlipMMO list partydungeons")} - List all party dungeons\n${inlineCode("@FlipMMO list raids")} - List all Raids\n${inlineCode("@FlipMMO list pets")} - List all pets\n${inlineCode("@FlipMMO list courses")} - List all agility courses\n${inlineCode("@FlipMMO list seeds")} - List all farming seeds\n${inlineCode("@FlipMMO list crops")} - List all farming crops\n${inlineCode("@FlipMMO list potions")} - List all potions`});
              break;
            case 'other':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.speech} Other`, value: `${inlineCode("@FlipMMO help")} - You are here\n ${inlineCode("@FlipMMO info")} - Bot Info\n${inlineCode("@FlipMMO cooldowns")} - View long cooldowns\n${inlineCode("@FlipMMO beg")} - Beg for coins\n  ${inlineCode("@FlipMMO delete")} - Delete your account\n ${inlineCode("@FlipMMO give <@user> <item> <amount>")} - Give an user an item or coins\n${inlineCode("@FlipMMO roll")} - Roll a number 1 -99`});
              break;
            case 'minigames':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.slime4} Minigames`, value: `${inlineCode("@FlipMMO mlm")} - Mine in the motherload mine!\n${inlineCode("@FlipMMO bf")} - Fish in the barbarian village!\n${inlineCode("@FlipMMO ef")} - Chop tress in the ember forest!\n${inlineCode("@FlipMMO ff")} - Start a Funky Farm!\n${inlineCode("@FlipMMO nmz")} - Fight Hoards of Zombies for XP!`});
              break;
            case 'pets':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.hellspawn} Pets`, value: `${inlineCode("@FlipMMO pets")} - View your pets\n${inlineCode("@FlipMMO pet catch")} - catch a pet\n${inlineCode("@FlipMMO pet train <pet alias or nickname>")} - Train a pet\n${inlineCode("@FlipMMO pet name <pet alias> <nickname>")} - Give your pet a name\n${inlineCode("@FlipMMO pet select <pet alias/name>")} - Select a pet to use in battle\n${inlineCode("@FlipMMO pet battle @Player <optional wager amount>")} - Pet battle with another player\n${inlineCode("@FlipMMO pet give @Player <pet>")} - Give your pet to another player\n${inlineCode("@FlipMMO pet release <pet>")} - Release your pet back into the wild`});
              break;
            case 'wilderness':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.necromancy} Wilderness`, value: `${inlineCode("@FlipMMO scout")} - Find players in the wilderness\n${inlineCode("@FlipMMO lure @Player <amount>")} - Lure a player into the wilderness\n${inlineCode("@FlipMMO pvp @Player")} - Attack a player in the wilderness\n${inlineCode("@FlipMMO travel")} - How to travel to the wilderness`});
              break;
        }
    
        // Update the message with the new embed
        await interaction.update({ embeds: [categoryEmbed] });
    }); 
  