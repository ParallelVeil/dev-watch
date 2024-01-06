import * as chokidar from 'chokidar';
import { FileStores } from './FileStores';
import 'log-timestamp';
import { Injectable } from '@nestjs/common';
import * as process from 'process';
import { Response } from 'express';

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

  getGithubRoot(root?: FileStores) {
    const ret: GithubRoot[] = [];
    const pre = root || this.fileStores.tree;
    const keys = Object.keys(pre);
    for (let i = 0; i < keys.length; i++) {
      const msg = pre[keys[i]];
      if (msg.file) {
        ret.push({
          path: keys[i],
          url: msg.route,
        });
      } else {
        if (Object.keys(msg).length > 0) {
          ret.push(...this.getGithubRoot(msg));
        }
      }
    }
    return ret;
  }

  readFile(file: string, response: Response) {
    return response.sendFile(process.env.WATCH + '/' + file);
  }
}

type GithubRoot = {
  path: string;
  url: string;
};
