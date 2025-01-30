import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './domains/user/user.module';
import { FollowModule } from './domains/follow/follow.module';
import { AuthModule } from './domains/auth/auth.module';

@Module({
    imports: [
        UserModule, 
        FollowModule,
        AuthModule
    ],
    controllers: [AppController],
})
export class AppModule {}
