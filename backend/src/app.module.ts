import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './domains/users/users.module';
import { AuthModule } from './domains/auth/auth.module';
import {EventModule} from './domains/event/event.module'
import { FollowsModule } from './domains/follows/follows.module';
import { EventsMessagesModule } from './domains/events-messages/events-messages.module';
@Module({
    imports: [
       ConfigModule.forRoot({
            isGlobal: true
        }),
        UsersModule, 
        FollowsModule,
        AuthModule,
        EventModule,
        EventsMessagesModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
