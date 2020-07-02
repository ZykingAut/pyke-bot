module.exports = {
    name: 'love',
    description: 'Find out the love between two people!',
    execute(msg) {
        if (msg.mentions.users.size !== 2) {
            return msg.channel.send('You need to tag two people to calculate their love!');
        } else {
            const love = Math.floor(Math.random() * 101);
            const loversArray = msg.mentions.users.array();
            msg.channel.send(`The love between ${loversArray[0].username} and ${loversArray[1].username} is ${love}%!`).then(botMsg =>{
                if (love < 25) {
                    botMsg.react('😒');
                } else if (love > 25 && love < 50) {
                    botMsg.react('😏');
                } else if (love > 50 && love < 75) {
                    botMsg.react('😚');
                } else {
                    botMsg.react('😍');
                }
            });
        }
    }
};