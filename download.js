const fs = require('fs');
const request = require('request');
const queue = require('async').queue;
const config = require('./config.json');

const SLACK_TOKEN = config.SLACK_TOKEN;
const API_URL = `https://slack.com/api/emoji.list`;

request(
  {
    uri: API_URL,
    json: true,
    headers: { Authorization: `Bearer ${SLACK_TOKEN}` },
  },
  (err, resp, obj) => {
    downloadEmojis(obj);
  }
);

function downloadEmojis(resp) {
  const { emoji } = resp;
  const q = queue(download, 10);
  q.drain = function () {
    console.log('all emojis have been downloaded to `/downloads` folder');
  };
  Object.keys(emoji).forEach((key) => {
    q.push({ name: key, uri: emoji[key] });
  });
}

function download(obj, cb) {
  const { name, uri } = obj;
  if (!uri.startsWith('http')) {
    return cb();
  }
  request(uri)
    .on('error', (err) => {
      console.error(err);
      cb(err);
    })
    .pipe(fs.createWriteStream(`downloads/${createName(name, uri)}`))
    .on('finish', cb);
}

function createName(name, uri) {
  return `${name}.${uri.split('.').pop()}`;
}
