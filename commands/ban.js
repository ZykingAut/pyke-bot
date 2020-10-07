module.exports = {
    name: 'ban',
    group: 'mod',
    description: 'Command to ban users from a guild',
    usage: '<@user> <reason>',
    guildOnly: true,
    adminOnly: true,
    args: true,
    cooldown: 5,
    execute(msg, args) {
        if (!msg.mentions.users.size) return msg.reply('you need to tag a user in order to ban them!');
         const taggedUser = msg.mentions.users.first();
        if (!msg.guild.member(taggedUser).bannable) return msg.reply('I am not able to ban user higher than me!');
        return msg.guild.member(taggedUser).ban({reason: args.slice(1).join(' ')}).catch(e => console.log(e));
    }
}