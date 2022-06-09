//
//  RTD2 - Twitter bot that tweets about the most popular github.com news
//  Also makes new friends and prunes its followings.
//
var Bot = require('./bot')
    , config = require('./bata_config');

var bot = new Bot(config);

console.log('BATA: Running.');

//get date string for today's date (e.g. '2011-01-01')
function datestring() {
    var d = new Date(Date.now() - 5 * 60 * 60 * 1000);  //est timezone
    return d.getUTCFullYear() + '-'
        + (d.getUTCMonth() + 1) + '-'
        + d.getDate();
};

//setInterval(function () {
    bot.twit.get('direct_messages', {count: 10, since_id: 0}, function (err, dm) {
        if (err) return handleError(err);
        console.log('\n# dir.msg:' + dm.length.toString());
        for(var i=0; i<dm.length; i++){
            var d = dm[i];
            console.log(d.sender_id, d.sender_screen_name, d.text, d.since_id);
        }
    });

    var rand = Math.random();


//}, 40000);

function handleError(err) {
    console.error('response status:', err.statusCode);
    console.error('data:', err.data);
}
