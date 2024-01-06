import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import config from '../../../config';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IUploadFile } from '../../../interfaces/file';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { userSearchAbleFields } from './user.constants';
import { IUserFilterRequest } from './user.interface';

const getAllUsers = async (
  options: IPaginationOptions,
  filters: IUserFilterRequest
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? { AND: andConditions as Prisma.UserWhereInput[] }
      : {};

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
  const total = await prisma.user.count({
    where: whereConditions,
  });
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
  if (payload.password) {
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

  return result;
};

const updateUserRole = async (id: string, role: string): Promise<User> => {
 
  
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
  });
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
  updateUserRole,
};
