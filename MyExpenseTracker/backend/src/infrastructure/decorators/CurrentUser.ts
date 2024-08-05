import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type AuthenticatedRequest = Request & { user: SessionUser };

export type SessionUser = {
  id: string;
  email: string;
};

export const CurrentUser = createParamDecorator<
  unknown,
  ExecutionContext,
  SessionUser
>((_options: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  return request.user;
});
