import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './domains/users/users.module';
import { AuthModule } from './domains/auth/auth.module';


@Module({
    imports: [
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
