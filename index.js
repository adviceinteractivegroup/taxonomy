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

// given a directory and array of categories returns the first match
// example: 
// input { directory: 'infogroup', categories: ['Educational programs', 'adult Education school', 'schools Adult education academic'] }
// output: { gcid: 'gcid:adult_education_school', category: 'educational programs' }
// example. how to use it
// let res = findBestGcidMatch({ directory: 'infogroup', categories: ['Educational programs', 'adult Education school', 'schools Adult education academic'] })
//   .then(result => {
//     console.log(result);
//   })
//   .catch(err => err);
const findBestGcidMatch = ({ directory, categories }) => {
  return new Promise((resolve, reject) => {
    let result = false;
    return csv()
      .fromFile(`${__dirname}/taxonomy.csv`)
      .then(cats => {
        const taxonomy = cats.map(cat => ({ gcid: cat.gcid, category: cat[directory] }));
        _.forEach(categories, cat => {
          if (result = taxonomy.find(tax => tax.category && tax.category.toLowerCase() === cat.toLowerCase())) {
            return false
          }
        });
        return resolve(result || false);
      })
      .catch(err => reject(err));
  });
};

/* example of use:
getArrayOfMatches({
  directoryIn: 'google',
  directoryOut: 'gcid',
  categories: [
    "car wash",
    "Lighting Manufacturer",
    "lighting manufacturer",
    "License bureau"
  ]
});
*/
const getArrayOfMatches = ({ directoryIn, directoryOut, categories }) => {
  return new Promise((resolve, reject) => {
    return csv()
      .fromFile(`${__dirname}/taxonomy.csv`)
      .then(cats => {
        let categoriesFound = [];
        categories.forEach(candidate => {
          let dbCategoriesValues = cats.map(cat => cat[directoryIn].toLowerCase());
          let categoryIndex = dbCategoriesValues.indexOf(candidate.toLowerCase());
          if (categoryIndex !== -1) {
            if (categoriesFound.indexOf(cats[categoryIndex][directoryOut]) === -1) {
              categoriesFound.push(cats[categoryIndex][directoryOut]);
            }
          }
        });
        return resolve(categoriesFound || false);
      })
      .catch(err => reject(err));
  });
};

module.exports = {
  find,
  findBestGcidMatch,
  getArrayOfMatches
};
