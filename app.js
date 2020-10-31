const express = require('express');
const bodyParser = require('body-parser');
const async = require('async');
const api = require('./models/league');

const app = express();

const port = process.env.PORT || 3000;
const analytics = `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DNBBZ7GJ99"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-DNBBZ7GJ99');
</script>`;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index', {analytics: analytics});
});

app.get('/search', async (req, res) => {
    const summoner = await api.SummonerName(req);
    const rank = await api.Rank(summoner.id);
    const matchLists = await api.GetMatcheLists(summoner.accountId);
    const matches = await api.GetMatches(matchLists[0].gameId);
    const champName = await api.GetChampName(matchLists[0].champion);
    const participant = await api.GetParticipants(matches.participants, matchLists[0].champion);
    console.log(participant);
    res.render('summoner', {
        analytics: analytics,

        //Summoner
        name: summoner.name,
        level: summoner.summonerLevel,

        //Rank
        tier: rank[0].tier,
        rank: rank[0].rank,
        lp: rank[0].leaguePoints,
        win: rank[0].wins,
        lose: rank[0].losses,

        //Matches
        champion: champName,
        win: participant.win
    });
});

app.listen(port, () => {
    console.log("server running on 80");
});