module.exports = {
    name: 'kick',
    description: 'Command to kick users from a guild',
    usage: '<user>',
    guildOnly: true,
    adminOnly: true,
    cooldown: 5,
    execute(msg) {
        if (!msg.mentions.users.size) {
            return msg.reply('You need to tag a user in order to kick them!');
        }
        const taggedUser = msg.mentions.users.first();
        msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
    },
};