const discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '<command name>',
    cooldown: 5,
    execute(msg, args) {
        const { commands } = msg.client;
        const embed = new discord.MessageEmbed();
        const commandNames = [];
        const descriptions = [];
        const cooldowns = [];

        if (!args.length) {
            commandNames.push(commands.map(command => command.name).join('\n'));
            descriptions.push(commands.map(command => command.description).join('\n'));
            cooldowns.push(commands.map(command => (command.cooldown || 3) + 's').join('\n'));
            embed.setTitle('Help');
            embed.setColor('YELLOW');
            embed.setDescription(`\nYou can send \`${process.env.prefix}help [command name]\` to get info on a specific command!`);
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

        embed.setTitle(command.name);

        if (command.description) embed.addField('Description', command.description);
        if (command.usage) embed.addField('Usage', command.usage, true);
        if (command.cooldown) embed.addField('Cooldown', (`${command.cooldown}s`), true);
        if (command.aliases) embed.addField('Aliases', command.aliases.join(', '));

        msg.channel.send(embed);

    }
};