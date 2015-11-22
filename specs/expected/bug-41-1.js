import bookshelf from '../../../dal/bookshelf.js';
import knexConfig from '../../../database/knexfile';
import schema from '../../../database/BaseSchema.js';
import DatabaseConnection from './databaseConnection';

class DatabaseUnitOfWork {
  constructor(config) {
    this.config = config;
  }

  async setUpAsync() {
    await this.setUpMetaConnectionAsync();
    await this.connection.dropDatabaseAsync(this.config.connection.database);
    await this.connection.createDatabaseAsync(this.config.connection.database);
    await this.tearDownConnectionAsync();
    await this.setUpDataConnectionAsync();
    await this.connection.executeMigrationsAsync();
    await this.tearDownConnectionAsync();
    await bookshelf.factory.knex.client.initializePool(knexConfig);
  }

  async tearDownAsync() {
    await bookshelf.factory.knex.destroy();
    await this.setUpMetaConnectionAsync();
    await this.connection.dropDatabaseAsync(this.config.connection.database);
    await this.tearDownConnectionAsync();
  }
}

export function createUnitOfWork() {
  return new DatabaseUnitOfWork(knexConfig);
}
