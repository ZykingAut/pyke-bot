const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    type: 'help',
    aliases: ['commands'],
    usage: '<command name>',
    cooldown: 5,
    execute(msg, args) {
        // Fetching Information
        const { commands } = msg.client;

        // Setting Variables
        const embed = new MessageEmbed();

        // Initializing Arrays
        const commandNames = [];
        const funCommandNames = [];
        const modCommandNames = [];
        const utilCommandNames = [];

        if (!args.length) {

            // Filling the Arrays
            commandNames.push(commands.map(command => command.name).join('\n'));
            funCommandNames.push(fun.map(command => command.name).join('\n'));
            modCommandNames.push(mod.map(command => command.name).join('\n'));
            utilCommandNames.push(util.map(command => command.name).join('\n'));

            // Embed Header etc
            embed.setTitle('Help');
            embed.setColor('YELLOW');
            embed.setDescription(`\nYou can send \`${process.env.GLOBALPREFIX}help <command name>\`\n to get info on a specific command!`);
            embed.setFooter(msg.author.username, msg.author.displayAvatarURL());
            embed.setTimestamp(Date.now());

            // Embed Content
            embed.addFields(
                { name: 'Fun', value: funCommandNames, inline: true },
                { name: 'Mod', value: modCommandNames, inline: true },
                { name: '\u200b', value: '\u200b', inline: true }
            );
            embed.addFields(
                { name: 'Utility', value: utilCommandNames, inline: true },
                { name: '\u200b', value: '\u200b', inline: true }
            );

            // Sending Help Embed Message
            return msg.author.send(embed)
                .then(() => {
                    if (msg.channel.type === 'dm') return;
                    msg.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${msg.author.tag}.\n`, error);
                    msg.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }


        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return msg.reply('that\'s not a valid command!');
        }

        embed.setTitle(command.name.charAt(0).toUpperCase() + command.name.slice(1));
        embed.setColor('GREEN');

        if (command.description) embed.addField('Description', command.description);
        if (command.usage) embed.addField('Usage', command.usage, true);
        if (command.cooldown) {
            embed.addField('Cooldown', `${command.cooldown}s`, true);
        } else {
            embed.addField('Cooldown', '3s', true);
        }
        if (command.aliases) embed.addField('Aliases', command.aliases.join(', '));
        embed.setFooter(msg.author.username, msg.author.displayAvatarURL());
        embed.setTimestamp(Date.now());

        msg.channel.send(embed);

    }
};