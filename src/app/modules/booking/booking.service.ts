import { Booking } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { isBookingAvailableQuery } from '../../../shared/utils';

const createBooking = async (payload: Booking): Promise<Booking> => {
  await isBookingAvailableQuery(payload);
  const booking = await prisma.booking.create({
    data: {
      ...payload,
    },
    include: {
      service: true,
      user: true,
    },
  });

  return booking;
};

const getAllBooking = async (
  options: IPaginationOptions
): Promise<IGenericResponse<Booking[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  //get all by desc order of start date
  const booking = await prisma.booking.findMany({
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            startDate: 'desc',
          },

    include: {
      service: true,
      user: true,
    },
  });
  const total = await prisma.booking.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: booking,
  };
};

const getBookingsByUserId = async (userId: string): Promise<Booking[]> => {
  const booking = await prisma.booking.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      startDate: 'desc',
    },
    include: {
      service: true,
      user: true,
    },
  });
  return booking;
};

const getBookingById = async (id: string): Promise<Booking | null> => {
  const booking = await prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      service: true,
      user: true,
    },
  });
  return booking;
};

const updateBooking = async (
  id: string,
  payload: Booking
): Promise<Booking> => {
  console.log(payload, id);

  await isBookingAvailableQuery(payload);
  const booking = await prisma.booking.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
    include: {
      service: true,
      user: true,
    },
  });
  return booking;
};

const deleteBooking = async (id: string): Promise<Booking> => {
  const booking = await prisma.booking.delete({
    where: {
      id,
    },
    include: {
      service: true,
      user: true,
    },
  });
  return booking;
};

export const BookingService = {
  createBooking,
  getAllBooking,
  getBookingById,
  getBookingsByUserId,
  updateBooking,
  deleteBooking,
};
