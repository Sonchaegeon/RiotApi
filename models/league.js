const axios = require('axios');
var api_key = "RGAPI-8038082f-0b17-4f03-afa0-d7dc5c8ac696";
var champJsonVersion = "10.22.1";
module.exports = {
    SummonerName: async (req) => {
        var summonerName = (encodeURI(req.query.name));
        const response = await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${api_key}`)
        if(response.status === 404) throw error;
        else return response.data;
    },
    Rank: async (summonerId) => {
        const response = await axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${api_key}`)
        if(response.data.length == 0) return "Unranked";
        else{
            let obj = {};
            const data = response.data[0];
            obj.tier = data.tier;
            obj.rank = data.rank;
            obj.lp = data.leaguePoints;
            obj.win = data.wins;
            obj.lose = data.losses;
            return obj;
        }
   },
    GetChampName: async (id) => {
        const response = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${champJsonVersion}/data/ko_KR/champion.json`)
        const championList = response.data.data;
        for(var i in championList){
            if(championList[i].key == id){
                return championList[i].name;
            }
        }
    },
    GetMatcheLists: async (summonerAccountId) => {
        const response = await axios.get(`https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerAccountId}?api_key=${api_key}`)
        return response.data.matches;
    },
    GetMatches: async (matchId) => {
        const response = await axios.get(`https://kr.api.riotgames.com/lol/match/v4/matches/${matchId}?api_key=${api_key}`)
        return response.data;
    },
    GetParticipants: async (participants, championId) => {
        let participantId;
        let player;
        let obj = {};
        for(var i = 0; i < 10; i++){
            if(participants[i].championId == championId){
                participantId = i;
            }
        }
        player = participants[participantId];
        obj.win = player.stats.win;
        obj.kill = player.stats.kills;
        obj.death = player.stats.deaths;
        obj.assist = player.stats.assists;
        obj.lane = player.timeline.lane;
        return obj;
    },
}