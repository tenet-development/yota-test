import OracleDB from 'oracledb';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  private connection: OracleDB.Connection;

  async getByQuery<T>(
    query: string, 
    params?: (string | number)[] | { [key: string]: OracleDB.BindParameter }
  ): Promise<OracleDB.Result<T>> {
    try {
      if (this.connection) {
        return await this.connection.execute(query, params);
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
