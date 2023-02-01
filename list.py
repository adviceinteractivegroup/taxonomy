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
args = parser.parse_args()

with open("taxonomy.csv", "r") as csvfile:
  cats = csv.DictReader(csvfile)
  for cat in cats:
    print(cat['gcid'])
  sys.exit(1)
