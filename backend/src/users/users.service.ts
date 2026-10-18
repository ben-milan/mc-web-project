import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export type User = {
  id: number;
  username: string;
  passwordHash: string;
  role: 'user' | 'admin';
};

@Injectable()
export class UsersService {
  private users: User[] = [];

  async onModuleInit() {
    // Seed a default admin — replace password via env in production
    const hash = await bcrypt.hash(
      process.env.ADMIN_PASSWORD ?? 'changeme',
      10,
    );
    this.users = [
      { id: 1, username: 'bmk_0909', passwordHash: hash, role: 'admin' },
    ];
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find((u) => u.username === username);
  }
}
