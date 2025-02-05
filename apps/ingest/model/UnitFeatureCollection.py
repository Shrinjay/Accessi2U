"""
Holds the pydantic models for a FeatureCollection that contains rooms/floors/buildings
"""
import pydantic


class UnitFeature(pydantic.BaseModel):
    """
    A feature representing a room/floor/building

    TODO: More cocretely define the property type
    """
    type: str = "Feature"
    id: int
    geometry: dict
    properties: dict


class UnitFeatureCollectionProperties(pydantic.BaseModel):
    """
    Properties of a feature collection for a room/floor/building
    """
    exceededTransferLimit: bool


class UnitFeatureCollection(pydantic.BaseModel):
    """
    A feature collection containing features that are rooms/floors/buildings
    """
    type: str = "FeatureCollection"
    properties: UnitFeatureCollectionProperties
    features: list[UnitFeature]
