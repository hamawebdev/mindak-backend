import { injectable } from 'inversify';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as userSchema from './schemas/user';
import * as refreshTokenSchema from './schemas/refresh-token';
import * as passwordResetTokenSchema from './schemas/password-reset-token';
import * as serviceCategorySchema from './schemas/service-category';
import * as serviceSchema from './schemas/service';
import * as formQuestionSchema from './schemas/form-question';
import * as formQuestionAnswerSchema from './schemas/form-question-answer';
import * as podcastReservationSchema from './schemas/podcast-reservation';
import * as serviceReservationSchema from './schemas/service-reservation';
import * as reservationStatusHistorySchema from './schemas/reservation-status-history';
import * as reservationNoteSchema from './schemas/reservation-note';
import * as analyticsEventSchema from './schemas/analytics-event';

export type DatabaseConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
};


// Helper function to create db instance with proper typing
const buildDrizzle = (pool: Pool) => drizzle({
  schema: {
    ...userSchema,
    ...refreshTokenSchema,
    ...passwordResetTokenSchema,
    ...serviceCategorySchema,
    ...serviceSchema,
    ...formQuestionSchema,
    ...formQuestionAnswerSchema,
    ...podcastReservationSchema,
    ...serviceReservationSchema,
    ...reservationStatusHistorySchema,
    ...reservationNoteSchema,
    ...analyticsEventSchema,
  },
  client: pool,
});

export interface IDatabase {
  close(): Promise<void>;
  getInstance(): ReturnType<typeof buildDrizzle>;
}

@injectable()
export class Database implements IDatabase {
  private instance: ReturnType<typeof buildDrizzle>;
  private pool: Pool;

  constructor(config: DatabaseConfig) {
    const pool = new Pool({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
      ssl: config.ssl,
    });
    this.pool = pool;
    this.instance = buildDrizzle(pool);
  }

  getInstance() {
    return this.instance;
  }

  async close() {
    await this.pool.end();
  }
}