import { Booking, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import prisma from './prisma';

export const asyncForEach = async (array: any[], callback: any) => {
  if (!Array.isArray(array)) {
    throw new Error('Expected an array');
  }
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};



export const isBookingAvailableQuery = async (
  payload: Booking
): Promise<boolean> => {
  const service = await prisma.service.findFirst({
    where: {
      id: payload.serviceId,
    },
  });

  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }

  // Get all bookings for the same service
  const bookings = await prisma.booking.findMany({
    where: {
      serviceId: payload.serviceId,
    },
  });

  // Check if the new booking conflicts with any existing bookings
  for (const booking of bookings) {
    const startDate = new Date(payload.startDate);
    
    const endDate = new Date(
      startDate.getTime() + service.length * 24 * 60 * 60 * 1000
    );


    const existingStartDate = new Date(booking.startDate);
    const existingEndDate = new Date(
      existingStartDate.getTime() + service.length* 24 * 60 * 60 * 1000
    );
    

    if (startDate < existingEndDate && endDate > existingStartDate) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Booking is not available for this service at this time'
      );
    }
  }

  return true;
};

export const isPasswordMatchedQuery = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  const isPasswordMatched = await bcrypt.compare(givenPassword, savedPassword);

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  return isPasswordMatched;
};

export const isUserExistQuery = async function (email: string): Promise<User> {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return isUserExist;
};
