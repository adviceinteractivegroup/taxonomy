#!/usr/bin/env python3

import csv
import sys
from Levenshtein import distance

categories = []
append = []
empty = []
columns = []

with open('taxonomy.csv', 'r') as taxfile:
  current = csv.DictReader(taxfile)
  for category in current:
    columns = list(category.keys())
    categories.append(category)

def matchOld(category):
  best_cat = None
  best_distance = 100
  for cat in categories:
    # returrn nothing if dupe
    if cat['google'].lower() == category.lower():
      return False

    d = distance(cat['google'].lower(), category.lower())
    if d < best_distance:
      #print(f"{d} {cat['google']}")
      best_distance = d
      best_cat = cat
  if best_distance < 3:
    return best_cat

  parts = category.split()
  if len(parts) == 1:
    return None
  parts.pop(0)
  return matchOld(" ".join(parts))

with open('2023.csv', 'r') as newfile:
  newcats = csv.DictReader(newfile)
  for cat in newcats:
    found = matchOld(cat['Category'])

    # we found something close
    if found is not None and found is not False:
      found['google'] = cat['Category']
      found['gcid'] = cat['gcid']
      append.append(found)

    # nothing close
    if found is None and found is not False:
      insert = {}
      insert['google'] = cat['Category']
      insert['gcid'] = cat['gcid']
      empty.append(insert)

if len(append) > 0 or len(empty) > 0:
  print(f"Appending {len(append)} similar categories")
  print(f"Appending {len(empty)} empty categories")
  with open('taxonomy.csv', 'a') as updatedfile:
    final = csv.DictWriter(updatedfile, fieldnames = columns)
    for row in append:
      final.writerow(row)
    for row in empty:
      final.writerow(row)
