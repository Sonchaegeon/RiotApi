const express = require('express');
const bodyParser = require('body-parser');
const api = require('./models/league');

const app = express();

const port = process.env.PORT || 3000;
const analytics = `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-LYFVG3S0GM"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-LYFVG3S0GM');
</script>`;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    res.render('index', {analytics: analytics});
});

app.get('/search', async (req, res, next) => {
    try{
        const summoner = await api.SummonerName(req.query.name);
        const ranking = await api.GetRanking(req.query.name);
        const rank = await api.Rank(summoner.id);
        const matchLists = await api.GetMatcheLists(summoner.accountId);
        const matches = await api.GetMatches(matchLists[0].gameId);
        const champName = await api.GetChampName(matchLists[0].champion);
        const participant = await api.GetParticipants(matches.participants, matchLists[0].champion);
        res.render('summoner', {
            //Analytics
            analytics: analytics,

            //Summoner
            name: summoner.name,
            level: summoner.summonerLevel,

            //Rank
            tier: rank.tier,
            rank: rank.rank,
            lp: rank.lp,
            win: rank.win,
            lose: rank.lose,
            ranking: ranking,

            //Matches
            champion: champName,
            gameWin: participant.win,
            kill: participant.kill,
            death: participant.death,
            assist: participant.assist,
            lane: participant.lane,
            items: participant.items,
        });
    } catch (e){
        console.log(e);
        if(e.response.status === 404) next(new Error("소환사를 찾을 수 없습니다"));
        else next(new Error("ERROR"));
    }
});
app.use(function (error, req, res, next) {
    res.render('error', { error: error.message });
})

app.listen(port, () => {
    console.log("server running on 80");
});