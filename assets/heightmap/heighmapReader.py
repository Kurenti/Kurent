###########################################
# HeightmapReader.py_______________________
# A quick python script that reads an image
# heightmap and saves it as json
###########################################
from PIL import Image
from argparse import ArgumentParser
import json
#Script requires an outside library PIL (or Pillow for python 3)

parser = ArgumentParser(description="Read a heightmap into a js file")
parser.add_argument("-f", "--fileName", action = "store", type = str, \
		 			default = "testHeightmap.bmp", help = "Heightmap image file")
parser.add_argument("-s", "--scaleFactor", action = "store", type = int, \
		 			default = 15.0, help = "Factor of y scaling (inverse) of given heightmap")
parser.add_argument("-t", "--makeJS", action = "store_true", \
		 			help = "Factor of y scaling (inverse) of given heightmap")
#So, I still left an option to make an improvised .js file that can be imported as global
args = parser.parse_args()
heightmapName = args.fileName
yScale 		  = args.scaleFactor
makeJS 		  = args.makeJS

heightmap = Image.open(heightmapName, "r")

#Output files is saved as heightmapName.json (without .imgtype suffix)
with open(".".join(heightmapName.split(".")[:-1]) + ".json", "w") as outJSON:

	if makeJS:
		outJS = open(".".join(heightmapName.split(".")[:-1]) + ".js", "w")

	heightmapData = {}
	imgWidth, imgDepth = heightmap.size

	#json contains map Width, Depth and the vertices
	heightmapData["heightmapWidth"] = imgWidth;
	heightmapData["heightmapDepth"] = imgDepth;
	heightmapData["heightmapVertices"] = []

	if makeJS:
		outJS.write("var " + ".".join(heightmapName.split(".")[:-1]) + "Width = " + str(imgWidth) + ";\n");
		outJS.write("var " + ".".join(heightmapName.split(".")[:-1]) + "Depth = " + str(imgDepth) + ";\n");
		outJS.write("var " + ".".join(heightmapName.split(".")[:-1]) + "Vertices = [\n")

	vertexList = heightmap.getdata()

	for i, pixel in enumerate(vertexList):

		heightmapData["heightmapVertices"] += [i % imgWidth, pixel[0]/(1.0*yScale), i//imgWidth]

		if makeJS:
			vertex = "\t" + str(i % imgWidth) + ", " + str(pixel[0]/(1.0*yScale)) + ", " + str(i//imgWidth)
			if i < len(vertexList) - 1:
				vertex += ","
			vertex += "\n"

			outJS.write(vertex)

	json.dump(heightmapData, outJSON)

	if makeJS:
		outJS.write("];")