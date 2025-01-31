import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './domains/user/user.module';
import { FollowModule } from './domains/follow/follow.module';
import { AuthModule } from './domains/auth/auth.module';
import { EventMessageModule } from './domains/event-message/event-message.module';

@Module({
    imports: [
        UserModule, 
        FollowModule,
        AuthModule,
        EventMessageModule
    ],
    controllers: [AppController],
})
export class AppModule {}
