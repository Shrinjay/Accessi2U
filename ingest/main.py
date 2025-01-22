"""
Placeholder to run our luigi tasks without having to use the god awful CLI
Eventually we'll have multiple scripts that invoke different pipelines for rooms/floors/buildings
"""
import luigi

from tasks.transformer.BuildRenderingEntities import BuildRenderingEntities

if __name__ == '__main__':
    # Runs the build rendering entities task with the rooms_partial.json file
    luigi.build([BuildRenderingEntities(file_path='../data/rooms_partial.json')], local_scheduler=True)
