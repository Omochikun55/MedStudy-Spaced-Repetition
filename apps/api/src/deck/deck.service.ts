import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeckDto, UpdateDeckDto } from './dto/deck.dto';

@Injectable()
export class DeckService {
  constructor(private prisma: PrismaService) {}

  async create(createDeckDto: CreateDeckDto, userId: string) {
    return this.prisma.deck.create({
      data: {
        ...createDeckDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.deck.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const deck = await this.prisma.deck.findUnique({
      where: { id },
      include: { cards: { orderBy: { createdAt: 'asc' } } }, // Include cards
    });

    if (!deck) {
      throw new NotFoundException(`Deck with ID "${id}" not found`);
    }

    if (deck.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this deck');
    }

    return deck;
  }

  async update(id: string, updateDeckDto: UpdateDeckDto, userId: string) {
    await this.findOne(id, userId); // Authorization check
    return this.prisma.deck.update({
      where: { id },
      data: updateDeckDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Authorization check
    return this.prisma.deck.delete({ where: { id } });
  }
}
