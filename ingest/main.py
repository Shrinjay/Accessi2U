import luigi

from tasks.transformer.BuildRenderingEntities import BuildRenderingEntities

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    luigi.build([BuildRenderingEntities(file_path='../data/rooms_partial.json')], local_scheduler=True)
