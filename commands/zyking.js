const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'zyking',
    description: 'Orianna!',
    cooldown: 5,
    execute(msg) {
        const oriannaEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle('Orianna')
            .setImage('http://ddragon.leagueoflegends.com/cdn/10.7.1/img/champion/Orianna.png');
        const shacoEmbed = new MessageEmbed()
            .setColor('#000000')
            .setTitle('Shaco')
            .setImage('http://ddragon.leagueoflegends.com/cdn/10.7.1/img/champion/Shaco.png');
        msg.channel.send(oriannaEmbed);
        msg.channel.send(shacoEmbed);
    },
};