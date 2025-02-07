import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './domains/users/users.module';
import { AuthModule } from './domains/auth/auth.module';
import { ConfigModule } from '@nestjs/config';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
