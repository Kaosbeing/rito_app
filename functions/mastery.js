import fs from 'fs';
import fetch from 'node-fetch'
import config from './../config.js';
let apiKey = config['api-key'];

// Fetch a summoner's Masteries with it's ID
export async function fetchMastery(id) {
    let link = "https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + id + "?api_key=" + apiKey;
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
 * Update the masteries of a summoner (add it if it does not exists already)
 * @param {summonerId} id encrypted summoner id
 */
export async function update(id) {
    let masteryArray = JSON.parse(fs.readFileSync('./data/masteries.json'));
    let theMastery = await fetchMastery(id);

    if (masteryExists(id)) {
        let masteryIndex = find(id);
        masteryArray[masteryIndex] = theMastery;
    } else {
        masteryArray.push(theMastery)
    }
    fs.writeFileSync('./data/masteries.json', JSON.stringify(masteryArray))
}

/**
 * [UNSTABLE I THINK] Get the best mastery from a summoner
 * 
 * Given the Mastery array is already sorted, the first being the best, it's pretty easy
 * @param {summonerId} id id of a ``summoner``
 * @returns best masteries of given summoner.
 */
export function best(id) {
    let masteryArray = JSON.parse(fs.readFileSync('./data/masteries.json'));
    let summonerIndex = find(id);
    if (summonerIndex == null) { return; }
    return masteryArray[summonerIndex][0];
}

/**
 * Return true if the mastery exists
 * @param {summonerId} id encrypted summoner id
 * @returns true if it exists, false if it doesnt
 */
function masteryExists(id) {
    let masteryArray = JSON.parse(fs.readFileSync('./data/masteries.json'));
    let found = false;
    masteryArray.forEach(mastery => {
        if (mastery[0].summonerId == id) {
            found = true;
        }
    });
    return found;
}

/**
 * Find the Masteries of a Summoner into the Database
 * @param {summonerId} id encrypted summoner id
 * @returns index of the masteries or null if the mastery doesnt exists
 */
export function find(id) {
    let masteryArray = JSON.parse(fs.readFileSync('./data/masteries.json'));
    // Return null if summoner doesn't exists in database
    if (!masteryExists(id)) {
        return null;
    }
    let masteryIndex;
    masteryArray.forEach(mastery => {
        if (mastery[0].summonerId == id) {
            masteryIndex = masteryArray.indexOf(mastery);
        }
    });
    return masteryIndex;
}
