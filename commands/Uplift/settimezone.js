const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const moment = require('moment-timezone');
const fs = require("fs");
const cname = "settimezone"
const allTimezones = moment.tz.names();

module.exports = {
    data: new SlashCommandBuilder()
        .setName(cname)
        .setDescription('Set Your Timezone')
        .addStringOption(option =>
            option.setName('continent')
                .setDescription('Select your continent')
                .setRequired(true)
                .addChoices(
                    { name: 'Africa', value: 'Africa' },
                    { name: 'Antarctica', value: 'Antarctica' },
                    { name: 'Asia', value: 'Asia' },
                    { name: 'Australia', value: 'Australia' },
                    { name: 'Europe', value: 'Europe' },
                    { name: 'America', value: 'America' },
                    { name: 'Pacific', value: 'Pacific' },
                )),
    async execute(interaction, client) {
        let userId = interaction.user.id;
        const selectedContinent = interaction.options.getString('continent');
        console.log(selectedContinent)
        console.log(allTimezones)

        //Timezone Variables
        const timezoneGroups = {
            'A-F': [],
            'G-K': [],
            'L-P': [],
            'Q-U': [],
            'V-Z': [],
        };

        const filteredTimezones = moment.tz.names().filter(timezone => timezone.startsWith(selectedContinent));

        for (let timezone of moment.tz.names().filter(timezone => timezone.startsWith(selectedContinent))) {
            const firstLetter = timezone.replace(selectedContinent + '/', '')[0].toUpperCase();

            for (const group in timezoneGroups) {
                const range = group.split('-');
                const startCode = range[0].charCodeAt(0);
                const endCode = range[1].charCodeAt(0);

                if (firstLetter.charCodeAt(0) >= startCode && firstLetter.charCodeAt(0) <= endCode) {
                    timezoneGroups[group].push(timezone);
                    break;
                }
            }
        }


        //LESS THAN 25 OPTIONS
        if (filteredTimezones.length > 0 && filteredTimezones.length < 26) {

            //Small Menu
            const smallSelectMenu = new StringSelectMenuBuilder()
                .setCustomId('timezoneSelectSmall')
                .setPlaceholder('Select your timezone')
            for (const group of filteredTimezones) {
                smallSelectMenu.addOptions({ label: group.replace(selectedContinent + '/', ''), value: group });
            }
            const row = new ActionRowBuilder().addComponents(smallSelectMenu);
            interaction.reply({ content: 'Select your timezone:', components: [row] });

            fs.readFile('./data/userdata.json', (err, data) => {
                //Error Handling
                if (err) {
                    console.error(err);
                    return interaction.followUp('Error reading user data!');
                }
                let userData = JSON.parse(data);

                // Interaction Small Menu
                client.on('interactionCreate', async interaction => {
                    userId = interaction.user.id;
                    if (!interaction.isStringSelectMenu()) return;

                    if (interaction.customId === 'timezoneSelectSmall') {
                        const selectedTimezone = interaction.values[0];

                        if (!moment.tz.zone(selectedTimezone)) {
                            return interaction.reply('<@' + userId + '> ' + 'Invalid timezone selected!');
                        } else {
                            if (!userData[userId]) userData[userId] = { timezone: selectedTimezone };
                            else if (!userData[userId].timezone) userData[userId] = { timezone: selectedTimezone };
                            else userData[userId].timezone = selectedTimezone;

                            // Save data
                            fs.writeFile('./data/userdata.json', JSON.stringify(userData), (err) => {
                                if (err) {
                                    console.error(err);
                                    return interaction.reply('Error saving timezone!');
                                }
                                interaction.reply('<@' + userId + '> ' + `Your timezone has been set to ${selectedTimezone}`);
                            });
                        }
                    }
                }
                );
            })
        } else if (filteredTimezones.length > 0) {

            // BIG MENU

            // Letter Menu
            let letterRangeMenu = new StringSelectMenuBuilder()
                .setCustomId('selectLetterRange')
                .setPlaceholder('Timezone City');

            for (const group in timezoneGroups) {
                letterRangeMenu.addOptions({ label: group, value: group });
            }

            interaction.reply({ content: 'Choose the city of your timezone:', components: [new ActionRowBuilder().addComponents(letterRangeMenu)] });

            // Read Userdata
            fs.readFile('./data/userdata.json', (err, data) => {
                if (err) {
                    console.error(err);
                    return interaction.followUp('<@' + userId + '> ' + 'Error reading user data!');
                }
                let userData = JSON.parse(data);

                // Interaction
                client.on('interactionCreate', async interaction => {
                    userId = interaction.user.id;
                    if (!interaction.isStringSelectMenu()) return;

                    // Letter Select Menu
                    if (interaction.customId === 'selectLetterRange') {
                        const selectedRange = interaction.values[0];
                        let timezones = timezoneGroups[selectedRange];

                        let selectMenu = new StringSelectMenuBuilder()
                            .setCustomId('timezoneSelect') // Give it an ID to listen for interactions
                            .setPlaceholder('Select your timezone')

                        for (const group of timezones) {
                            selectMenu.addOptions({ label: group.replace(selectedContinent + '/', ''), value: group });
                        }
                        const row = new ActionRowBuilder().addComponents(selectMenu);
                        interaction.reply({ content: '<@' + userId + '> ' + 'Select your timezone:', components: [row] });
                    }

                    // Timezone Select
                    if (interaction.customId === 'timezoneSelect') {
                        const selectedTimezone = interaction.values[0];
                        if (!userData[userId]) userData[userId] = { timezone: selectedTimezone };
                        else if (!userData[userId].timezone) userData[userId] = { timezone: selectedTimezone };
                        else userData[userId].timezone = selectedTimezone;

                        if (!moment.tz.zone(selectedTimezone)) {
                            return interaction.reply('<@' + userId + '> ' + 'Invalid timezone selected!');
                        }

                        // Save data
                        fs.writeFile('./data/userdata.json', JSON.stringify(userData), (err) => {
                            if (err) {
                                console.error(err);
                                return interaction.reply('Error saving timezone!');
                            }
                            interaction.reply('<@' + userId + '> ' + `Your timezone has been set to ${selectedTimezone}`);
                        });
                    }
                });
            });
        }
    },
};