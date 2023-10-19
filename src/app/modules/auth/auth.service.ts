import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';
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

  if (req.user?.role !== ENUM_USER_ROLE.SUPER_ADMIN) {
    rest.role = ENUM_USER_ROLE.USER;
  }

  const user = await prisma.user.create({
    data: {
      ...rest,
      password: hashedPassword,
      role: ENUM_USER_ROLE.USER,
    },
  });
  return user;
};

export const authService = {
  loginUser,
  registerUser,
};
