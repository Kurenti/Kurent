#########################################
# ModelReader.py_________________________
# A quick python script that reads a .obj
# file and saves it as .json
#########################################
from argparse import ArgumentParser
import json

parser = ArgumentParser(description="Read a .obj into a .json file")
#Script can tako two arguments: -name of input .obj file
#								-name of output .json file
parser.add_argument("-in", "--inputFile", action = "store", type = str, \
		 			default = "kurent.obj", help = "Input .obj file")
parser.add_argument("-out", "--outputFile", action = "store", type = str, \
		 			default = "0", help = "Output .json file")
args = parser.parse_args()
inFile  = args.inputFile
outFile = args.outputFile

#If outFile stays default change it to same as input file
if outFile == "0":
	outFile = inFile.split(".obj")[0] + ".json"

with open(inFile, "r") as inOBJ, open(outFile, "w") as outJSON:

	modelData = {}
	modelData["vertices"] = []
	modelData["vertexNormals"] = []
	modelData["faces"] = []

	for line in inOBJ:

		if not len(line):
			continue

		if line[0] == "v":
			modelData["vertices"] += [float(x) for x in line.split()[1:]];

		elif line[0] == "vn":
			modelData["vertexNormals"] += [float(x) for x in line.split()[1:]];

		elif line[0] == "f":
			modelData["faces"] += [int(x.split("//")[0]) - 1 for x in line.split()[1:]]

	json.dump(modelData, outJSON)