'use strict'
// Dependencies =========================
const Twit = require('twit');
const download = require('download');
const ura = require('unique-random-array');
const config = require('./config');

const strings = require('./helpers/strings');
const giphy = require('./helpers/giphy');

const T = new Twit({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token: config.twitter.accessToken,
  access_token_secret: config.twitter.accessTokenSecret
})



function run() {
  console.log("Start running...");
  
  let tag = ura(strings.tags)();
  giphy.get(tag)
    .then((url) => {
      console.log(`Found a gif: ${url}`);
      return download(url, config.downloadOps);
    })
    .then((image) => {
      console.log(`Downloaded the gif`);
      return T.post('media/upload', { media_data: image });
    })
    .then((mediaData) => {
      console.log(`Uploaded the gif`);
      console.log(mediaData.data);
      if (mediaData.data.errors) {
        throw (mediaData.data.errors);
      }
      let mediaIdStr = mediaData.data.media_id_string;
      let params = { status: `JBOT: #${tag}`, media_ids: [mediaIdStr] };
      return T.post('statuses/update', params);
    })
    .then((updateRes) => {
      console.log('Created a post with the gif');
    })
    .catch((err) => {
      console.error(err);
    });
}

run();
