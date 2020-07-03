const ytdl = require('ytdl-core');

module.exports = {
    name: 'play',
    description: 'Command to let the bot join a voice channel.',
    async execute(msg, args) {
        const connection = msg.member.voice.channel.join();
        connection.play(ytdl(args, { filter: "audioonly"} ));
    }
}