module.exports = {
    name: 'kick',
    description: 'Command to kick users from a guild',
    usage: '<@user> <reason>',
    guildOnly: true,
    args: true,
    cooldown: 5,
    execute(msg, args) {
        if (!msg.mentions.users.size) return msg.reply('you need to tag a user in order to kick them!');
        if (!msg.guild.member(msg.author).hasPermission('ADMINISTRATOR')) return msg.reply('you need to have kick permission to use this command!');
        const taggedUser = msg.mentions.users.first();
        if (!msg.guild.member(taggedUser).kickable) return msg.reply('I am not able to kick a user higher than me!');
        return msg.guild.member(taggedUser).kick(args.slice(1).join(' ')).catch(e => console.log(e));
    },
};