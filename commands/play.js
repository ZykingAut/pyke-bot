const ytdl = require('ytdl-core');

module.exports = {
    name: 'play',
    description: 'Command to let the bot join a voice channel.',
    async execute(msg, args) {
        const connection = await msg.member.voice.channel.join();
        const dispatcher = connection.play(ytdl(args, { filter: "audioonly"} ));
    }
}