import { Controller, Get } from '@nestjs/common';
import { FileWatcherService } from './file-watcher.service';

@Controller('watch')
export class WatchController {
  constructor(private readonly fileWatcherService: FileWatcherService) {}

  @Get('/tree')
  getDirectoryInfo() {
    const directoryInfo = this.fileWatcherService.getStore();
    return directoryInfo.tree;
  }
}
