var Slack = require('slack-node');
var express = require('express');
var url = require('url');
var app = express();
var request = require('request');

////////////// THE SETUP ///////////////////////////////////////////

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'))

app.get('/', function(request, response) {

    var urlObject = url.parse(request.url, true).query
    console.log(urlObject)
    sendVideo(urlObject);


}); //app.get

/////////////// THE SEND MESSAGE //////////////////////////////////////////
function sendVideo(urlObject) {
    var query = urlObject.text;

    request('https://www.googleapis.com/youtube/v3/search?part=snippet&q='+ query +'&type=video&key=AIzaSyAPF280wWDUXe8i6RdW8gQ3_RnQMOP4BXk', function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("Response: ", response.body.type)
          var object = JSON.parse(response.body);
            var baseURL = 'https://www.youtube.com/watch?v=';
            var videoURL = baseURL + object.items[0].id.videoId

            slack = new Slack();
            slack.setWebhook(urlObject.response_url);

            slack.webhook({
                channel: urlObject.channel_name,

                text: videoURL

            }, function(err, response) {
                if (err) {
                    console.log(err)
                }
            });
        }
    })
}

function sendMessage(urlObject) {

    slack = new Slack();
    slack.setWebhook(urlObject.response_url);

    //   /mySlashCommand catfish    'catfish' is stored in var userCommand
    var userText = urlObject.text;

    slack.webhook({
        channel: urlObject.channel_name,

        text: "hello you typed: " + userText // the response back to slack

    }, function(err, response) {
        if (err) {
            console.log(err)
        }
    });
}

/////////////////////////////////////////////////////////
