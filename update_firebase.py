#!/usr/bin/env python3

import sys
import csv
from pydash import _
import pprint

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

pp = pprint.PrettyPrinter(indent=4)

cred = credentials.Certificate("./praxis.json")
firebase_admin.initialize_app(cred, {
  'databaseURL': 'https://praxis-m14.firebaseio.com'
  })

ref = db.reference("categories/en")
cats = ref.get()
print(f"Before: {len(cats)} categories")

en_cats = []
es_cats = []

with open("taxonomy.csv", "rt") as csvfile:
  lines = csv.DictReader(csvfile)
  for line in lines:
    en_cats.append({ 'gcid': line['gcid'].replace("gcid:", ""), 'google': line['google'] })
    es_cats.append({ 'gcid': line['gcid'].replace("gcid:", ""), 'google': line['googleEs'] })

  ref.set(en_cats)
  ref = db.reference("categories/es")
  ref.set(es_cats)
