const discord = require('discord.js');
const { client } = require('app.js');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '<command name>',
    cooldown: 5,
    execute(msg, args) {
        const { commands } = client;
        const { fun } = client.funCommands;
        const { help } = client.helpCommands;
        const { mod } = client.modCommands;
        const { music } = client.musicCommands;
        const { util } = client.utilCommands;
        const embed = new discord.MessageEmbed();
        const funCommandNames = [];
        const helpCommandNames = [];
        const modCommandNames = [];
        const musicCommandNames = [];
        const utilCommandNames = [];

        if (!args.length) {
            funCommandNames.push(fun.map(command => command.name).join('\n'));
            helpCommandNames.push(help.map(command => command.name).join('\n'));
            modCommandNames.push(mod.map(command => command.name).join('\n'));
            musicCommandNames.push(music.map(command => command.name).join('\n'));
            utilCommandNames.push(util.map(command => command.name).join('\n'));
            embed.setTitle('Help');
            embed.setColor('YELLOW');
            embed.setDescription(`\nYou can send \`${process.env.prefix}help <command name>\`\n to get info on a specific command!`);
            embed.setFooter(msg.author.username, msg.author.displayAvatarURL());
            embed.setTimestamp(Date.now());
            embed.addField('Fun', funCommandNames, true);
            embed.addField('Help', helpCommandNames, true);
            embed.addField('mod', modCommandNames, true);
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