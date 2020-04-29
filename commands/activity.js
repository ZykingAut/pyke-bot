module.exports = {
    name: 'activity',
    description: 'Command to set the current activity of the bot',
    args: true,
    usage: '<status> <activity>',
    cooldown: 30,
    execute(msg, args, client) {
        if (args.length < 2) {
            return msg.reply('you need to provide two or more arguments!');
        } else {
            const type = args.pop();
            client.user.setActivity(args.join(' '), {type: type });
        }
    },
};