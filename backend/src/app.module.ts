import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './domains/user/user.module';
import { FollowModule } from './domains/follow/follow.module';
import { AuthModule } from './domains/auth/auth.module';
import { EventMessageModule } from './domains/event-message/event-message.module';
import { EventParticipantModule } from './domains/event-participant/event-participant.module';

@Module({
    imports: [
        UserModule, 
        AuthModule,
        FollowModule,
        EventMessageModule,
        EventParticipantModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
