import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Next.jsのオリジン
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true, // DTOにないプロパティを自動で取り除く
  }));
  await app.listen(process.env.PORT ?? 3001); // フロントエンドとポートを分ける
}
bootstrap();
