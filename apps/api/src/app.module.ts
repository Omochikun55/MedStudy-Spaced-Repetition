import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { DeckModule } from './deck/deck.module';
import { CardModule } from './card/card.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, DeckModule, CardModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
