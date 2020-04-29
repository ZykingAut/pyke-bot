module.exports = {
    name: 'engin',
    description: 'Lösch dich!',
    cooldown: 5,
    args: true,
    execute(msg) {
        const taggedUser = msg.mentions.users.first();
        msg.channel.send(`Lösch dich, ${taggedUser}!`);
    },
};