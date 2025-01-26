import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './domains/user/user.module';
import { RelationModule } from './domains/relation/relation.module';

@Module({
    imports: [UserModule, RelationModule],
    controllers: [AppController],
})
export class AppModule {}
