const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const querystring = require('querystring');

module.exports = {
    name: 'league',
    description: 'Command to get upcoming Esports Games around League of Legends',
    usage: '',
    args: false,
    cooldown: 5,
    async execute(msg, args) {
        const { list } = await fetch(`https://api.pandascore.co/lol/champions?token=${process.env.PANDA}`).then(response => response.json());
        if (!list.length) {
            return msg.channel.send('Didnt work :c');
        }
        const [answer] = list;
        return console.log(answer);

    }
}