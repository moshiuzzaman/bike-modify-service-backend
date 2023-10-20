import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { BookingService } from './booking.service';

const createBooking = catchAsync(async (req: Request, res: Response<any>) => {
  req.body.userId = req?.user?.id;
  const result = await BookingService.createBooking(req.body);
  const response = {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Successfully created booking',
  };
  sendResponse(res, response);
});

const getAllBooking = catchAsync(async (req: Request, res: Response<any>) => {
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await BookingService.getAllBooking(options);
  const response = {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Successfully retrieved bookings',
  };
  sendResponse(res, response);
});

const getBookingsByUserId = catchAsync(
  async (req: Request, res: Response<any>) => {
    const id=req?.user?.id;
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await BookingService.getBookingsByUserId(
      id,
      options
    );
    const response = {
      statusCode: httpStatus.OK,
      data: result,
      success: true,
      message: 'Successfully retrieved bookings',
    };
    sendResponse(res, response);
  }
);

const getBookingById = catchAsync(async (req: Request, res: Response<any>) => {
  const result = await BookingService.getBookingById(req.params.id);
  const response = {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Successfully retrieved booking',
  };
  sendResponse(res, response);
});

const updateBooking = catchAsync(async (req: Request, res: Response<any>) => {
  console.log(req.params.id, req.body);
  
  const result = await BookingService.updateBooking(req.params.id, req.body);
  const response = {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Successfully updated booking',
  };
  sendResponse(res, response);
});

const deleteBooking = catchAsync(async (req: Request, res: Response<any>) => {
  const result = await BookingService.deleteBooking(req.params.id);
  const response = {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Successfully deleted booking',
  };
  sendResponse(res, response);
});

export const BookingController = {
  createBooking,
  getAllBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByUserId,
};
