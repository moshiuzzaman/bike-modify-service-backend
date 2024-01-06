import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ILoginUser } from './auth.interface';
import { authService } from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response<any>) => {
  const { email, password } = req.body as ILoginUser;
  
  const result = await authService.loginUser({ email, password });
  const response = {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Successfully login',
  };
  sendResponse(res, response);
});

const registerUser = catchAsync(async (req: Request, res: Response<any>) => {
 
    const result = await authService.registerUser(req);
  

    const response = {
        statusCode: httpStatus.OK,
        data: result,
        success: true,
        message: 'Successfully registered',
    };
    sendResponse(res, response);
});




export const authController = {
    loginUser,
    registerUser,
};
