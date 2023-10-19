import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IUploadFile } from '../../../interfaces/file';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

const getAllUsers = async (
  options: IPaginationOptions,
  role: string,
  userType: string
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const whereConditions: any = {};

  if (role !== ENUM_USER_ROLE.SUPER_ADMIN) {
    whereConditions.role = { equals: ENUM_USER_ROLE.USER };
  }
  if (userType !== 'all') {
    whereConditions.role = { equals: userType };
  }

  const users = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            name: 'desc',
          },
  });
  const total = await prisma.user.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: users,
  };
};
const getSingleUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
};

const updateUser = async (id: string, req: Request): Promise<User> => {
  const file = req.file as IUploadFile;

  const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
  const payload = JSON.parse(req.body.data);
  if (uploadedImage) {
    payload.image = uploadedImage.secure_url;
  }
  if (payload.password !== '') {
    const hashedPassword = await bcrypt.hash(
      payload.password,
      Number(config.bycrypt_salt_rounds)
    );
    payload.password = hashedPassword;
  } else {
    delete payload.password;
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  console.log({ result });

  return result;
};

const deleteUser = async (id: string): Promise<User> => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });
  return result;
};

export const UserService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
