const fs = require('fs');
const discord = require('discord.js');
const quotes = require('./data/quotes.json');
const Keyv = require('keyv');
require('dotenv').config({ path: __dirname + '/.env' });
const client = new discord.Client();

//Collections
client.funCommands = new discord.Collection();
client.modCommands = new discord.Collection();
client.utilCommands = new discord.Collection();
client.esportCommands = new discord.Collection();
client.commands = new discord.Collection();
const cooldowns = new discord.Collection();

// Databases
const prefixes = new Keyv('sqlite://./data/guilds.sqlite', {
    table: 'prefixes',
    type: String,
});
prefixes.on('error', err => console.error('Keyv connection error:', err));

// Command Handler
const helpCommands = fs.readdirSync('./commands/help').filter(file => file.endsWith('.js'));
    for (const file of helpCommands) {
        const command = require(`./commands/help/${file}`);
        client.commands.set(command.name, command);
    }

const modCommands = fs.readdirSync('./commands/mod').filter(file => file.endsWith('.js'));
    for (const file of modCommands) {
        const command = require(`./commands/mod/${file}`);
        client.modCommands.set(command.name, command);
        client.commands.set(command.name, command);
    }

const esportCommands = fs.readdirSync('./commands/esports').filter(file => file.endsWith('.js'));
    for (const file of esportCommands) {
        const command = require(`./commands/esports/${file}`);
        client.esportCommands.set(command.name, command);
        client.commands.set(command.name, command);
    }

const utilCommands = fs.readdirSync('./commands/util').filter(file => file.endsWith('.js'));
    for (const file of utilCommands) {
        const command = require(`./commands/util/${file}`);
        client.utilCommands.set(command.name, command);
        client.commands.set(command.name, command);
    }

// Starting Bot
async function connect(client) {
    // Login the user
    await client.login(process.env.DISCORD);

    // Log if the right token was provided
    await client.once('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    // Message Listener
    client.on('message', async msg => {
        if (msg.author.bot) return;
        let prefix = process.env.GLOBALPREFIX;
        let args;
        if (msg.guild) { // Check if the message was posted in a guild
            if (await prefixes.get(msg.guild.id)) { // Check if the guild the message was send has a set prefix
                prefix = await prefixes.get(msg.guild.id)
            }
        }
        console.log(prefix);
        if (!msg.content.startsWith(prefix)) return;
        args = msg.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        // Check if the Command needs Arguments
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${msg.author}!`;
            if (command.usage) {
                reply += `\nThe proper usage would be: \'${prefix}${command.name} ${command.usage}\'`;
            }
            return msg.channel.send(reply);
        }

        // Check for Channelproperties and Commandproperties
        if (command.guildOnly && msg.channel.type !== 'text') {
            return msg.reply('I can\'t execute that command inside DMs!')
        }
        if (command.adminOnly && !msg.guild.member(msg.author).hasPermission('ADMINISTRATOR')) {
            return msg.reply('you need to have admin rights to use this command!');
        }
        if (command.nsfwOnly && !msg.channel.nsfw) {
            return msg.reply('this command is only available in nsfw channels!');
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
            command.execute(msg, args, client, prefixes);
        } catch (error) {
            console.log(error);
            msg.reply('there was an error trying to execute that command!');
        }
    });

    // Cycle through an Activity Combination found in data/quotes.json
    const quote = quotes[Math.floor(Math.random() * Math.floor(quotes.length))];
    await client.user.setActivity(quote.quote, {type: quote.type})
        .then(precence => console.log(`switched activity to ${precence.activities[0].name}`));
    setInterval(async () => {
        let quote = quotes[Math.floor(Math.random() * Math.floor(quotes.length))];
        await client.user.setActivity(quote.quote, {type: quote.type})
            .then(precence => console.log(`switched activity to ${precence.activities[0].name}`));
    }, 10 * 60 * 1000);
}

// Start the Bot
connect(client).then(console.log('Starting bot...'));