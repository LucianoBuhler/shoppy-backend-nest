import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductRequest } from './dto/create-product.request';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(data: CreateProductRequest, userId: number) {
    try {
      return await this.prismaService.product.create({
        data: {
          ...data,
          userId,
        },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new UnprocessableEntityException('Name already in use');
      }
      throw err;
    }
  }

  async getProducts() {
    return await this.prismaService.product.findMany();
  }
}
