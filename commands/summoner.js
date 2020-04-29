const { MessageEmbed } = require('discord.js');
const config = require('../config');
const LeagueJS = require('leaguejs');


const leagueJs = new LeagueJS(config.riotToken, {
        PLATFORM_ID: 'euw1',
        limits: {
            'allowBursts': false,
            'numMaxRetries': 3,
            'intervalRetryMS': 1500,
        },
        caching: {
            isEnabled: false,
        }});



function sendErrorMessage(msg, statusCode) {
    if (statusCode == '400') {
        return msg.channel.send('There was an unexpected error!');
    }
    if (statusCode == '401') {
        return msg.channel.send('The bot can\' access that data');
    }
    if (statusCode == '403') {
        return msg.channel.send('The bot hasn\'t got permission to access that data!');
    }
    if (statusCode == '404') {
        return msg.channel.send('This summoner does not exist!');
    } else {
        return msg.channel.send('There was an unexpected error!');
    }
}

async function createEmbed(msg, rank, summoner) {
    const embed = new MessageEmbed()
        .setTitle(summoner.name)
        .setColor('#3587ff')
        .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/10.8.1/img/profileicon/${summoner.profileIconId}.png`);
    msg.channel.send(embed);
}

function getRankById(msg, id, summoner) {
    leagueJs.League
        .gettingEntriesForSummonerId(id)
        .then(rank => {
            'use strict';
            if (rank) {
                console.log(rank);
                createEmbed(msg, rank, summoner);
            }
        })
        .catch(err => {
            'use strict';
            console.log(err);
            sendErrorMessage(msg, err.statusCode);
        })
}


function getSummonerByName(msg, summonerName) {
    leagueJs.Summoner
        .gettingByName(summonerName)
        .then(summoner => {
            'use strict';
            console.log(summoner);
            getRankById(msg, summoner.id, summoner);
        })
        .catch(err => {
            'use strict';
            console.log(err);
            sendErrorMessage(msg, err.statusCode);
        })
}


module.exports = {
    name: 'summoner',
    description: 'Command to display data for a specific summoner',
    args: true,
    cooldown: 3,
    execute(msg, args) {
        getSummonerByName(msg, args.join(' '));
    }
};