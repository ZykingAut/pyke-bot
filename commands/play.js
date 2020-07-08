const ytdl = require('ytdl-core');

module.exports = {
    name: 'play',
    description: 'Command to let the bot join a voice channel.',
    args: true,
    async execute(msg, args) {
        const playlist = [];
        playlist.push(args[0]);
        const connection = await msg.member.voice.channel.join();
        while (playlist.length !== 0) {
            const dispatcher = connection.play(ytdl(playlist[0]), {filter: 'audioonly'});
            dispatcher.on('finish', () => {
                msg.channel.send('Song finished!');
                playlist.shift();
            });
        }
    }
}