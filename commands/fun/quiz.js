module.exports = {
    name: 'quiz',
    description: 'Command to setup a quiz.',
    cooldown: 5,
    execute(msg) {
        const quiz = require('../../data/quiz.json');
        const item = quiz[Math.floor(Math.random() * quiz.length)];
        const filter = response => {
            return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
        };

        msg.channel.send(item.question).then(() => {
            msg.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time']})
                .then(collected => {
                    msg.channel.send(`${collected.first().author} got the correct answer!`);
                })
                .catch(collected => {
                    msg.channel.send('Looks like nobody got the answer this time.');
                });
        });
    },
};
