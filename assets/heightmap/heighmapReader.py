###########################################
# HeightmapReader.py_______________________
# A quick python script that reads an image
# heightmap and saves it as js
###########################################
from PIL import Image
from argparse import ArgumentParser
#Script requires an outside library PIL (or Pillow for python 3)

parser = ArgumentParser(description="Read a heightmap into a js file")
parser.add_argument("fileName", action = "store", type = str, \
		 			help = "Heightmap image file")
args = parser.parse_args()
heightmapName = args.fileName


with open(heightmapName + ".js", "w") as outF:
	#TODO: make this save as json!
	heightmap = Image.open(heightmapName + ".bmp", "r")
	imgWidth, imgHeight = heightmap.size

	outF.write("var " + heightmapName + "Width = " + str(imgWidth) + ";\n");
	outF.write("var " + heightmapName + "Depth = " + str(imgHeight) + ";\n");

	vertexList = heightmap.getdata()

	outF.write("var " + heightmapName + "Vertices = [\n")

	for i, pixel in enumerate(vertexList):
	
		vertex = "\t" + str(i % imgWidth) + ", " + str(pixel[0]/15.0) + ", " + str(i//imgWidth)
		if i < len(vertexList):
			vertex += ","
		vertex += "\n"

		outF.write(vertex)

	outF.write("];")