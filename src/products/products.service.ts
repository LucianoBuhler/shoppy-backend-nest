import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductRequest } from './dto/create-product.request';
import { join } from 'path';
import { promises as fs } from 'fs';
import { PRODUCT_IMAGES } from './product-images';
import { Prisma } from '@prisma/client';
import { ProductsGateway } from './products.gateway';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsGateway: ProductsGateway,
  ) {}

  async createProduct(data: CreateProductRequest, userId: number) {
    try {
      const product = await this.prismaService.product.create({
        data: {
          ...data,
          userId,
        },
      });
      this.productsGateway.handleProductUpdated();
      return product;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new UnprocessableEntityException('Name already in use');
      }
      throw err;
    }
  }

  async getProducts(status?: string) {
    // return await this.prismaService.product.findMany();
    const args: Prisma.ProductFindManyArgs = {};
    if (status === 'available') {
      args.where = {
        sold: false,
      };
    }
    const products = await this.prismaService.product.findMany(args);
    return Promise.all(
      products.map(async (product) => ({
        ...product,
        imageExists: await this.imageExists(product.id),
      })),
    );
  }

  async getProduct(productId: number) {
    try {
      return {
        ...(await this.prismaService.product.findUniqueOrThrow({
          where: { id: productId },
        })),
        imageExists: await this.imageExists(productId),
      };
    } catch (err) {
      throw new NotFoundException(`Product not found with ID ${productId}`);
    }
  }

  async update(productId: number, data: Prisma.ProductUpdateInput) {
    await this.prismaService.product.update({
      where: { id: productId },
      data,
    });
    this.productsGateway.handleProductUpdated();
  }

// ORIGINAL
  // private async imageExists(productId: number) {
  //   try {
  //     await fs.access(
  //       join(__dirname, '../../', `public/products/${productId}.jpg`),
  //       fs.constants.F_OK,
  //     );
  //     return true;
  //   } catch (err) {
  //     return false;
  //   }
  // }
  private async imageExists(productId: number): Promise<boolean> {
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];

    for (const ext of extensions) {
      const filePath = join(PRODUCT_IMAGES, `${productId}${ext}`);
      console.log('Checking file:', filePath); // Debugging line
      try {
        await fs.access(filePath, fs.constants.F_OK);
        console.log('File exists:', filePath); // Debugging line
        return true;
      } catch {
        console.log('File not found:', filePath); // Debugging line
        // return false;
      }
    }

    return false;
  }


}
