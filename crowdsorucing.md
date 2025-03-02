# Requirements

- For a given room, we need to display all of the potential options for feedback
- Display options refined by the room type - e.g washroom issues should be different - the way we do this, Have a default set of issues - add extra ones for elevators and washrooms
- Store the responses by room, we should have a quick way of figuring out waht typess of feedback were given so we can aggregate that
- Have the ability to enter in comments

For washrooms:

- Base requirement: Report if there are washroom issues
- Stretch: Gender reporting - but we may want to pull this in from dataset - leave this for later

For elevators:

- Report if elevator is broken

# Tangential Changes

These are changes we need to make to enable this feature

- Room Type column into room table - derived from GeoJSON

# Data Model

Add a report model

```

model Room {
  ...
  roomType             RoomTypeEnum # derive from rm_standard in the ingest layer
  reports              Report[]

  @@map("room")
}

model Report {
  id          Int       @id @default(autoincrement())
  created_at  DateTime? @db.Timestamp(6)
  updated_at  DateTime? @db.Timestamp(6)

  room @relation(fields: [room_id], references: [id])
  room_id Int

  reportType ReportTypeEnum
  comment String?

  @@map("report")
}

enum RoomTypeEnum {
    BATHROOM
    ELEVATOR
    ...
}

enum ReportTypeEnum {
  ELEVATOR_OUT_OF_SERVICE
  BATHROOM_NOT_ACCESSIBLE

  MISLABELED
  OTHER
  @@map("reporttype_enum")
}
```

# Operations

1a) Selecting the room using the map

- Frontend: Click on a polygon, that should have the room name
- Backend: Get room by name procedure, pass in the name, find a room with a matching name and return it
- Frontend: Get this room and use it in the next step

1b) Selecting the room using a dropdown

- Frontend: Call a backend route to get all of the rooms
- Backend: Expose a listRooms procedure returns all of the rooms
- Frontend: Put these into a searchable react select, transform roms into `{label: [room's name], value: [room's ID]}`
- Get the selected room and use it in the next step

2. Get all available report types for a room

- Frontend: Pass the room ID into a getReportTypes procedure
- Backend: Expore a procedure called getReportTypes that will return all of the report types including the additional ones for washrooms and elevators

Psuedocode

```
const getReportTypes = async (room: Room) => {
    const DEFAULT_REPORT_TYPES = [
    ReportTypeEnum.MISLABELED
    ReportTypeEnum.OTHER
    ]

    switch (room.roomType) {
        case RoomTypeEnum.BATHROOM:
            return [...DEFAULT_REPORT_TYPES, ReportTypeEnum.BATHROOM_NOT_ACCESSIBLE]
        default:
            return DEFAULT_REPORT_TYPES
    }

}
```

3. Submit a report

- Frontend: Create a simple form in the frontend to submit the comment and the report type - https://react-hook-form.com/get-started
- Backend: Create a submitReport mutation that takes in the room ID, report type and comment and creates a new issue for it
- Frontend: Once we successfully create a report - we should have some UI for it

Follow-ups:

- Aggregating reports by a room to show on the UI
- Showing all reports with comments by room

# Others

Move this into linear

- Centroid column for rooms and floors - turn geometries into a shapely geometry and call centroid method and store that in the model: https://shapely.readthedocs.io/en/2.0.6/reference/shapely.centroid.html
