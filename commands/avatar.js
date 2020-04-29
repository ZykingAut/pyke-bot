module.exports = {
    name: 'avatar',
    description: 'Command to get the avatar of a user',
    aliases: ['icon', 'pfp'],
    usage: '<user>',
    cooldown: 5,
    execute(msg) {
        if (!msg.mentions.users.size) {
            return msg.channel.send(`Your avatar: <${msg.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
        }
        const avatarList = msg.mentions.users.map(user => {
            return `${user.username}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
        });
        msg.channel.send(avatarList);
    },
};