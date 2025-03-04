"""
Placeholder to run our luigi tasks without having to use the god awful CLI
Eventually we'll have multiple scripts that invoke different pipelines for rooms/floors/buildings
"""
import luigi

from tasks.transformer.BuildRenderingEntities import BuildRenderingEntities
from tasks.transformer.BuildRooms import BuildRooms
from tasks.transformer.BuildFloors import BuildFloors
from tasks.transformer.BuildBuildings import BuildBuildings
from tasks.transformer.EdgeGen import EdgeGen
from tasks.transformer.NodeGen import NodeGen

if __name__ == '__main__':
    # Runs the build rendering entities task with the rooms_partial.json file
    luigi.build([
        # NodeGen(file_path='./data/Eng_Rooms.json', entity_type='room'),
        BuildRooms(file_path='./data/Eng_Rooms.json'),
        BuildFloors(file_path='./data/Eng_Rooms.json'),
        BuildBuildings(file_path='./data/Eng_Rooms.json'),
    ], local_scheduler=True)
