#!/usr/bin/env python3

import sys
import csv
from pydash import _
import pprint
import json

with open("taxonomy.csv", "rt") as csvfile:
  cats = []
  lines = csv.DictReader(csvfile)
  for line in lines:
    cats.append({'label': line['google'], 'value': line['gcid'].replace("gcid:", "")})
  with open("primaryCategory.js", "wt") as unicron:
    unicron.write("export default " + json.dumps(cats))
