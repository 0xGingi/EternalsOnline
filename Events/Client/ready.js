const { Events, ActivityType, Client, Status } = require('discord.js')
const { dim, yellow } = require('colors')
const { loadEvents } = require('../../App/Handlers/Events')
const { loadCommands } = require('../../App/Handlers/Commands')
const Player = require('../../modules/player.js');
const resetSkillCD = require('../../scripts/resetskillcd');
const battleGround = require('../../scripts/bg');
const valentines = require('../../scripts/valentines');
module.exports = {
    name: Events.ClientReady,
    async execute(client){
                console.log(`\n${dim('User:')} ${yellow(client.user.tag)}\n`)
                console.log(`${dim('-----------------------------------------------------------')}`)
                console.log(`\n${dim('Developed by:')} ${yellow('0xGingi | https://github.com/0xGingi ')}`)
           
                
                await Player.updateMany({}, { $set: { 'player.isFishing': false } });
                await Player.updateMany({}, { $set: { 'player.isCooking': false } });
                await resetSkillCD();
                await battleGround();
    }
}