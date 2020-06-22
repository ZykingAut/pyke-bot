const { MessageEmbed } = require('discord.js');
const LeagueJS = require('leaguejs');
const querystring = require('querystring');
const fetch = require('node-fetch');


const leagueJs = new LeagueJS(process.env.riottoken, {
        PLATFORM_ID: 'euw1',
        limits: {
            'allowBursts': false,
            'numMaxRetries': 3,
            'intervalRetryMS': 1000,
        },
        caching: {
            isEnabled: true,
            defaults: {stdTLL: 120},
            checkperiod: 600,
            errorOnMissing: false,
            useclonse: true,
        }});


function sendErrorMessage(msg, statusCode) {
    if (statusCode == '400') {
        console.log('')
        return msg.channel.send('There was an unexpected error!');
    }
    if (statusCode == '401') {
        console.log('This data is unavailable.')
        return msg.channel.send('The bot can\' access that data');
    }
    if (statusCode == '403') {
        console.log('No access rights for this data.')
        return msg.channel.send('The bot hasn\'t got permission to access that data!');
    }
    if (statusCode == '404') {
        console.log('Summoner doesnt exist.');
        return msg.channel.send('This summoner does not exist!');
    } else {
        console.log('Problems with RIOT servers.');
        return msg.channel.send('There was an unexpected error!');
    }
}

function createEmbed(msg, flexRank, soloRank, summoner) {
    const query = querystring.stringify({ userName: summoner.name });
    if (!flexRank) {
        const embed = new MessageEmbed()
            .setTitle(summoner.name)
            .setColor('#3587ff')
            .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/10.8.1/img/profileicon/${summoner.profileIconId}.png`)
            .setURL(`https://op.gg/summoner/${query}`)
            .addFields(
                { name: 'Level', value: summoner.summonerLevel },
                { name: 'Solo/Duo', value: `${soloRank.tier} ${soloRank.rank}`, inline: true },
                { name: 'Flex', value: 'Unranked', inline: true }
            );
        console.log('Sending Embed...');
        console.log('Command finished!');
        return msg.channel.send(embed);
    } else {
        const embed = new MessageEmbed()
            .setTitle(summoner.name)
            .setColor('#3587ff')
            .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/10.8.1/img/profileicon/${summoner.profileIconId}.png`)
            .setURL(`https://op.gg/summoner/${query}`)
            .addFields(
                { name: 'Level', value: summoner.summonerLevel },
                { name: 'Solo/Duo', value: `${soloRank.tier} ${soloRank.rank}`, inline: true },
                { name: 'Flex', value: `${flexRank.tier} ${flexRank.rank}`, inline: true }
            );
        console.log('Sending Embed...');
        console.log('Command finished!');
        return msg.channel.send(embed);
    }
}

function getRankById(msg, id, summoner) {
    leagueJs.League
        .gettingEntriesForSummonerId(id)
        .then(rank => {
            'use strict';
            if (rank.length !== 0) {
                console.log(rank);
                createEmbed(msg, undefined, rank[0], summoner);
            } else {
                console.log('Stopping Creating Embed...');
                console.log('Command finished!');
                return msg.reply('this player isn\'t ranked yet.');
            }
        })
        .catch(err => {
            'use strict';
            console.log(err);
            sendErrorMessage(msg, err.statusCode);
        })
}


function getSummonerByName(summonerName) {
     leagueJs.Summoner
        .gettingByName(summonerName)
        .then(summoner => {
            'use strict';
            console.log('Fetching ranked stats...');
            return summoner;
        })
        .catch(err => {
            'use strict';
            console.log(err);
            sendErrorMessage(err.statusCode);
        });
}


module.exports = {
    name: 'summoner',
    description: 'Command to display data for a specific summoner',
    args: true,
    cooldown: 3,
    async execute(msg, args) {
        try {
            let summoner = await getSummonerByName(args.join(' '));
            console.log(summoner);
        } catch (e) {
            console.log('Error:', e);
        }
    }
}
