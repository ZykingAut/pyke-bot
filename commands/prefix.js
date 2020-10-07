module.exports = {
    name: 'prefix',
    group: 'util',
    description: 'Command to show or change the prefix of the guild.',
    usage: '(<prefix>)',
    guildOnly: true,
    async execute(msg, args, _, prefixes) {
        if (args.length) {
            if (args[0].length > 3) return msg.reply('please do not use prefixes longer than 3 symbols.');
            if (args[0] === process.env.GLOBALPREFIX) {
                await prefixes.delete(msg.guild.id);
                return msg.channel.send(`Successfully resetted prefix to \'${process.env.GLOBALPREFIX}\'.`);
            }
            await prefixes.set(msg.guild.id, args[0]);
            return msg.channel.send(`Successfully set prefix to \'${args[0]}\'.`);
        }
        return msg.channel.send(`Prefix is \'${await prefixes.get(msg.guild.id) || process.env.GLOBALPREFIX}\'.`);
    }
}