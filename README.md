# Accessi2U
Repository for the Accessi2U FYDP Project 2025

##  🚧 Under Construction 🚧
Notes in this section are mostly just my draft notes for communication

### Milestones
I think we can agree on breaking this entire app down into four key milestones 
from a technical perspective

1. Rendering - Given a room, render the room, rooms around it, corridors, stairs etc on the same floor
2. Routing - Generate a route between two rooms
3. Position fixing - Be able to fix the user's position given a room
4. Accessibility - Be able to adjust routes based on acessibility criteria

After that, a lot of our work will be more UX-oriented in nature

### Rendering
Some design goals for rendering:
- Relatively efficient - we don't want to render more than we need to.
I'll leave this as a loose goal though because it doesn't really matter yet
- Flexible - main design goal, I want to be able to have this logic generically work for rendering a heirarchial structure

#### Data Model
The data model for this relies on rendering entites, rendering entities are simply units of rendering and contain a link to a geoJSON to render.
An entity can be anything, a room, a corridor, a floor etc. For now we'll restrict them to only being Polygons
Entities live in a heirarchy, each entity has a parent. 
Each RenderingEntity links to a Room or Floor or Building object in our database. 
This leads to the following data model

```
schema Room {
    id int
    external_id string
    created_at Date
    updated_at Date
    
    room_type RoomTypeEnum(...) // figure these out from data, these will likely map rm_standard or use_type
    name string // map from rm_name
    
    floor_id int 
    render_entity_id int
}

schema Floor {
    id int
    external_id string
    created_at Date
    updated_at Date
    
    floorNum int
    
    render_entity_id int
}

schema Building {
    id int
    external_id string
    created_at Date
    updated_at Date
    
    name
    
    render_entity_id int
}

schema RenderEntity {
    id int
    created_at Date
    updated_at Date
    
    parent_id int?
    file_id int
}

schema File {
    id int
    created_at Date
    updated_at Date
    
    provider FileProviderEnum("Local", "S3")
    remote_id string
}
```

Parents are as follows:
Rooms -> Floors -> Buildings 

#### Logic - Rendering
Assume rendering operations always have a reference point, and that reference point is a room. 
We get a rendering request for a room:
1. Find the room in our DB
2. Find the rendering entity
3. Find all sibling rendering entities 
4. Find all child rendering entities 
5. Recursively go up the parents until we get to a root (likely a building)
6. This is the set of rendering entites we need to render on the map

#### Logic - Ingest
We have:
- Rooms - each room is a feature with a geometry (Polygon) and properties
- Floors - each floor is a feature with a geometry (Polygon, MultiPolygon) and properties
- Buildings - each room is a feature with a geometry (Polygon) and properties

We need the data model above so rough steps are, for each file we:
- Go over each building/floor/room
- Create the rendering entity 
- Create the object (room/floor/building) with reference to the rendering entity

Do this in the order Building - Floor - Room so the parents are always populated (avoids topo sort)

#### Ingest Architecture
Simple. In-Memory. Geopandas used. Each step should be unaware of steps before and after it. 
Rough idea: 
- each step takes in a dict representing all the outputs from the previous step as key-val pairs, val is array of pydantic model defined
- each step outputs one thing
- each step is responsible for ensuring that the input it requires is present and well formed

Breaking this down into steps
- Creating a rendering entity is common as long as we know the parent




