import { Booking } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

const createBooking = async (payload: Booking): Promise<Booking> => {
  // await isBookingAvailableQuery(payload);
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
            createdAt: 'desc',
          },

    include: {
      service: true,
      user: true,
      reviews: true,
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

const getBookingsByUserId = async (
  userId: string,
  options: IPaginationOptions
): Promise<IGenericResponse<Booking[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const booking = await prisma.booking.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip,
    take: limit,
    include: {
      service: true,
      user: true,
      reviews: true,
    },
  });
  const total = await prisma.booking.count({
    where: {
      userId: userId,
    },
  });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: booking,
  };
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

  // await isBookingAvailableQuery(payload);
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
