module.exports = {
    name: 'warn',
    description: 'Command to warn a user from a guild',
    usage: '<@user>',
    guildOnly: true,
    args: true,
    cooldown: 5,
    execute(msg, args, c, p, warnings) {
        if (!msg.mentions.users.size) return msg.reply('you need to tag a user in order to warn them.');
        if (!msg.guild.member(msg.author).hasPermission('ADMINISTRATOR')) return msg.reply('you need to be an admin to warn someone!');
        const taggedUser = msg.mentions.users.first();
        warnings.set(msg.guild.id, taggedUser.id).catch(err => console.log(err));
        warnings.set(taggedUser.id, msg.guild.id).catch(err => console.log(err));
        return msg.channel.send(`${taggedUser.username} has been warned!`);
    }
}