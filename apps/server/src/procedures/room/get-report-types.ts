import { Room, RoomTypeEnum, ReportTypeEnum, Report } from 'database';
import { prisma } from '../../config/prisma.js';
import { procedure } from '../procedure.js';

const getReportTypes = async (room: Room): Promise<Room> => {
    const DEFAULT_REPORT_TYPES = [
        prisma.ReportTypeEnum.MISLABELED,
        prisma.ReportTypeEnum.OTHER
    ]

    switch (room.roomType) {
        case RoomTypeEnum.BATHROOM:
            return [...DEFAULT_REPORT_TYPES, ReportTypeEnum.BATHROOM_NOT_ACCESSIBLE]
        default:
            return DEFAULT_REPORT_TYPES
    }
}
