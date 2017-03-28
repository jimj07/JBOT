const unirest = require('unirest');
const _ = require('lodash');

let giphy = {}

giphy.get = (text) => {
  return new Promise((resolve, reject) => {
    let giphyUrl = `http://api.giphy.com/v1/gifs/random?rating=pg&api_key=${process.env.GIPHY_KEY}&tag=${text}`;
    console.log(giphyUrl);
    unirest.get(giphyUrl)
      .header('Accept', 'application/json')
      .end((res) => {
        const data = res.body
        const status = _.get(data, 'meta.status')
        if (status === 200) {
          const url = _.get(data, 'data.fixed_height_downsampled_url');
          resolve(url);
        } else {
          const msg = _.get(data, 'meta.msg');
          reject(`Error: ${msg}`);
        }
      });
  })
}

module.exports = giphy
