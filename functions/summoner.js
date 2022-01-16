import fs from 'fs';
import fetch from 'node-fetch';
import config from './../config.js';
let apiKey = config['api-key'];

/**
 * Fetch summoner from Riot API
 * @param {summonerName} name name of a ``summoner``
 * @returns promise with an object as value
 */
export async function fetchSummoner(name) {
    // Converts spaces to "%20"
    while (name.includes(" ")) {
        let spaceSpot = name.indexOf(" ");
        name = name.substring(0, spaceSpot) + "%20" + name.substring(spaceSpot + 1);
    }

    let link = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + apiKey;
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
 * Add a summmoner to the Database, given it doenst exist yet
 * @param {SummonerDTO} summoner represent a ``summoner``
 */
export function add(summoner) {
    // Because fetching a summoner with a wrong name will return null
    if (summoner == null) {
        return;
    }
    if (summonerExist(summoner.name)) {
        return console.log(summoner.name + " already exists !")
    } else {
        console.log("Adding " + summoner.name + " to database.");
        let summonerList = JSON.parse(fs.readFileSync('./data/summoners.json'));
        summonerList.push(summoner);
        fs.writeFileSync('./data/summoners.json', JSON.stringify(summonerList));
    }
}

/**
 * Return summonerData in database
 * @param {summonerName} name name of a ``summoner``
 * @returns ``summoner object``
 */
export function find(name) {
    let summonerList = JSON.parse(fs.readFileSync('./data/summoners.json'));

    // Return null if summoner doesn't exists in database
    if (!summonerExist()) {
        return null;
    }
    summonerList.forEach(summoner => {
        if (summoner.name == name) {
            return summoner;
        }
    });
}

/**
 * Checks in database if summoner exists
 * @param {summonerName} name name of a summoner
 * @returns if the summoner exists in the database
 */
function summonerExist(name) {
    let summonerList = JSON.parse(fs.readFileSync('./data/summoners.json'));
    let found = false;
    summonerList.forEach(summoner => {
        if (summoner.name == name) {
            found = true;
        }
    });
    return found;
}