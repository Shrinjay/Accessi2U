import { prisma } from '../config/prisma.js';
import { _room } from '../services/room/index.js';

const FROM_ROOM_ID = 3002;
const TO_ROOM_ID = 3141;

const main = async () => {
  const fromRoom = await prisma.room.findUnique({
    where: { id: FROM_ROOM_ID },
  });
  const toRoom = await prisma.room.findUnique({
    where: { id: TO_ROOM_ID },
  });
  console.log(await _room.pathToRoom(fromRoom, toRoom));
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
