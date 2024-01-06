import { Controller, Get, Headers, Param, Res } from '@nestjs/common';
import { FileWatcherService } from './file-watcher.service';
import { Response } from 'express';

@Controller('watch')
export class WatchController {
  constructor(private readonly fileWatcherService: FileWatcherService) {}

  @Get('/tree')
  getDirectoryInfo() {
    const directoryInfo = this.fileWatcherService.getStore();
    return directoryInfo.tree;
  }

  @Get('/github')
  getGithubInfo(@Headers('host') host: string) {
    const content = this.fileWatcherService.getGithubRoot().map((t) => {
      return {
        path: t.path,
        url: host + '/watch/github/' + t.url,
      };
    });

    return {
      tree: content,
    };
  }

  @Get('/github/:file(*)')
  getGithubFile(@Param('file') file: string, @Res() response: Response) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return this.fileWatcherService.readFile(file, response);
  }
}
