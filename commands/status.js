module.exports = {
    name: 'status',
    description: 'Command to set the activity of the bot',
    args: true,
    usage: '<status>',
    cooldown: 30,
    execute(msg, args, client) {
        if (!args.length === 1) {
            return msg.reply('that is not a valid status!');
        } else if (args[0] === 'online' || args[0] === 'idle' || args[0] === 'dnd' || args[0] === 'invisible') {
            client.user.setStatus(args[0]);
            if (args[0] === 'dnd') {
                msg.reply('status is set to: Do not disturb!');
            } else {
                msg.reply(`status is set to: ${args[0]}`);
            }
        } else {
            return msg.reply('that is not a valid status!');
        }
    },
};