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


//Client variables to use everywhere
client.commands = new Discord.Collection(); //an collection (like a digital map(database)) for all your commands
client.aliases = new Discord.Collection(); //an collection for all your command-aliases
client.categories = fs.readdirSync("./commands/"); //categories
client.cooldowns = new Discord.Collection(); //an collection for cooldown commands of each user

//Loading files, with the client variable like Command Handler, Event Handler, ...
["command", "events"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

// Message Scheduling Setup
cron.schedule('* * * * *', () => {
  sendScheduledMessages();
});

async function sendScheduledMessages() {
  const userData = JSON.parse(fs.readFileSync('./data/userdata.json'));
  const quotes = JSON.parse(fs.readFileSync('./data/1up.json'));

  for (const userId in userData) {
    const userTimezone = userData[userId].timezone;
    const scheduledTimes = userData[userId].times;

    if (scheduledTimes) {
      for (const scheduledTime of scheduledTimes) {
        const nowInUserTimezone = moment().tz(userTimezone);

        // Check whether current time matches the scheduled time
        if (nowInUserTimezone.format('HH:mm A') === scheduledTime) {
          const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

          try {
            const user = await client.users.fetch(userId);
            await user.send(randomQuote);
          } catch (error) {
            console.error(`Error sending DM to ${userId}:`, error);
          }
        }
      }
    }
  }
}

//login into the bot
client.login(config.token);


//Handler to receive information like commands from users
client.on(Discord.Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply("An error occured. Please contact staff: ERROR " + error)
    // if (interaction.replied || interaction.deferred) {
    //   await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    // } else {
    //   await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    // }
  }
});