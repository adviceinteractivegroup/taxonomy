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

/*
    input: 
    { data:
        [ 
          RowDataPacket {
            TELNO: '(724) 935-2888',
            LSTNM: 'Haefner Drilling Llc',
            STRT: '110 Caromar Drive ',
            LOCNM: 'Mars',
            STATE: 'PA',
            ZIP: '16046',
            hide_address: 'false',
            gcid: 'well_drilling_contractor',
            LAT: 40.6857801,
            LON: -80.02028 
          },
          RowDataPacket {
            TELNO: '(936) 539-2886',
            LSTNM: 'Inspections Plus & Automotive Repair',
            STRT: '12222 State Hwy 105 East ',
            LOCNM: 'Conroe',
            STATE: 'TX',
            ZIP: '77303',
            hide_address: 'false',
            gcid: 'auto_repair_shop',
            LAT: 0,
            LON: 0 
          }
        ],
      directory: 'listyourself
    }
  output:
    [ 
      RowDataPacket {
        TELNO: '(724) 935-2888',
        LSTNM: 'Haefner Drilling Llc',
        STRT: '110 Caromar Drive ',
        LOCNM: 'Mars',
        STATE: 'PA',
        ZIP: '16046',
        hide_address: 'false',
        gcid: 'Water Well Drilling & Service',
        LAT: 40.6857801,
        LON: -80.02028 
      },
      RowDataPacket {
        TELNO: '(936) 539-2886',
        LSTNM: 'Inspections Plus & Automotive Repair',
        STRT: '12222 State Hwy 105 East ',
        LOCNM: 'Conroe',
        STATE: 'TX',
        ZIP: '77303',
        hide_address: 'false',
        gcid: 'Automobile - Repairs & Services',
        LAT: 0,
        LON: 0 
      }
    ]
*/
const findAll = ({ data, directory }) => {
  return new Promise((resolve, reject) => {
    return csv()
      .fromFile(`${__dirname}/taxonomy.csv`)
      .then(cats => {
        _.forEach(data, client => {
          const google = _.filter(cats, { gcid: client.gcid });
          if (google.length < 1) {
            client.gcid = null;
          }
          else if (_.get(google, `0.${directory}`)) {
            client.gcid = _.get(google, `0.${directory}`);
          }
          else {
            client.gcid = null;
          }
        });
        return resolve(data);
      })
      .catch(err => reject(err));
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
  findAll,
  findBestGcidMatch,
  getArrayOfMatches
};
