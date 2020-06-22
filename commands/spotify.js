const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'spotify',
    description: 'Command to display the current song a user is listening to.',
    aliases: 'track',
    execute(msg) {
        let user = msg.mentions.users.first() || msg.author;

        if (user.presence.activities[0] !== undefined && user.presence.activities[0].type === 'LISTENING' && user.presence.activities[0].name === 'Spotify' && user.presence.activities[0].assets !== undefined) {
            let trackIMG = `https://i.scdn.co/image/${user.presence.activities[0].assets.largeImage.slice(8)}`;
            let trackURL = `https://open.spotify.com/track/${user.presence.activities[0].syncID}`;
            let trackName = user.presence.activities[0].details;
            let trackAuthor = user.presence.activities[0].state;
            let trackAlbum = user.presence.activities[0].assets.largeText;

            const embed  = new MessageEmbed()
                .setAuthor('Spotify Tracker')
                .setTitle(`Spotify acitivity for ${user.username}`)
                .setColor('#007a1a')
                .setThumbnail(trackIMG)
                .addFields(
                    {name: 'Song Name', value: trackName, inline: true},
                    {name: 'Album', value: trackAlbum, inline: true},
                    {name: 'Author', value: trackAuthor, inline: false},
                    {name: 'Listen to Track:', value: trackURL, inline: false}
                );
            msg.channel.send(embed);
        } else if (msg.mentions == undefined) {
            msg.channel.send('This user is not listening to Spotify!');
        }
    }
};
