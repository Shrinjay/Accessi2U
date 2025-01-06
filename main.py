import json
import io

stairs_file = "./data/stairs_partial.json"
floors_file = "./data/floors_partial.json"
rooms_file = "./data/rooms_partial.json"
# Explore
def get_geometry_types(path: str):
    stairs_file = io.open(path)
    stairs = json.load(stairs_file)

    feature_geometries = [feature['geometry'] for feature in stairs['features']]
    geometry_types = set()

    for geometry in feature_geometries:
        geometry_types.add(geometry['type'])

    print(path, geometry_types)


for path in [stairs_file, floors_file, rooms_file]:
    get_geometry_types(path)

# outcome
# stairs are line strings or multi line strings
# floors are polygons or multipolygons
# rooms are polygons

# explore room types
rooms = json.load(io.open(rooms_file))
feature_properties = [feature['properties'] for feature in rooms['features']]
room_standards = [p['rm_standard'] for p in feature_properties]
cat_descs = [p['cat_desc'] for p in feature_properties]
print(set(room_standards))
print(set(cat_descs))

corridors = [p for p in feature_properties if p['rm_standard'] == 'Corridor/Circulation Area']
outfile = io.open('./data/out.json', 'w')
json.dump(corridors, outfile)

# rm_standard = Unassigned/Inactive Assignable, Stairs, Elevators
# cat_desc = Net Non-Assignable Space