#!/usr/bin/python
import csv
import json
import random
import sys

header = None
labs = {}
cmds = []
for line in csv.reader(open("iris.csv")):
    if header==None:
        header = line
        continue
    line = dict(zip(header, line))
    if line["Species"] not in labs:
        labs[line["Species"]] = str(len(labs) + 1)
    line["Species"] = labs[line["Species"]]
    line = {
        "features": {k: v for k,v in line.items() if k!="Species"},
        "label": line["Species"]
    }
    endpoint = "train"
    if len(sys.argv) > 1:
        line.pop("label")
        endpoint = "predict"
    cmd = """curl -X POST -H "Content-type: application/json" -d '%s' localhost:3000/""" + endpoint

    cmds.append(cmd % json.dumps(line))

random.shuffle(cmds)
for cmd in cmds:
    print cmd
