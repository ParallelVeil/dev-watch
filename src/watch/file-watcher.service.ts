import * as chokidar from 'chokidar';
import { FileStores } from './FileStores';
import 'log-timestamp';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileWatcherService {
  private fileStores: FileStores = null;

  watchFiles(watchPath: string) {
    const fileStores: FileStores = new FileStores(watchPath);
    const watcher = chokidar.watch(watchPath, {
      persistent: true,
      ignored: [/(^|[\/\\])\../, '.DS_Store'],
      ignoreInitial: false,
      ignorePermissionErrors: false,
      atomic: true,
    });

    // ready

    watcher.on('ready', async () => {
      console.log(`watch [${watchPath}] starting...`);
    });
    watcher
      .on('add', async (path) => {
        fileStores.addFile(path);
        console.log(`File ${path} has been added`);
      })
      .on('change', async (path) => {
        fileStores.changeFile(path);
        console.log(`File ${path} has been changed`);
      })
      .on('unlink', async (path) => {
        fileStores.delete(path);
        console.log(`File ${path} has been removed`);
      });

    watcher
      .on('addDir', async (path) => {
        if (path === watchPath) {
          return;
        }
        fileStores.addFolder(path);
        console.log(`Directory ${path} has been added`);
      })
      .on('unlinkDir', async (path) => {
        fileStores.delete(path);
        console.log(`Directory ${path} has been removed`);
      })
      .on('error', async (error) => {
        console.log(`Watcher error: ${error}`);
      });
    this.fileStores = fileStores;
  }

  getStore() {
    return this.fileStores;
  }
}
