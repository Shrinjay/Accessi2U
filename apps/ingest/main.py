"""
Placeholder to run our luigi tasks without having to use the god awful CLI
Eventually we'll have multiple scripts that invoke different pipelines for rooms/floors/buildings
"""
import luigi

from tasks.transformer.BuildRenderingEntities import BuildRenderingEntities
from tasks.transformer.BuildRooms import BuildRooms
from tasks.transformer.EdgeGen import EdgeGen
from tasks.transformer.NodeGen import NodeGen
from constants import ROOM_DATA_PATH

if __name__ == '__main__':
    luigi.build([
        NodeGen(file_path=ROOM_DATA_PATH, entity_type='room'),
        # BuildRooms(),
    ], local_scheduler=True)
