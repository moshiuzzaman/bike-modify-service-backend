import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import config from '../../../config';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { IUploadFile } from '../../../interfaces/file';
import prisma from '../../../shared/prisma';
import {
  isPasswordMatchedQuery,
  isUserExistQuery,
} from '../../../shared/utils';
import { ILoginUser } from './auth.interface';

const loginUser = async (payload: ILoginUser): Promise<string> => {
  const user = await isUserExistQuery(payload.email);

  await isPasswordMatchedQuery(payload.password, user.password);

  const token = jwtHelpers.createToken(
    user,
    config.jwt.secret,
    config.jwt.expires_in
  );

  return token;
};

const registerUser = async (req: Request): Promise<User> => {
  const file = req.file as IUploadFile;

  const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
  if (uploadedImage) {
    req.body.image = uploadedImage.secure_url;
  }

  const { password, ...rest } = req.body;
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bycrypt_salt_rounds)
  );
  const user = await prisma.user.create({
    data: {
      ...rest,
      password: hashedPassword,
    },
  });
  return user;
};

export const authService = {
  loginUser,
    registerUser,
};
