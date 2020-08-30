const fs = require('fs');
const discord = require('discord.js');
const quotes = require('./data/quotes.json');
const Keyv = require('keyv');
require('dotenv').config({ path: __dirname + '/.env' });
const client = new discord.Client();

//Collections
client.funCommands = new discord.Collection();
client.modCommands = new discord.Collection();
client.musicCommands = new discord.Collection();
client.utilCommands = new discord.Collection();
client.commands = new discord.Collection();
const cooldowns = new discord.Collection();

// Databases
const prefixes = new Keyv('sqlite://./data/guilds.sqlite', {
    table: 'prefixes',
    type: String,
});
prefixes.on('error', err => console.error('Keyv connection error:', err));

const warnings = new Keyv('sqlite://./data/guilds.sqlite', {
    table: 'warnings',
    type: Array,
});
warnings.on('error', err => console.error('Keyv connection error:', err));

// Command Handler
const funCommands = fs.readdirSync('./commands/fun').filter(file => file.endsWith('.js'));
for (const file of funCommands) {
    const command = require(`./commands/fun/${file}`);
    client.funCommands.set(command.name, command);
    client.commands.set(command.name, command);
}

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

const musicCommands = fs.readdirSync('./commands/music').filter(file => file.endsWith('.js'));
for (const file of musicCommands) {
    const command = require(`./commands/music/${file}`);
    client.musicCommands.set(command.name, command);
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
    await client.login(process.env.DISCORD);

    // On Startup
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
                prefix = await prefixes.get(msg.guild.id);
                if (!msg.content.startsWith(prefix)) return;
            } else if (!msg.content.startsWith(prefix)) return;
        } else if (!msg.content.startsWith(prefix)) return;

        args = msg.content.slice(prefix.length).split(' ');
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
            command.execute(msg, args, client, prefixes, warnings);
        } catch (error) {
            console.log(error);
            msg.reply('there was an error trying to execute that command!');
        }
    });

    // Activity
    const quote = quotes[Math.floor(Math.random() * Math.floor(quotes.length))];
    await client.user.setActivity(quote.quote, {type: quote.type})
        .then(precence => console.log(`switched activity to ${precence.activities[0].name}`));
    setInterval(async () => {
        let quote = quotes[Math.floor(Math.random() * Math.floor(quotes.length))];
        await client.user.setActivity(quote.quote, {type: quote.type})
            .then(precence => console.log(`switched activity to ${precence.activities[0].name}`));
    }, 10 * 60 * 1000);
}

connect(client).then(console.log('Starting bot...'));