const { readdirSync } = require("fs");
const { SlashCommandBuilder } = require('discord.js');
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
console.log("Welcome to SERVICE HANDLER /--/ " + config.appname);
let commands = []

module.exports = async (client) => {
  readdirSync('./commands/').forEach((dir) => {
    const commandFiles = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`../commands/${dir}/${file}`);

      if (!(command.data instanceof SlashCommandBuilder)) {
        console.warn(`[COMMAND LOADING] ${file}: Missing or invalid 'data' property (SlashCommandBuilder)`);
        continue;
      }
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
      console.log(`[COMMAND LOADING] ${file}: Ready`);
    }
  });

  //ACTIVATE ONCE PER COMMAND
  // registerCommands();
}

// Registering Commands only neccessary to initiate a new Command
async function registerCommands() {
  try {
    console.log("Started refreshing application (/) commands.");
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord-api-types/v10');
    const rest = new REST({ version: '10' }).setToken(config.token);

    await rest.put(
      Routes.applicationCommands(config.applicationid),
      { body: commands },
    );
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  };
}