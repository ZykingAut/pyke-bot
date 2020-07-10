module.exports = {
    name: 'delete',
    description: 'Command to delete messages',
    aliases: ['remove'],
    args: true,
    usage: '<amount>',
    guildOnly: true,
    adminOnly: true,
    cooldown: 10,
    execute(msg, args) {
        const amount = parseInt(args[0]) + 1;
        if (isNaN(amount)) {
            return msg.reply('that doesn\'t seem to be a valid number.');
        } else if (amount <= 1 || amount > 100) {
            return msg.reply('you need to input a number between 1 and 99.');
        } else {
            return msg.channel.bulkDelete(amount, true).catch(err => {
                console.error(err);
                msg.reply('there was an error trying to delete messages in this channel!');
            });

        }
    },
};