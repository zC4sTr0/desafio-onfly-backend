import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { UsersService } from '../users/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor (private readonly usersService: UsersService) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    if (!request.session.userId) {
      return next.handle();
    }
    const user = await this.usersService.findOne(request.session.userId);
    request.currentUser = user;
    
    return next.handle();
  }
}