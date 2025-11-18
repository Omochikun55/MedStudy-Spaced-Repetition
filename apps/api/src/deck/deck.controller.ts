import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { DeckService } from './deck.service';
import { CreateDeckDto, UpdateDeckDto } from './dto/deck.dto';
import { AuthGuard } from '../auth/auth.guard'; // 後で作成
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

@UseGuards(AuthGuard) // 全てのルートに認証ガードを適用
@Controller('decks')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @Post()
  create(@Body() createDeckDto: CreateDeckDto, @Req() req: AuthenticatedRequest) {
    return this.deckService.create(createDeckDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.deckService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.deckService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeckDto: UpdateDeckDto, @Req() req: AuthenticatedRequest) {
    return this.deckService.update(id, updateDeckDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.deckService.remove(id, req.user.id);
  }
}
