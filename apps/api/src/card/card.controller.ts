import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto, UpdateCardDto, ReviewCardDto } from './dto/card.dto';
import { AuthGuard } from '../auth/auth.guard'; // 後で作成
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

@UseGuards(AuthGuard) // 全てのルートに認証ガードを適用
@Controller('decks/:deckId/cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  create(
    @Param('deckId') deckId: string,
    @Body() createCardDto: CreateCardDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.cardService.create(deckId, createCardDto, req.user.id);
  }

  @Get()
  findAll(@Param('deckId') deckId: string, @Req() req: AuthenticatedRequest) {
    return this.cardService.findAllInDeck(deckId, req.user.id);
  }

  @Get(':cardId')
  findOne(@Param('cardId') cardId: string, @Req() req: AuthenticatedRequest) {
    return this.cardService.findOne(cardId, req.user.id);
  }

  @Patch(':cardId')
  update(
    @Param('cardId') cardId: string,
    @Body() updateCardDto: UpdateCardDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.cardService.update(cardId, updateCardDto, req.user.id);
  }

  @Post(':cardId/review')
  review(
    @Param('cardId') cardId: string,
    @Body() reviewCardDto: ReviewCardDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.cardService.review(cardId, reviewCardDto, req.user.id);
  }

  @Delete(':cardId')
  remove(@Param('cardId') cardId: string, @Req() req: AuthenticatedRequest) {
    return this.cardService.remove(cardId, req.user.id);
  }
}
