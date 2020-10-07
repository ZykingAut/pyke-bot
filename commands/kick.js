module.exports = {
    name: 'kick',
    group: 'mod',
    description: 'Command to kick users from a guild',
    usage: '<@user> <reason>',
    guildOnly: true,
    adminOnly: true,
    args: true,
    cooldown: 5,
    execute(msg, args) {
        if (!msg.mentions.users.size) return msg.reply('you need to tag a user in order to kick them!');
        const taggedUser = msg.mentions.users.first();
        if (!msg.guild.member(taggedUser).kickable) return msg.reply('I am not able to kick a user higher than me!');
        return msg.guild.member(taggedUser).kick(args.slice(1).join(' ')).catch(e => console.log(e));
    },
};