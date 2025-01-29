import luigi


class ExtractJson(luigi.ExternalTask):
    """
    Utility task to wrap a JSON file
    """
    file_path = luigi.PathParameter(exists=True)

    def output(self):
        return luigi.LocalTarget(self.file_path)
