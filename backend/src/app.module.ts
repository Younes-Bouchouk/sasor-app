import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './domains/user/user.module';
import { FollowModule } from './domains/follow/follow.module';

@Module({
    imports: [
        UserModule, 
        FollowModule
    ],
    controllers: [AppController],
})
export class AppModule {}
