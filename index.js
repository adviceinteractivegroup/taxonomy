'use strict';

const csv = require('csvtojson');
const _ = require('lodash');

// simple find
const find = async (gcid, directory, done) => {
  try {
    const csvFilePath = `${__dirname}/taxonomy.csv`;
    const cats = await csv().fromFile(csvFilePath);
    let google = _.filter(cats, {gcid: gcid});
    if (google.length < 1) {
      return done('could not find gcid')
    }
    if (_.get(google, `0.${directory}`)) {
      return done(null, _.get(google, `0.${directory}`));
    }
    return done('no mapping for directory');
  } catch (error) {
    return done(error);
  };
};

module.exports = {
  find
};
