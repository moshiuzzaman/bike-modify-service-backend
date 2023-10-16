import { Review } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

const createReview = async (payload: Review) => {
  const isBookingExist = await prisma.booking.findUnique({
    where: {
      id: payload.bookingId,
    },
  });
  if (!isBookingExist) {
    throw new Error('Booking not found');
  }

  const review = await prisma.review.create({
    data: {
      ...payload,
    },
  });
  return review;
};

const getAllReview = async (
  options: IPaginationOptions
): Promise<IGenericResponse<Review[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const result = await prisma.review.findMany({
    skip,
    take: limit,

    include: {
      booking: {
        include: {
          service: true,
          user: true,
        },
      },
    },
  });
  const total = await prisma.review.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getReviewByServiceId = async (id: string) => {
  const result = await prisma.review.findMany({
    where: {
      booking: {
        serviceId: id,
      },
    },
    include: {
      booking: {
        include: {
          service: true,
          user: true,
        },
      },
    },
  });
  return result;
};

export const reviewService = {
  createReview,
  getAllReview,
  getReviewByServiceId,
};
