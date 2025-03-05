import * as Yup from 'yup';
import { ReportTypeEnum } from 'database';
import { prisma } from '../../config/prisma.js';
import { procedure } from '../procedure.js';

const input = Yup.object({
    roomId: Yup.number().required(),
    reportType: Yup.mixed<ReportTypeEnum>().required(),
    comment: Yup.string().optional(),
});

export const submitReport = procedure.input(input).mutation(async ({ ctx, input }) => {
    const { roomId, reportType, comment } = input;

    const room = await prisma.room.findUnique({
        where: { id: roomId },
    });

    if (!room) {
        throw new Error('Room not found');
    }

    const report = await prisma.report.create({
        data: {
            room_id: roomId,
            reportType: reportType,
            comment: comment,
        },
    });
  
    return report;
  });
  