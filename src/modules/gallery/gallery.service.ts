import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  async create(createGalleryDto: CreateGalleryDto) {
    try {
      return await this.prisma.photo.create({ data: createGalleryDto });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new BadRequestException('This photo already exists');
      } else {
        throw e;
      }
    }
  }

  async findAll() {
    return await this.prisma.photo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const photo = await this.prisma.photo.findFirst({ where: { id } });

    if (!photo) throw new NotFoundException('Photo not found');

    return photo;
  }

  async update(id: string, updateGalleryDto: UpdateGalleryDto) {
    try {
      const originalPhoto = await this.prisma.photo.findUnique({
        where: { id },
      });

      if (!originalPhoto) throw new NotFoundException('Photo not found');

      const updatedPhoto = await this.prisma.photo.update({
        where: { id },
        data: { ...originalPhoto, ...updateGalleryDto },
      });

      return updatedPhoto;
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException('This photo not exists');
      } else {
        throw e;
      }
    }
  }

  async remove(id: string) {
    try {
      const deletedPhoto = await this.prisma.photo.delete({
        where: { id },
      });

      return deletedPhoto;
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException('This photo not exists');
      } else {
        throw e;
      }
    }
  }

  async search(query: string) {
    const term = query.toLocaleLowerCase();
    const results = await this.prisma.photo.findMany({
      where: {
        OR: [
          { id: { contains: term, mode: 'insensitive' } },
          { name: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { tags: { has: term } },
        ],
      },
    });

    return results;
  }
}
