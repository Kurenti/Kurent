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
	modelData["verticesByColor"] = []

	#Temp vertex and vertex normal lists
	vertices = []
	vertexNormals = []
	color = 0
	vertI = 0
	#vertI is used for counting index of vertices in the end modelData["vertices"]
	#list for correct vert indexes in modelData["faces"]

	#Now traverse the .obj file dealing with each line appropriatelly
	for line in inOBJ:

		if not len(line):
			continue

		#Add normals and vertices to temporary lists of vertices and normals
		#(where each vert/normal is represented by a list of len 3)
		if line[:2] == "vn":
			vertexNormals.append([float(x) for x in line.split()[1:]]);

		elif line[0] == "v":
			vertices.append([float(x) for x in line.split()[1:]]);

		#If during faces reach a "usemtl" line, increment the color index we will
		#be adding vertices to. It would make sense to fill a modelData["colors"]
		#list here, but that would require correct reading of .mtl files - for
		#now just mark how many vertices each color has, construct the colors
		#list in .js when making an object and manually set color values
		elif line[:6] == "usemtl":
			modelData["verticesByColor"].append(0)

		#Finally when reaching the faces, fill the end output dict. Each face will
		#have it's own 3 vertices and 3 normals. Takes more space but easy for WebGL.
		elif line[0] == "f":
			face = line.split()[1:]
			modelData["vertices"] += vertices[int(face[0].split("//")[0]) - 1]  + \
									 vertices[int(face[1].split("//")[0]) - 1]  + \
									 vertices[int(face[2].split("//")[0]) - 1]
			modelData["vertexNormals"] += vertexNormals[int(face[0].split("//")[1]) - 1]  + \
										  vertexNormals[int(face[1].split("//")[1]) - 1]  + \
										  vertexNormals[int(face[2].split("//")[1]) - 1]
			modelData["faces"] += [vertI, vertI + 1, vertI + 2]
			vertI += 3
			modelData["verticesByColor"][-1] += 3

	print("Vertices: " + str(len(modelData["vertices"])/3) + \
		  ", vertices by color: " + str(modelData["verticesByColor"]))

	json.dump(modelData, outJSON)