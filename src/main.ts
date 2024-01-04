import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FileWatcherService } from './watch/file-watcher.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const fileWatcherService = app.get(FileWatcherService);
  fileWatcherService.watchFiles(process.env.WATCH);
  app.enableCors();
  await app.listen(4521);
}

bootstrap();
