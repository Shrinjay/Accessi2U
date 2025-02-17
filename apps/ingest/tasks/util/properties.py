from enum import Enum


class PropertyType(Enum):
    RM_STANDARD = 'rm_standard'
    RM_NAME = 'RM_NM'
    BUILDING_ID = "alt_bl_id"
    FLOOR_ID = "fl_id"


class RmStandard(Enum):
    CORRIDOR = "Corridor/Circulation Area"