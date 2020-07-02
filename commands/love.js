module.exports = {
    name: 'love',
    description: 'Find out the love between two people!',
    execute(msg) {
        if (msg.mentions.users.size !== 2) {
            return msg.channel.send('You need to tag two people to calculate their love!');
        } else {
            const love = Math.floor(Math.random() * 101);
            return msg.channel.send(`The love between ${msg.mentions.users[0].nickname} and ${msg.mentions.users[1].nickname} is ${love}%`);
        }
    }
};