const Marketplace = require('../../modules/marketplace.js');
const Player = require('../../modules/player.js');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const EMOJICONFIG = require('../../config/emoji.json');
const {client} = require('../../App/index.js');

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message) {
      //  if (message.content.toLowerCase().startsWith(prefix.toLowerCase()) && this.info.names.some(name => message.content.toLowerCase().includes(name))) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {
 

    const equipalias = args[0].toUpperCase();
    const price = args[1];
    const user = message.author;

    // Retrieve the marketplace listing
    const listing = await Marketplace.findOne({ itemEa: equipalias, sellerId: user.id, price: price });

    if (!price) return message.reply(`${EMOJICONFIG.no} Error: You must specify a price. Usage: ${inlineCode("@FlipMMO delist <item name> <price>")}`);


    if (!listing) {

        message.reply("Listing Not Found");

        return;

    }    // Check if the user is the lister of the item
    if (listing.sellerId !== user.id) {
        message.reply("You are not the lister of this item.");
        return;
    }


    // Remove the listing from the marketplace
    await Marketplace.deleteOne({ id: listing.id, price: price });

    // Return the item to the user
    let player = await Player.findOne({ userId: user.id });
    if (player.player.other.ironman === true) return message.reply(`${EMOJICONFIG.no} You are an ironman, you can't use the Grand Exchange!`);

    if (!player) {
        message.reply("Player Not Found");
        return;
    }
    if (listing.type === "Item") {
    var itemIndex = player.player.stuff.stuffUnlock.findIndex(item => item.id === listing.itemId);
    var itemFind = player.player.stuff.stuffUnlock.find(item => item.id === listing.itemId);
    }
    else if (listing.type === "Fish") {
    var itemIndex = player.player.stuff.fish.findIndex(fishItem => fishItem.id === listing.itemId);
    var itemFind = player.player.stuff.fish.find(fishItem => fishItem.id === listing.itemId);
    }
    else if (listing.type === "Food") {
    var itemIndex = player.player.stuff.food.findIndex(foodItem => foodItem.id === listing.itemId);
    var itemFind = player.player.stuff.food.find(foodItem => foodItem.id === listing.itemId);
    }
    else if (listing.type === "Logs") {
    var itemIndex = player.player.stuff.logs.findIndex(logItem => logItem.id === listing.itemId);
    var itemFind = player.player.stuff.logs.find(logItem => logItem.id === listing.itemId);
    }
    else if (listing.type === "Ore") {
    var itemIndex = player.player.stuff.ore.findIndex(oreItem => oreItem.id === listing.itemId);
    var itemFind = player.player.stuff.ore.find(oreItem => oreItem.id === listing.itemId);
    }
    else if (listing.type === "Bars") {
    var itemIndex = player.player.stuff.bars.findIndex(barsItem => barsItem.id === listing.itemId);
    var itemFind = player.player.stuff.bars.find(barsItem => barsItem.id === listing.itemId);
    }
    else if (listing.type === "Totems") {
    var itemIndex = player.player.stuff.gem.findIndex(gemItem => gemItem.id === listing.itemId);
    var itemFind = player.player.stuff.gem.find(gemItem => gemItem.id === listing.itemId);
    }
    else if (listing.type === "Seeds") {
    var itemIndex = player.player.stuff.seeds.findIndex(seedItem => seedItem.id === listing.itemId);
    var itemFind = player.player.stuff.seeds.find(seedItem => seedItem.id === listing.itemId);
    }
    else if (listing.type === "Crops") {
    var itemIndex = player.player.stuff.crops.findIndex(cropItem => cropItem.id === listing.itemId);
    var itemFind = player.player.stuff.crops.find(cropItem => cropItem.id === listing.itemId);
    }
    else if (listing.type === "Potions") {
    var itemIndex = player.player.stuff.potions.findIndex(potionItem => potionItem.id === listing.itemId);
    var itemFind = player.player.stuff.potion.find(potionItem => potionItem.id === listing.itemId);
    }
                
            

    if (itemIndex !== -1) {
        itemFind += listing.amount;
        await player.save();

    } else {
        if (listing.type === "Item") {
        player.player.stuff.stuffUnlock.push({
            id: Number(listing.itemId),
            name: listing.itemName,
            level: 1,
            amount: listing.amount
        });
        await player.save();
    }
        else if (listing.type === "Fish") {
        player.player.stuff.fish.push({
            id: Number(listing.itemId),
            name: listing.itemName,
            amount: listing.amount
        });
        await player.save();
    }
        else if (listing.type === "Food") {
        player.player.stuff.food.push({
            id: Number(listing.itemId),
            name: listing.itemName,
            amount: listing.amount
        });
        await player.save();
    }
    else if (listing.type === "Logs") {
        player.player.stuff.logs.push({
            id: Number(listing.itemId),
            name: listing.itemName,
            amount: listing.amount
        });
        await player.save();
    }
    else if (listing.type === "Ore") {
        player.player.stuff.ore.push({
            id: Number(listing.itemId),
            name: listing.itemName,
            amount: listing.amount
        });
        await player.save();
    }
    else if (listing.type === "Bars") {
        player.player.stuff.bars.push({
            id: Number(listing.itemId),
            name: listing.itemName,
            amount: listing.amount
        });
        await player.save();
    }
    else if (listing.type === "Totems") {
        player.player.stuff.gem.push({
            id: Number(listing.itemId),
            name: listing.itemName,
            amount: listing.amount
        });
        await player.save();
    }
    else if (listing.type === "Seeds") {
        player.player.stuff.seeds.push({
            id: Number(listing.itemId),
            name: listing.itemName,
            amount: listing.amount
        });
        await player.save();
    }
    else if (listing.type === "Crops") {
        player.player.stuff.crops.push({
            id: Number(listing.itemId),
            name: listing.itemName,
            amount: listing.amount
        });
        await player.save();
    }
    else if (listing.type === "Potions") {
        player.player.stuff.potions.push({
            id: Number(listing.itemId),
            name: listing.itemName,
            amount: listing.amount
        });
        await player.save();
    }

    }

    

    // Send a confirmation message
    const embed = new EmbedBuilder()
        .setTitle("Item Delisted")
        .setDescription(`You have successfully delisted **${listing.amount}** of the item: **${listing.itemName}**!`)
        .setColor("#4dca4d");
    message.channel.send({ embeds: [embed] });
};
    },
info: {
    names: ['delist', 'dl'],
} }