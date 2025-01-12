import pydantic


class UnitFeatureCollectionFeature(pydantic.BaseModel):
    type: str = "Feature"
    id: int
    geometry: dict
    properties: dict


class UnitFeatureCollectionProperties(pydantic.BaseModel):
    exceededTransferLimit: bool


class UnitFeatureCollection(pydantic.BaseModel):
    type: str = "FeatureCollection"
    properties: UnitFeatureCollectionProperties
    features: list[UnitFeatureCollectionFeature]
