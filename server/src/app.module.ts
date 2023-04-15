import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { VerifyJWTMiddleware } from './auth/verify-jwt.middleware';
import { ConversationModule } from './conversation/conversation.module';
import { UserModule } from './user/user.module';
import { EventsModule } from './events/events.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ConversationModule,
    UserModule,
    EventsModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyJWTMiddleware)
      .forRoutes({ path: '/auth/verify-token', method: RequestMethod.GET })
      .apply(VerifyJWTMiddleware)
      .forRoutes({
        path: '/auth/add-push-token',
        method: RequestMethod.POST,
      })
      .apply(VerifyJWTMiddleware)
      .forRoutes({
        path: '/user/all-users-except-current',
        method: RequestMethod.GET,
      })
      .apply(VerifyJWTMiddleware)
      .forRoutes({
        path: '/conversation/create',
        method: RequestMethod.POST,
      });
  }
}
