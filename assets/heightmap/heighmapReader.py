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

#Init data
heightmap = Image.open(heightmapName, "r")
heightmapData = {}
imgWidth, imgDepth = heightmap.size
stripDepth = 30

def initAtributes(k):
	heightmapData[k] = {}
	heightmapData[k]["heightmapWidth"] = imgWidth
	heightmapData[k]["heightmapDepth"] = min(stripDepth, imgDepth - k*stripDepth)
	heightmapData[k]["heightmapX"] = 0
	heightmapData[k]["heightmapZ"] = k*stripDepth
	heightmapData[k]["heightmapNVertices"] = 0
	heightmapData[k]["heightmapNVertexIndices"] = 0
	heightmapData[k]["heightmapVertices"] = []
	heightmapData[k]["heightmapNormals"] = []
	heightmapData[k]["heightmapVertexIndices"] = []

#Output files is saved as heightmapName.json (without .imgtype suffix)
with open(".".join(heightmapName.split(".")[:-1]) + ".json", "w") as outJSON:

	vertexList = heightmap.getdata()

	#Simple one-entry-per-vertex format:
	#for i, pixel in enumerate(vertexList):
	#	heightmapData["heightmapVertices"] += [i % imgWidth, pixel[0]/(1.0*yScale), i//imgWidth]


	#Json object contains k numbered dicts: each dict represents
	#a strip of landscape in X direction, because it is
	#easier for WebJS to deal with smaller objects
	#Each dict contains-map Width, Depth
	#				   -starting z
	# 				   -vertices, n of vertices
	#				   -normals
	#				   -vertex indices, n of vertex indices
	k = 0
	initAtributes(k)

	#Walk over quads between pixels . this creatues huge arays,
	#because each vertex is added 6 damn times
	for i in range(imgDepth-1):

		#Every stripDepth lines make a new dict in heightmapData
		if (i - (k*stripDepth) >= stripDepth):
			k += 1
			initAtributes(k)
			print("New landscape strip...")

		for j in range(imgWidth-1):

			#Define vertices, we will need them later for normals
			vert1 = [j, vertexList[i*imgWidth + j][0]/(1.0*yScale), i]			#Upper left vert
			vert2 = [j+1, vertexList[i*imgWidth + j+1][0]/(1.0*yScale), i]		#Upper right vert
			vert3 = [j+1, vertexList[(i+1)*imgWidth + j+1][0]/(1.0*yScale), i+1]#Lower right vert
			vert4 = [j, vertexList[(i+1)*imgWidth + j][0]/(1.0*yScale), i+1]	#Lower left vert

			#Add upper left triangle and lower right triangle vertices
			vertBlob = vert1 + vert2 + vert4 + \
					   vert2 + vert3 + vert4
			heightmapData[k]["heightmapVertices"] += vertBlob
			heightmapData[k]["heightmapNVertices"] += 6

			#Add the two triangles
			heightmapData[k]["heightmapVertexIndices"] += [
				#((i reduced for previous strips)*(strip length) + position in row) * (6=vertices per square) + n of vertex in square
				#Upper left triangle
				((i-k*stripDepth)*(imgWidth-1) + j)*6,
				((i-k*stripDepth)*(imgWidth-1) + j)*6 + 1, 
				((i-k*stripDepth)*(imgWidth-1) + j)*6 + 2,	
				#Lower right triangle
				((i-k*stripDepth)*(imgWidth-1) + j)*6 + 3,
				((i-k*stripDepth)*(imgWidth-1) + j)*6 + 4,
				((i-k*stripDepth)*(imgWidth-1) + j)*6 + 5
			]
			heightmapData[k]["heightmapNVertexIndices"] += 6

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
			heightmapData[k]["heightmapNormals"] += normalsBlob

		print("line " + str(i))


	#Dump to JSON object
	json.dump(heightmapData, outJSON)