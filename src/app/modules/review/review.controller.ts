import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { reviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.createReview(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getAllReview = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await reviewService.getAllReview(options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews fetched successfully',
    data: result,
  });
});

const getReviewByServiceId = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await reviewService.getReviewByServiceId(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews fetched successfully',
    data: result,
  });
});

export const reviewController = {
  createReview,
  getAllReview,
  getReviewByServiceId,
};
