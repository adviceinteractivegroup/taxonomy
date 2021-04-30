#!/usr/bin/env python3

import csv
from pydash import _
import re
import argparse

categories = []
with open("taxonomy.csv", "r") as csvfile:
  cats = csv.DictReader(csvfile)
  gcid = input("Enter the gcid:XXXX without the prefix to add/edit: ")
  for cat in cats:
    categories.append(cat)

  find = _.find(categories, { 'gcid': "gcid:{}".format(gcid) })
  if find is None:
    print("Could not find that gcid, maybe you meant one of the following?")
