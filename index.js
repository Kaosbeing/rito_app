// API Key needed to access API. Resetted every 24 hrs
import fs from 'fs';
import fetch from 'node-fetch'
import * as summoner from "./functions/summoner.js";
import * as mastery from "./functions/mastery.js";
import * as match from "./functions/matches.js";

// Array of Summoners to get datas from
let summonerToFetch = ["Whitewolf47"];
let fetchedSummonerData;

// Actual main part of the code
for (let i = 0; i < summonerToFetch.length; i++) {

    fetchedSummonerData = await summoner.fetchSummoner(summonerToFetch[i]);
    summoner.add(fetchedSummonerData);

    if (fetchedSummonerData != null) {
        await mastery.update(fetchedSummonerData.id);
    }

    //let matchToFetch = await match.fetchMatch("EUW1_5661641920");
    //match.findKDA(fetchedSummonerData)
    let matchList = await match.fetchLastMatchesID(fetchedSummonerData.puuid, 0, 5);
    matchList.forEach(element => {
        match.add(element);
    });
    match.findAverageKDA(fetchedSummonerData)
    //console.log("=========================================================================");
    //console.log("La meilleure mastery de " + fetchedSummonerData.name + " est " + getChampName(mastery.best(fetchedSummonerData.id).championId) + " avec " + mastery.best(fetchedSummonerData.id).championPoints + " points !");
    //console.log("Lien vers sa pp : " + getPicLinkByID(fetchedSummonerData.profileIconId));
    //console.log("=========================================================================");
}



// Some functions i had nowhere else to put 

/**
 * Get the name of a champ with it's ID using champion.json DDragon database
 * @param {championId} id id of a champion
 * @returns name of a champion
 */
function getChampName(id) {
    let champions = JSON.parse(fs.readFileSync('./data/champion.json'));
    for (const [key, value] of Object.entries(champions.data)) {
        if (id == value.key) {
            return key;
        }
    }
}

// Fetch "all champs" data json i guess
async function fetchChampions() {
    let link = "http://ddragon.leagueoflegends.com/cdn/12.1.1/data/en_US/champion.json";
    let response = await fetch(link);

    let data = await response.json();
    fs.writeFileSync('./data/champion.json', JSON.stringify(data));
}

// Return the link of a pfp from its ID
function getPicLinkByID(id) {
    let link = "http://ddragon.leagueoflegends.com/cdn/11.24.1/img/profileicon/" + id + ".png";
    return link;
}