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
    .setTitle(`${EMOJICONFIG.question} Help - Eternals`)
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
                categoryEmbed.addFields({ name: `${EMOJICONFIG.paper} Profile`, value: `${inlineCode("@Eternals action")} - Select an option to fight or skill\n${inlineCode("@Eternals start")} - Create your character\n${inlineCode("@Eternals start ironman as an ironman")} - Create your character\n ${inlineCode("@Eternals profile")} - View your profile\n ${inlineCode("@Eternals daily")} - Get a daily reward\n ${inlineCode("@Eternals balance")} - View your coin balance\n ${inlineCode("@Eternals inv")} - View your inventory and equipped items\n ${inlineCode("@Eternals leaderboard")} - View leaderboards`});
                break;
            case 'fighting':
                categoryEmbed.addFields({name: `${EMOJICONFIG.attack} Fighting` ,value: `${inlineCode("@Eternals action")} - Select an option to fight or skill\n${inlineCode("@Eternals fight")} - Fight a monster\n${inlineCode("@Eternals df <dungeon name>")} - Fight a dungeon\n${inlineCode("@Eternals dungeon")} - UI Dropdown to select a dungeon to fight\n${inlineCode("@Eternals eat <fish> <amount>")} - Eat Food\n${inlineCode("@Eternals drink <potion>")} - Drink a potion\n${inlineCode("@Eternals boss")} - View Current World Boss\n ${inlineCode("@Eternals boss attack")} - Attack World Boss\n ${inlineCode("@Eternals boss all")} - List all World Bosses\n ${inlineCode("@Eternals duel <@user> <stake amount>")} - Duel another user to risk ELO and Coins\n ${inlineCode("@Eternals brawl <@user>")} - Brawl another user to risk ELO and Coins\n${inlineCode("@Eternals slayer")} - Get a slaying contract to get rewards killing monsters `});
                break;
            case 'skilling':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.fishpole} Skilling`, value: `${inlineCode("@Eternals skills")} - View your level and xp in all skills\n${inlineCode("@Eternals skills inv")} - View your skills inventory\n${inlineCode("@Eternals fish")} - Catch Fish\n${inlineCode("@Eternals cook <fish>")} - Cook Fish\n${inlineCode("@Eternals chop")} - Chop Trees\n${inlineCode("@Eternals mine")} - Mine Ore\n${inlineCode("@Eternals smelt <bar>")} - Smelt Ore into Bars\n${inlineCode("@Eternals smith <item>")} -Smith Bars into Items\n${inlineCode("@Eternals alch <item>")} - Alch items into coins\n${inlineCode("@Eternals craft <totem>")} - Craft a totem to enter dungeons\n${inlineCode("@Eternals lap")} - Run the agility course in your area\n${inlineCode("@Eternals farm")} - View your farm\n${inlineCode("@Eternals farm plant <seed> <amount/all>")} - Plant seeds in your farm\n${inlineCode("@Eternals farm harvest")} - Harvest crops on your farm\n${inlineCode("@Eternals brew <potion>")} - Brew a potion`});
              break;
            case 'idle':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.hook4} Idle Skills`, value: `${inlineCode("@Eternals idle fish")} - Idle Fish\n${inlineCode("@Eternals idle mine")} - Idle Mine\n${inlineCode("@Eternals idle chop")} - Idle Chop\n${inlineCode("@Eternals idle fight")} - Idle Fight Monsters\n${inlineCode("@Eternals idle lap")} - Idle run the agility course in your area`});
              break;
            case 'items':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.coinchest} Items`, value: `${inlineCode("@Eternals inv")} - View Your Inventory and Equipped Items\n${inlineCode("@Eternals bank")} - View Your Bank\n${inlineCode("@Eternals bank deposit (coins / item alias) (amount)")} - Deposit Items or Coins into your Bank\n${inlineCode("@Eternals bank withdraw (coins / item alias) (amount)")} - Withdraw Items or Coins from your Bank\n${inlineCode("@Eternals ge")} - View Items listed for sale. Optionally add item or category to view only those items \n ${inlineCode("@Eternals buy <Item> <Coin Amount> <Item Amount")} - Buy an Item from GE\n ${inlineCode("@Eternals sell <Item> <Coin Amount> <Item Amount>")} - Sell an item on the GE\n${inlineCode("@Eternals delist <Item> <Coin Amount>")} - Delist your item from the GE\n${inlineCode("@Eternals equip <item>")} - Equip an item to a equipment slot\n ${inlineCode("@Eternals unequip <slot number>")} - unequip an item\n ${inlineCode("@Eternals open <common / rare / topgg / orepack / fishpack / logpack / pet> all")} - Open your loot boxes`});
              break;
            case 'guilds':
              categoryEmbed.addFields({ name:`${EMOJICONFIG.shieldblockagain} Guilds`, value: `${inlineCode("@Eternals guild")} - View your guild\n ${inlineCode("@Eternals guild join <guildname>")} - Join a guild\n ${inlineCode("@Eternals guild leave")} - Leave your guild\n ${inlineCode("@Eternals guild create <guildname>")} - Create a guild\n ${inlineCode("@Eternals guild ban <@Player>")} - Ban a player from your guild\n ${inlineCode("@Eternals guild unban <@Player>")} - Unban a player from your guild\n \n${inlineCode("@Eternals guild banned")} - View all banned players${inlineCode("@Eternals guild kick <@Player>")} - Kick a player from your guild\n ${inlineCode("@Eternals guild attack <guildname>")} - Attack another guild\n ${inlineCode("@Eternals guild reward")} - Recieve a daily reward from your guild\n ${inlineCode("@Eternals guild give <coins>")} - Donate to your guild bank\n ${inlineCode("@Eternals guild upgrade <stat> <stat increase amount>")} - Upgrade your guild boss\n${inlineCode("@Eternals guild raid <raid>")} - Start a guild raid\n${inlineCode("@Eternals guild loot <item> @Player")} - Give a guild member raid loot\n${inlineCode("@Eternals guild list")} - List Guilds\n${inlineCode("@Eternals guild inv")} - View your guild inventory\n${inlineCode("@Eternals guild promote @Player")} - Promote a member to officer\n${inlineCode("@Eternals guild demote @Player")} - Demote a member from officer`});
              break;
            case 'party':
              categoryEmbed.addFields({name: `${EMOJICONFIG.shieldflame} Party`, value: `${inlineCode("@Eternals party")} - View your party\n${inlineCode("@Eternals party create")} - Create a party\n${inlineCode("@Eternals party join <partyname>")} - Join a party\n${inlineCode("@Eternals party leave")} - Leave your party\n${inlineCode("@Eternals party ban <@Player>")} - Ban a player from your party\n${inlineCode("@Eternals party unban <@Player>")} - Unban a player from your party\n${inlineCode("@Eternals party banned")} - View all banned players\n${inlineCode("@Eternals party kick <@Player>")} - Kick a player from your party\n${inlineCode("@Eternals party destroy <partyname>")} - Destroy your party\n${inlineCode("@Eternals party list")} - List Parties\n${inlineCode("@Eternals partydungeon")} - Dropdown menu to enter a party dungeon\n${inlineCode("@Eternals pdf <dungeon>")} - Enter a party dungeon`});
              break;
            case 'guildt':
              categoryEmbed.addFields({ name:`${EMOJICONFIG.attack6} Guild Tournament`, value: `${inlineCode("@Eternals tournament create <name>")} - Create a guild tournament\n${inlineCode("@Eternals tournament join <name>")} - Enter your guild into a guild tournament\n${inlineCode("@Eternals tournament start <name>")} - Start the guild tournament\n${inlineCode("@Eternals tournament view <name>")} - view the guild tournament\n${inlineCode("@Eternals tournament list")} - list ongoing guild tournaments`});
              break;
            case 'lists':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.scroll4} Lists`, value: `${inlineCode("@Eternals list fish")} - List all fish\n${inlineCode("@Eternals list food")} - List all food\n${inlineCode("@Eternals list logs")} - List all logs\n${inlineCode("@Eternals list ore")} - List all ore\n${inlineCode("@Eternals list bars")} - List all bars\n${inlineCode("@Eternals list smithing")} - List all smithable items\n${inlineCode("@Eternals list weapon")} - List all Weapons\n${inlineCode("@Eternals list armor")} - List all Armor\n${inlineCode("@Eternals list magic")} - List all magic items\n${inlineCode("@Eternals list areas")} - List all Areas\n${inlineCode("@Eternals list dungeons")} - List all Dungeons\n${inlineCode("@Eternals list partydungeons")} - List all party dungeons\n${inlineCode("@Eternals list raids")} - List all Raids\n${inlineCode("@Eternals list pets")} - List all pets\n${inlineCode("@Eternals list courses")} - List all agility courses\n${inlineCode("@Eternals list seeds")} - List all farming seeds\n${inlineCode("@Eternals list crops")} - List all farming crops\n${inlineCode("@Eternals list potions")} - List all potions`});
              break;
            case 'other':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.speech} Other`, value: `${inlineCode("@Eternals help")} - You are here\n ${inlineCode("@Eternals info")} - Bot Info\n${inlineCode("@Eternals cooldowns")} - View long cooldowns\n${inlineCode("@Eternals beg")} - Beg for coins\n  ${inlineCode("@Eternals delete")} - Delete your account\n ${inlineCode("@Eternals give <@user> <item> <amount>")} - Give an user an item or coins\n${inlineCode("@Eternals roll")} - Roll a number 1 -99`});
              break;
            case 'minigames':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.slime4} Minigames`, value: `${inlineCode("@Eternals mlm")} - Mine in the motherload mine!\n${inlineCode("@Eternals bf")} - Fish in the barbarian village!\n${inlineCode("@Eternals ef")} - Chop tress in the ember forest!\n${inlineCode("@Eternals ff")} - Start a Funky Farm!\n${inlineCode("@Eternals nmz")} - Fight Hoards of Zombies for XP!`});
              break;
            case 'pets':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.hellspawn} Pets`, value: `${inlineCode("@Eternals pets")} - View your pets\n${inlineCode("@Eternals pet catch")} - catch a pet\n${inlineCode("@Eternals pet train <pet alias or nickname>")} - Train a pet\n${inlineCode("@Eternals pet name <pet alias> <nickname>")} - Give your pet a name\n${inlineCode("@Eternals pet select <pet alias/name>")} - Select a pet to use in battle\n${inlineCode("@Eternals pet battle @Player <optional wager amount>")} - Pet battle with another player\n${inlineCode("@Eternals pet give @Player <pet>")} - Give your pet to another player\n${inlineCode("@Eternals pet release <pet>")} - Release your pet back into the wild`});
              break;
            case 'wilderness':
              categoryEmbed.addFields({ name: `${EMOJICONFIG.necromancy} Wilderness`, value: `${inlineCode("@Eternals scout")} - Find players in the wilderness\n${inlineCode("@Eternals lure @Player <amount>")} - Lure a player into the wilderness\n${inlineCode("@Eternals pvp @Player")} - Attack a player in the wilderness\n${inlineCode("@Eternals travel")} - How to travel to the wilderness`});
              break;
        }
    
        await interaction.update({ embeds: [categoryEmbed] });
    }); 
  