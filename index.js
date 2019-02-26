'use strict';

const csv = require('csvtojson');
const _ = require('lodash');

// simple find
const find = (gcid, directory, done) => {
  csv()
    .fromFile(`${__dirname}/taxonomy.csv`)
    .then((cats) => {
      const google = _.filter(cats, {
        gcid: gcid
      });
      if (google.length < 1) {
        return done(`Could not find gcid: "${gcid}"`)
      }

      if (_.get(google, `0.${directory}`)) {
        return done(null, _.get(google, `0.${directory}`));
      }
      return done(`No mapping for directory: "${directory}"`);
    })
    .catch((err) => {
      return done(err);
    });
};

module.exports = {
  find
};