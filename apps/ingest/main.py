"""
Placeholder to run our luigi tasks without having to use the god awful CLI
Eventually we'll have multiple scripts that invoke different pipelines for rooms/floors/buildings
"""
import luigi

from tasks.transformer.BuildRenderingEntities import BuildRenderingEntities
from tasks.transformer.BuildRooms import BuildRooms
from tasks.transformer.BuildFloors import BuildFloors

if __name__ == '__main__':
    # Runs the build rendering entities task with the rooms_partial.json file
    luigi.build([
        BuildRooms(file_path='./data/rooms_partial.json'),
        BuildFloors(file_path='./data/floors_partial.json'),
        # BuildRenderingEntities(file_path='./data/rooms_partial.json'),
        # BuildRenderingEntities(file_path='./data/floors_partial.json'),
        # BuildRenderingEntities(file_path='./data/stairs_partial.json'),
    ], local_scheduler=True)
