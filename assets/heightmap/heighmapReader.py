#What a fucking tuna language js is
from PIL import Image

heightmapName = "testHeightmap"

with open(heightmapName + ".js", "w") as outF:

	heightmap = Image.open(heightmapName + ".bmp", "r")
	imgWidth, imgHeight = heightmap.size

	outF.write("var " + heightmapName + "Width = " + str(imgWidth) + ";\n");
	outF.write("var " + heightmapName + "Depth = " + str(imgHeight) + ";\n");

	vertexList = heightmap.getdata()

	outF.write("var " + heightmapName + "Vertices = [\n")

	for i, pixel in enumerate(vertexList):
	
		vertex = "\t" + str(i % imgWidth) + ", " + str(pixel[0]//15) + ", " + str(i//imgWidth)
		if i < len(vertexList):
			vertex += ","
		vertex += "\n"

		outF.write(vertex)

	outF.write("];")