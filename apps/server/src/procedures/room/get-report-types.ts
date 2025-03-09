import * as Yup from 'yup';
import { ReportTypeEnum } from 'database';
import { prisma } from '../../config/prisma.js';
import { procedure } from '../procedure.js';

const input = Yup.object({
  roomId: Yup.number().required(),
});

export enum RoomTypeEnum {
  ELEVATOR = 'Elevators',
  BATHROOM = 'Toilets/Showers',
}

export const getReportTypes = procedure.input(input).query(async ({ ctx, input }) => {
  const { roomId } = input;

  const room = await prisma.room.findUniqueOrThrow({
    where: { id: roomId },
  });

  const DEFAULT_REPORT_TYPES = [ReportTypeEnum.MISLABELED, ReportTypeEnum.OTHER];

  switch (room.roomType) {
    case RoomTypeEnum.ELEVATOR:
      return [...DEFAULT_REPORT_TYPES, ReportTypeEnum.ELEVATOR_OUT_OF_SERVICE];
    case RoomTypeEnum.BATHROOM:
      return [...DEFAULT_REPORT_TYPES, ReportTypeEnum.BATHROOM_NOT_ACCESSIBLE];
    default:
      return DEFAULT_REPORT_TYPES;
  }
});
