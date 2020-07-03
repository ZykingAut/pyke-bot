

module.exports = {
    name: 'play',
    description: 'Command to let the bot join a voice channel.',
    async execute(msg) {
        const connection = msg.member.voice.channel.join();
    }
}