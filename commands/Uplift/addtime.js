const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const moment = require('moment-timezone');
const cname = "addtime"

module.exports = {
    data: new SlashCommandBuilder()
        .setName(cname)
        .setDescription('Add A Daily 1-Up')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Enter time (e.g., 10:30 AM, 3:15 PM)')
                .setRequired(true)),
    async execute(interaction, client) {
        const userId = interaction.user.id;
        const inputTimeValue = interaction.options.getString('time');
        console.log(inputTimeValue);

        fs.readFile('./data/userdata.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                return interaction.reply('Error reading user data!');
            }
            const userData = JSON.parse(data);

            if (!userData[userId] || !userData[userId].timezone) {
                return interaction.reply('Please set your timezone first.');
            } else {
                // Check Timezone
                if (userData[userId].times && userData[userId].times.length >= 25) {
                    return interaction.reply('Time was already added.');
                } else {
                    const userTimezone = userData[userId].timezone;
                    console.log(userTimezone)

                    // Convert Time
                    try {
                        let convertedTime = moment(inputTimeValue, 'h:mm A');
                        if (convertedTime.isValid()) {
                            let timePortion = convertedTime.format('HH:mm A');
                            if (userData[userId].times && userData[userId].times.includes(timePortion)) {
                                return interaction.reply('Time was already added.');
                            } else {
                                if (!userData[userId].times) {
                                    userData[userId].times = [];
                                }
                                userData[userId].times.push(timePortion);

                                fs.writeFile('./data/userdata.json', JSON.stringify(userData), (err) => {
                                    if (err) {
                                        console.error(err);
                                        return interaction.reply('Error saving time data!');
                                    }
                                    interaction.reply(`Time added! (${timePortion})`);
                                });
                            }
                        }
                        else {
                            return interaction.reply('Invalid time format. Please try again.');
                        }
                    } catch (error) {
                        console.error('Error parsing time:', error);
                        return interaction.reply('Invalid time format. Please try again.');
                    }
                }
            }
        });
    }
}

/* 
INITIAL RESPONSES
await interaction.reply('Pong!');
await interaction.deferReply(); //display discord isthinking message
await interaction.deferReply({ ephemeral: true });
await wait(2_000);

ADDITIONAL RESPONSES
await interaction.editReply('Pong again!'); 
await interaction.followUp('Pong again!'); //for additional messages
await interaction.deleteReply();

ADDITIONAL REPLIES
const message = await interaction.fetchReply();

ATTRIBUTES
client.on(Events.InteractionCreate, interaction => {
    const locales = {
        pl: 'Witaj Świecie!',
        de: 'Hallo Welt!',
    };
    interaction.reply(locales[interaction.locale] ?? 'Hello World (default is english)');
});
*/