const discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '<command name>',
    cooldown: 5,
    execute(msg, args) {
        const data = [];
        const { commands } = msg.client;
        const embed = new discord.MessageEmbed();
        const commandNames = [];
        const descriptions = [];
        const cooldowns = [];

        if (!args.length) {
            commandNames.push(commands.map(command => command.name).join('\n'));
            descriptions.push(commands.map(command => command.description).join('\n'));
            cooldowns.push(commands.map(command => command.cooldown + 's').join('\n'));
            embed.setTitle('Help');
            embed.setColor('YELLOW');
            embed.addField('Commands', commandNames, true);
            embed.addField('Cooldowns', cooldowns, true);
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

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${process.env.prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        msg.channel.send(data, { split: true });

    }
};