###########################################
# HeightmapReader.py_______________________
# A quick python script that reads an image
# heightmap and saves it as json
###########################################
from PIL import Image
from argparse import ArgumentParser
import math
import json
import numpy
#Script requires an outside libraries PIL (or Pillow for python 3) and NumPy

parser = ArgumentParser(description="Read a heightmap into a js file")
parser.add_argument("-f", "--fileName", action = "store", type = str, \
		 			default = "testHeightmap.bmp", help = "Heightmap image file")
parser.add_argument("-s", "--scaleFactor", action = "store", type = int, \
		 			default = 15.0, help = "Factor of y scaling (inverse) of given heightmap")
args = parser.parse_args()
heightmapName = args.fileName
yScale 		  = args.scaleFactor

heightmap = Image.open(heightmapName, "r")

#Output files is saved as heightmapName.json (without .imgtype suffix)
with open(".".join(heightmapName.split(".")[:-1]) + ".json", "w") as outJSON:

	heightmapData = {}
	imgWidth, imgDepth = heightmap.size

	#json contains map Width, Depth and the vertices
	heightmapData["heightmapWidth"] = imgWidth
	heightmapData["heightmapDepth"] = imgDepth
	heightmapData["heightmapNVertices"] = 0
	heightmapData["heightmapNVertexIndices"] = 0
	heightmapData["heightmapVertices"] = []
	heightmapData["heightmapNormals"] = []
	heightmapData["heightmapVertexIndices"] = []

	vertexList = heightmap.getdata()

	#Simple one-entry-per-vertex format:
	#for i, pixel in enumerate(vertexList):
	#	heightmapData["heightmapVertices"] += [i % imgWidth, pixel[0]/(1.0*yScale), i//imgWidth]

	#Walk over quads between pixels . this creatues huge arays,
	#because each vertex is added 6 damn times
	for i in range(imgDepth-1):
		for j in range(imgWidth-1):

			#Define vertices, we will need them later for normals
			vert1 = [j, vertexList[i*imgWidth + j][0]/(1.0*yScale), i]			#Upper left vert
			vert2 = [j+1, vertexList[i*imgWidth + j+1][0]/(1.0*yScale), i]		#Upper right vert
			vert3 = [j+1, vertexList[(i+1)*imgWidth + j+1][0]/(1.0*yScale), i+1]#Lower right vert
			vert4 = [j, vertexList[(i+1)*imgWidth + j][0]/(1.0*yScale), i+1]	#Lower left vert

			#Add upper left triangle and lower right triangle vertices
			vertBlob = vert1 + vert2 + vert4 + \
					   vert2 + vert3 + vert4
			heightmapData["heightmapVertices"] += vertBlob
			heightmapData["heightmapNVertices"] += 6

			#Add the two triangles
			heightmapData["heightmapVertexIndices"] += [
				(i*imgWidth + j)*6, (i*imgWidth + j)*6 + 1, (i*imgWidth + j)*6 + 2,		#Upper left triangle
				(i*imgWidth + j)*6 + 3, (i*imgWidth + j)*6 + 4, (i*imgWidth + j)*6 + 5	#Lower right triangle
			]
			heightmapData["heightmapNVertexIndices"] += 6

			#Calculate the normals of two triangles
			ULtriangleNormal = numpy.cross(numpy.subtract(vert4, vert1), numpy.subtract(vert2, vert1))
			ULtriangleNormal = ULtriangleNormal / math.sqrt( \
				ULtriangleNormal[0]*ULtriangleNormal[0] + \
				ULtriangleNormal[1]*ULtriangleNormal[1] + \
				ULtriangleNormal[2]*ULtriangleNormal[2] )
			LRtriangleNormal = numpy.cross(numpy.subtract(vert2, vert3), numpy.subtract(vert4, vert3))
			LRtriangleNormal = LRtriangleNormal / math.sqrt( \
				LRtriangleNormal[0]*LRtriangleNormal[0] + \
				LRtriangleNormal[1]*LRtriangleNormal[1] + \
				LRtriangleNormal[2]*LRtriangleNormal[2] )

			#Add one of two triangle normals to the 6 vertices
			normalsBlob = ULtriangleNormal.tolist() + \
						  ULtriangleNormal.tolist() + \
						  ULtriangleNormal.tolist() + \
						  LRtriangleNormal.tolist() + \
						  LRtriangleNormal.tolist() + \
						  LRtriangleNormal.tolist()
			heightmapData["heightmapNormals"] += normalsBlob

		print("line " + str(i))

	#Dump to JSON object
	json.dump(heightmapData, outJSON)