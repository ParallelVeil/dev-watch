import * as pathNode from 'path';

type FileType = 'file' | 'folder';

export interface FileValue {
  name: string;
  path: string;
  route: string;
  file: boolean;
  [key: string]: any; // 添加字符串索引签名
}

export interface FileTree {
  [key: string]: FileValue | FileTree;
}

export interface FilePath {
  name: string;
  route: string;
  file: boolean;
}

export class FileStores {
  tree: FileTree = {};
  watchPath: string;

  constructor(watchPath: string) {
    this.watchPath = watchPath;
  }

  public getPaths(path: string[]): FilePath[] {
    const message = this.getMessage(path);
    if (!message || message.file) {
      return [];
    }
    const keys = Object.keys(message);
    const ret: FilePath[] = [];
    for (let i = 0; i < keys.length; i++) {
      const msg = message[keys[i]];
      ret.push({
        name: keys[i],
        route: (msg.route as string | undefined) || path.join('/') + keys[i],
        file: !!msg.file,
      });
    }
    return ret;
  }

  public getMessage(path: string[]): FileTree {
    let exec = this.tree;
    for (let i = 0; exec && i < path.length; i++) {
      if (path[i] === '') {
        break;
      }
      exec = exec[path[i]];
    }
    return exec;
  }

  addFolder(path: string) {
    this._add(path, 'folder');
  }

  addFile(path: string) {
    this._add(path, 'file');
  }

  changeFile(path: string) {
    this.delete(path);
    this._add(path, 'file');
  }

  delete(path: string) {
    const routeFromPath = pathNode.relative(this.watchPath, path);
    const paths = routeFromPath.split(pathNode.sep);
    let exec = this.tree;
    for (let i = 0; exec && i < paths.length - 1; i++) {
      exec = exec[paths[i]];
    }
    // 删除属性
    let ret = undefined;
    if (exec && typeof exec === 'object') {
      ret = exec[paths[paths.length - 1]];
      delete exec[paths[paths.length - 1]];
    }
    return ret;
  }

  private async _add(path: string, type: FileType) {
    const routeFromPath = pathNode.relative(this.watchPath, path);
    const paths = routeFromPath.split(pathNode.sep);
    let exec: FileTree = this.tree;

    for (let i = 0; i < paths.length; i++) {
      if (!exec[paths[i]] && (i !== paths.length - 1 || type == 'folder')) {
        exec[paths[i]] = {};
      } else if (i === paths.length - 1 && type == 'file') {
        exec[paths[i]] = {
          name: paths[i],
          route: routeFromPath.replace(pathNode.sep, '/'),
          path: routeFromPath,
          file: true,
        };
      }
      exec = exec[paths[i]];
    }
  }
}
