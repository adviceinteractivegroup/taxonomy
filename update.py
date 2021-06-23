#!/usr/bin/env python3
import csv
from pydash import _
import re
import argparse
from Levenshtein import distance
import sys
import json
import subprocess

# parse arguments
parser = argparse.ArgumentParser(description = "Adds or edits a category in the taxonomy")
parser.add_argument("--add", help='The partner id or email', action='store_true')
parser.add_argument("--name", help='The name of the category', type=str)
parser.add_argument("--gcid", help='The cateogry (without the gcid: prefix)', type=str, required=True)
parser.add_argument("--search", help='Keyword to search for when choosing categories', type=str, required=True)
args = parser.parse_args()

# pull directory category data
def getDirectory(directory):
  result = subprocess.run(['node', 'export.js', directory], capture_output=True)
  try:
    return json.loads(result.stdout)
  except:
    print("No categories for {}".format(directory))
    return { "categories": [] }

# show matches for a given set of categories, key, and search criteria
def filterCats(cats, key, search):
  results = []
  for cat in cats:
    subject = cat[key]
    if subject.find(search) != -1:
      results.append(subject)
  return results

def displayCats(results):
  index = 1
  for cat in results:
    print("{}) {}".format(index, json.dumps(cat)))
    index += 1
    if index > 20:
      return

# load up the taxonomy
categories = []
with open("taxonomy.csv", "r") as csvfile:
  cats = csv.DictReader(csvfile)
  for cat in cats:
    categories.append(cat)

  if args.add is True:
    categories.append({'gcid': 'gcid:{}'.format(args.gcid)})

  print ("Supported directories")
  directories = _.keys(categories[0])
  print(directories)

  find = _.find(categories, { 'gcid': "gcid:{}".format(args.gcid) })
  if find is None:
    find = {}
  
  for directory in directories:
    # handle gcid condition
    if directory == 'google':
      find['google'] = args.name
      continue

    # handle gcid condition
    if directory == 'googleEs':
      find['googleEs'] = args.name
      continue

    # handle gcid condition
    if directory == 'gcid':
      find['gcid'] = args.gcid
      continue


    # handle gcid condition
    if directory == 'gmb':
      find['gmb'] = args.gcid
      continue

    data = getDirectory(directory)
    cats = _.get(data, 'categories', [])

    # select the right key to look for
    key = "title"
    if directory == "apple":
      key = "name"

    # display selection
    print("")
    print(directory.upper())
    print("current category: {}".format(find[directory]))
    matches = filterCats(data['categories'], key, args.search)
    if len(matches) < 1:
      print("...no matches for {}".format(directory))
      continue

    # if there are matches, choose
    displayCats(matches)
    selection = input("Enter a category (or 0 to skip): ")

    if int(selection) > 0:
      selected = _.get(matches, int(selection) - 1)
      print("selected: {}".format(selected))

      find[directory] = selected

categories.append(find)
with open("taxonomy.csv", "w") as output:
  writer = csv.DictWriter(output, fieldnames=_.keys(categories[0]))
  writer.writeheader()
  writer.writerows(categories)

print("Done")