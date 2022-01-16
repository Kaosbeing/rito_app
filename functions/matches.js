import fs from 'fs';
import fetch from 'node-fetch'
import config from './../config.js';
let apiKey = config['api-key'];


/**
 * Fetch a match with its id
 * @param {matchId} id id of a match
 * @returns datas of a given match
 */
export async function fetchMatch(id) {
    let link = "https://europe.api.riotgames.com/lol/match/v5/matches/" + id + "?api_key=" + apiKey;
    let response = await fetch(link);
    let data = await response.json();

    // If there is any error, return null
    if (response.status != 200) {
        console.log("ERROR : " + data.status.message)
        return null;
    }
    return data;
}

/**
 * Retrieve an array of match id for a given summoner
 * @param {string} puuid Encrypted PUUID. Exact length of 78 characters.
 * @param {int} start starting index (min : 0)
 * @param {int} count number of matches id to return (max : 100)
 * @returns an array of match ids
 */
export async function fetchLastMatchesID(puuid, start, count) {
    let link = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?start=" + start + "&count=" + count + "&api_key=" + apiKey;
    let response = await fetch(link);
    let data = await response.json();

    // If there is any error, return null
    if (response.status != 200) {
        console.log("ERROR : " + data.status.message)
        return null;
    }
    return data;
}

/**
 * Fetch then add a match to the database given its id
 * @param {matchId} id id of a match
 */
export async function add(id) {
    let matchArray = JSON.parse(fs.readFileSync('./data/matches.json'));
    if (matchExists(id)) {
        return console.log("Match " + id + " already exists in database");
    }
    let matchData = await fetchMatch(id);
    matchArray.push(matchData);
    fs.writeFileSync('./data/matches.json', JSON.stringify(matchArray));
}

/**
 * Search in the database if the match already exists
 * @param {matchId} matchId id of a match
 * @returns true if the match already exists in the database
 */
function matchExists(matchId) {
    let matchArray = JSON.parse(fs.readFileSync('./data/matches.json'));
    let found = false;
    matchArray.forEach(match => {
        if (match.metadata.matchId == matchId) {
            found = true;
        }
    });
    return found;
}


/**
 * [WIP] Find the KDA of a player for a given match
 * @param {summonerDTO} summoner ``summoner`` object
 */
export function findAverageKDA(summoner) {
    let match = JSON.parse(fs.readFileSync("./data/matches.json"));
    let summonerName;
    let totalKills = 0;
    let totalDeaths = 0;
    let totalAssists = 0;
    let totalIteration = 0;

    match.forEach(element => {
        element.info.participants.forEach(participant => {
            if (participant.summonerName == summoner.name) {
                summonerName = participant.summonerName;
                totalKills += participant.kills;
                totalDeaths += participant.deaths;
                totalAssists += participant.assists;
                totalIteration++;
            }
        });
    });
    console.log("ITERATIONS : " + totalIteration);
    let moyKills = totalKills / totalIteration;
    let moyDeaths = totalDeaths / totalIteration;
    let moyAssists = totalAssists / totalIteration;

    console.log("Le kda moyen de " + summonerName + " est : " + moyKills + "/" + moyDeaths + "/" + moyAssists);
}