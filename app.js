const fs = require('fs');
const discord = require('discord.js');
const { Op } = require('sequelize');


//Collections
const client = new discord.Client();
client.commands = new discord.Collection();
const cooldowns = new discord.Collection();

// Command Handler
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// On Startup
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus('online');
    client.user.setActivity('Zyking Inting', { type: 'PLAYING' });
});

// Message Listener
client.on('message', msg => {
    const prefix = process.env.prefix;

    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${msg.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \'${prefix}${command.name} ${command.usage}\'`;
        }

        return msg.channel.send(reply);
    }

    if (command.guildOnly && msg.channel.type !== 'text') {
        return msg.reply('I can\'t execute that command inside DMs!')
    }


    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return msg.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }

    }
    timestamps.set(msg.author.id, now);
    setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);


    try {
        command.execute(msg, args, client, Op);
    } catch (error) {
        console.log(error);
        msg.reply('there was an error trying to execute that command!');
    }
});

// Starting Bot
client.login(process.env.discordtoken);