import OracleDB from 'oracledb';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  connection: OracleDB.Connection | null = null;

  async getByQuery<T>(
    query: string, 
    params: Array<string | number> = [],
  ): Promise<T> | null {
    try {
      if(this.connection) {
        console.log(query, params);
        const result: OracleDB.Result<T> = await this.connection.execute(query, params);

        if (!result.rows || result.rows.length == 0) {
            return null;
        }

        return result.rows[0][0];
      }
    } catch (error) {
      console.error('Error happened:', error);
    }
  }

  async onApplicationBootstrap() {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_SERVICE } = process.env;

    try {
      this.connection = await OracleDB.getConnection( {
        user: DB_USER,
        password: DB_PASSWORD,
        connectString: `${DB_HOST}:${DB_PORT}/${DB_SERVICE}`
      });

    } catch (error) {
      console.error('Error happened:', error);
    }
  }

  beforeApplicationShutdown() {
    try {
      if (this.connection) {
        this.connection.close();
      }
    } catch (error) {
      console.error('Error happened:', error);
    }
  }
}
