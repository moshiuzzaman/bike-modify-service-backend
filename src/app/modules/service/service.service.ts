import { Prisma, Service } from '@prisma/client';
import { Request } from 'express';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IUploadFile } from '../../../interfaces/file';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

import { serviceSearchableFields } from './service.constants';
import { IServiceFilterRequest } from './service.interface';

const createService = async (req: Request): Promise<Service> => {
  const file = req.file as IUploadFile;
  const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
  if (uploadedImage) {
    req.body.image = uploadedImage.secure_url;
  }

  const payload = req.body;
  if (payload.status === 'false') {
    payload.status = false;
  } else if (payload.status === 'true') {
    payload.status = true;
  }

  const result = await prisma.service.create({
    data: payload,
  });
  return result;
};

const getAllService = async (
  filters: IServiceFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Service[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, status, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: serviceSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (status) {
    const convertStatus = status === 'true' ? true : false;

    andConditions.push({
      status: {
        equals: convertStatus,
      },
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

  

  const whereConditions: Prisma.ServiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.service.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            title: 'desc',
          },
  });

  const total = await prisma.service.count({
    where: whereConditions,
  });
 

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getServiceById = async (id: string): Promise<Service | null> => {
  const result = await prisma.service.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateService = async (id: string, req: Request): Promise<Service> => {
  const file = req.file as IUploadFile;

  const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
  if (uploadedImage) {
    req.body.image = uploadedImage.secure_url;
  }

  const payload = req.body;

  if (payload.status === 'false') {
    payload.status = false;
  } else if (payload.status === 'true') {
    payload.status = true;
  }

  const result = await prisma.service.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteService = async (id: string): Promise<Service> => {
  const result = await prisma.service.delete({
    where: {
      id,
    },
  });
  console.log({ result });

  return result;
};

export const serviceService = {
  createService,
  getAllService,
  getServiceById,
  updateService,
  deleteService,
};
