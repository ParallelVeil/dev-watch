import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileWatcherService } from './watch/file-watcher.service';
import { WatchController } from './watch/file-watcher.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, WatchController],
  providers: [AppService, FileWatcherService],
})
export class AppModule {}
