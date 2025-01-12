import luigi


class LoadJson(luigi.ExternalTask):
    file_path = luigi.PathParameter(exists=True)

    def output(self):
        return luigi.LocalTarget(self.file_path)
