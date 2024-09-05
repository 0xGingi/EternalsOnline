const { Events, ActivityType, Client, Status } = require('discord.js')
const { dim, yellow } = require('colors')
const { loadEvents } = require('../../App/Handlers/Events')
const { loadCommands } = require('../../App/Handlers/Commands')
const Player = require('../../modules/player.js');
const resetSkillCD = require('../../scripts/resetskillcd');
const battleGround = require('../../scripts/bg');
module.exports = {
    name: Events.ClientReady,
    async execute(client){
    }
}