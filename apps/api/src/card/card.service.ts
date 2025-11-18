import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto, UpdateCardDto, ReviewCardDto } from './dto/card.dto';
import { sm2, Sm2Card } from '@repo/srs';

@Injectable()
export class CardService {
  constructor(private prisma: PrismaService) {}

  async create(deckId: string, createCardDto: CreateCardDto, userId: string) {
    // デッキの存在と所有権を確認
    const deck = await this.prisma.deck.findUnique({ where: { id: deckId } });
    if (!deck) {
      throw new NotFoundException(`Deck with ID "${deckId}" not found`);
    }
    if (deck.userId !== userId) {
      throw new ForbiddenException('You do not have permission to add cards to this deck');
    }

    return this.prisma.card.create({
      data: {
        ...createCardDto,
        deckId,
      },
    });
  }

  async findAllInDeck(deckId: string, userId: string) {
    // デッキの存在と所有権を確認
    const deck = await this.prisma.deck.findUnique({ where: { id: deckId } });
    if (!deck) {
      throw new NotFoundException(`Deck with ID "${deckId}" not found`);
    }
    if (deck.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view cards in this deck');
    }

    return this.prisma.card.findMany({
      where: { deckId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: { deck: true },
    });

    if (!card) {
      throw new NotFoundException(`Card with ID "${id}" not found`);
    }

    if (card.deck.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this card');
    }

    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto, userId: string) {
    await this.findOne(id, userId); // Authorization check
    return this.prisma.card.update({
      where: { id },
      data: updateCardDto,
    });
  }

  async review(id: string, reviewCardDto: ReviewCardDto, userId: string) {
    const card = await this.findOne(id, userId); // Authorization check

    const srsCard: Sm2Card = {
      easeFactor: card.easeFactor,
      repetitions: card.repetitions,
      interval: card.interval,
      nextReviewAt: card.nextReviewAt,
    };

    const updatedSrsCard = sm2(srsCard, reviewCardDto.quality);

    return this.prisma.card.update({
      where: { id },
      data: {
        easeFactor: updatedSrsCard.easeFactor,
        repetitions: updatedSrsCard.repetitions,
        interval: updatedSrsCard.interval,
        nextReviewAt: updatedSrsCard.nextReviewAt,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Authorization check
    return this.prisma.card.delete({ where: { id } });
  }
}
