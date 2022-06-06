import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Users } from './src/database/entities/Users.entity';
import { Friends } from './src/database/entities/Friends.entity';
import { Chats } from './src/database/entities/Chats.entity';
import { ChatRooms } from './src/database/entities/ChatRooms.entity';
import { ChatRoomMembers } from './src/database/entities/ChatRoomMembers.entity';

dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Users, Friends, Chats, ChatRooms, ChatRoomMembers],
  migrations: [__dirname + '/src/migrations/*.ts'],
  cli: { migrationsDir: 'src/migrations' },
  autoLoadEntities: true,
  charset: 'utf8mb4',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  keepConnectionAlive: true,
};

export = config;
