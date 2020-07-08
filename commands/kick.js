module.exports = {
    name: 'kick',
    description: 'Command to kick users from a guild',
    usage: '<@user> <reason>',
    guildOnly: true,
    adminOnly: true,
    args: true,
    cooldown: 5,
    execute(msg, args) {
        if (!msg.mentions.users.size) {
            return msg.reply('You need to tag a user in order to kick them!');
        }
        const taggedUser = msg.mentions.users.first();
        return msg.guild.member(taggedUser).kick(args.join(' ')).catch(e => console.log(e));
    },
};