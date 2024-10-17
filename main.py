import arcgis.gis as arcgis

gis = arcgis.GIS(url="https://uwaterloo.maps.arcgis.com/portal")
print("Logged in as anonymous user to " + gis.properties.portalName)
# Search for 'USA major cities' feature layer collection
# search_results = gis.content.get("c74d7fc3a8874d1aae3afe98c7cdca26")
#
# # Access the first Item that's returned
# major_cities_item = search_results[0]