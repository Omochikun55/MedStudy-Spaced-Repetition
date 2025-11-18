import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token not found');
    }

    // TODO: トークン検証ロジックを実装する (JWT検証など)
    // 現状はダミーのユーザーIDをセット
    // 実際にはJWTを検証し、ユーザーIDを取得する必要があります。
    // NestJSでAuth.jsのセッションを検証するのは複雑なため、
    // V1ではシンプルなダミー認証とし、将来的にJWT検証に置き換えることを想定します。
    // または、Next.jsのAPIルートからのみアクセスされることを前提とします。

    // 暫定的に、Bearerトークンが存在すれば、ダミーのユーザーIDをセット
    // 実際のアプリケーションでは、ここでトークンを検証し、ユーザーIDを抽出します。
    // このダミーIDは、PrismaのUserモデルのID形式に合わせる必要があります。
    (request as any).user = { id: 'clx0y810b000008jsh20b923t' }; // ダミーのユーザーID (Prismaのcuid形式)

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
