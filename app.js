const fs = require('fs');
const discord = require('discord.js');
const { Op } = require('sequelize');
const quotes = require('./data/quotes.json');
require('dotenv').config({ path: __dirname + '/.env' });

//Collections
const client = new discord.Client();
client.funCommands = new discord.Collection();
client.modCommands = new discord.Collection();
client.musicCommands = new discord.Collection();
client.utilCommands = new discord.Collection();
client.commands = new discord.Collection();
client.warnedUsers = new discord.Collection();
const cooldowns = new discord.Collection();

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
    client.once('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });


    // Message Listener
    client.on('message', msg => {
        const prefix = process.env.PREFIX;

        if (!msg.content.startsWith(prefix)) return;

        const args = msg.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

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

    // Activity
    client.user.setStatus('online')
        .then(precence => console.log(`Client's status is set to ${precence.status}`))
        .catch(error => console.error(error));

    client.user.setActivity('The Void!', {type:'WATCHING'})
        .then(precence => console.log(`switched activity to \"${(precence.activities[0].type).toLowerCase()} ${precence.activities[0].name}\"`));

    setInterval(() => {
        let quote = quotes[Math.floor(Math.random() * Math.floor(quotes.length))]
        client.user.setActivity(quote.quote, {type: quote.type})
            .then(precence => console.log(`switched activity to ${precence.activities[0].name}`));
    }, 10 * 60 * 1000);
}

connect(client);