module.exports = {
    name: 'prefix',
    description: 'Command to show or change the prefix of the guild.',
    usage: '(<prefix>)',
    guildOnly: true,
    async execute(msg, args, _, prefixes) {
        if (args.length) {
            await prefixes.set(msg.guild.id, args[0]);
            return msg.channel.send(`Successfully set prefix to \'${args[0]}\'`);
        }
        return msg.channel.send(`Prefix is \'${await prefixes.get(msg.guild.id) || process.env.GLOBALPREFIX}\'`);
    }
}