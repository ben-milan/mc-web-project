import { Module } from '@nestjs/common';
import { AppController, AreaController, MapController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, HttpModule],
  controllers: [AppController, MapController, AreaController],
  providers: [AppService],
})
export class AppModule {}
