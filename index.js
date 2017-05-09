'use strict';

let csv = require('csvtojson');
let _ = require('lodash');

// simple find
module.exports.find  = (gcid, directory, done) => {
  let cats = [];
  csv().fromFile('./taxonomy.csv')
  .on('json', data => {
    cats.push(data);
  })
  .on('done', err => {
    if (err) {
      return done(err);
    }

    let google = _.filter(cats, {gcid: gcid});
    if (google.length < 1) {
      return done('could not find gcid')
    }

    if (_.get(google, `0.${directory}`)) {
      return done(null, _.get(google, `0.${directory}`));
    }
    return done('no mapping for directory');
  });
};
