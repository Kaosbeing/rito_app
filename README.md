# Fast Nash

So Fast Nash is a project that may remind you of any other League app, but this one is more for you to see your results and flex on your friends with it. You can currently do nothing with this, but more is to come.
There will be a website at some point, making you able to get your account infos, and make your stats (such as your highest Masteries, your Rank, your GpM or Vision Score, average/best KDA, etc), but this is for waaaaay later.

Also, not every code is commented, nor is optimized, because i'm a moron but don't worry it'll be fine someday. Until then, well...

## Architectures (kinda) :

- **./index.js** : Main

- **./config.js** : "config" file. (currently only used for API Key)

- **./data/** : Folder of every databases

  - champions.json : Contains basic informations about every champions in the game. Fetched from DDragons.
  - masteries.json : Contains every Masteries of some Summoners.
  - matches.json : Contains some Matches informations.
  - summoners.json : Contains informations about some summoners.

- **./functions/** : Folder of every "modules" (?). Contains needed functions for the thing to work.

  - mastery.js : Functions about the Masteries (fetch, find best, update, etc)
  - matches.js : Functions about matches (WIP)
  - summoner.js : Functions about Summoners (fetch, get pfp link, add to database, etc)
