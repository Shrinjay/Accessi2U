import * as Yup from 'yup';
import { prisma } from '../../config/prisma.js';
import { procedure } from '../procedure.js';

const input = Yup.object({
    roomId: Yup.number().required()
});


export const listReports = procedure.input(input).query(async ({ ctx, input }) => {
    const { roomId } = input;

    return await prisma.report.findMany({
        where: {
            room_id: roomId,
        },
    });
});