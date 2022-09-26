import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './bookmark-dto';

@Injectable()
export class BookmarkService {
  constructor(private service: PrismaService) {}
  async getBookmarks(userId: number) {
    const bookmark = await this.service.bookMark.findMany({
      where: {
        userId: userId,
      },
    });

    return bookmark;
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.service.bookMark.findFirst({
      where: {
        userId: userId,
        id: bookmarkId,
      },
    });

    return bookmark;
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.service.bookMark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    const bookmark = await this.service.bookMark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId != userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return await this.service.bookMark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        userId,
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.service.bookMark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId != userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return await this.service.bookMark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
