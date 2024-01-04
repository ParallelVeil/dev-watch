import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWatch(): string {
    return 'Watching!';
  }
}
