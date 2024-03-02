//Importing all needed Commands
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const colors = require("colors"); //this Package is used, to change the colors of our Console! (optional and doesnt effect performance)
const fs = require("fs"); //this package is for reading files and getting their inputs
const config = require("./botconfig/config.json");
const ee = require("./botconfig/embed.json");
const moment = require('moment-timezone');
const cron = require('node-cron');

//Creating the Discord.js Client for This Bot with some default settings ;) and with partials, so you can fetch OLD messages
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessageTyping,
        Discord.GatewayIntentBits.MessageContent,
    ],
    messageCacheLifetime: 60,
    fetchAllMembers: false,
    messageCacheMaxSize: 10,
    restTimeOffset: 0,
    restWsBridgetimeout: 100,
    disableEveryone: true,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILDS']
});

//login into the bot
client.login(config.token);
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // getCommands();
    deleteCommandByName('template');
    // deleteCommandById('1213443940796203080', 'template');
});

async function deleteCommandById(commandId, commandName) {
    try {
        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v10');
        console.log('Deleting: ' + commandName)

        const rest = new REST({ version: '10' }).setToken(config.token);
        rest.delete(Routes.applicationCommand(config.applicationid, commandId))
            .then((response) => { console.log(response), console.log('Successful: ID ' + commandId) })
            .catch((error) => console.log(error));

    } catch (error) {
        console.log(error);
    };
}

async function deleteCommandById(commandId) {
    try {
        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v10');

        const rest = new REST({ version: '10' }).setToken(config.token);
        rest.delete(Routes.applicationCommand(config.applicationid, commandId))
            .then((response) => { console.log(response), console.log('Deleted: Id ' + commandId) })
            .catch((error) => console.log(error));

    } catch (error) {
        console.log(error);
    };
}

async function getCommands() {
    try {
        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v10');

        const rest = new REST({ version: '10' }).setToken(config.token);
        rest.get(Routes.applicationCommands(config.applicationid))
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
    } catch (error) {
        console.log(error);
    };
}

async function deleteCommandByName(commandName) {
    try {
        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v10');

        const rest = new REST({ version: '10' }).setToken(config.token);
        let results = [];
        let commandId = '';
        rest.get(Routes.applicationCommands(config.applicationid))
            .then((response) => {
                results = response;
                for (const i of results) {
                    // console.log(i);
                    if (i.name == commandName) {
                        commandId = i.id
                        console.log('Deleting ' + i.name + ' || ' + i.id)
                        deleteCommandById(commandId, commandName);
                    }
                }
                if (commandId == '') console.log('No command deleted.')
            })
            .catch((error) => console.log(error))
    } catch (error) {
        console.log(error);
    };
}