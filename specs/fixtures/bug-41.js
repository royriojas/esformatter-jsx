import knex from 'knex';
import KnexSchemaBuilder from 'knex-schema';

export default class DatabaseConnection {
  constructor( config, schema ) {
    this.config = config;
    this.schema = schema;
  }

  async openAsync() {
    this.connection = knex( this.config );
  }

  getUnderlying() {
    return this.connection;
  }

  executeQueryAsync( query ) {
    return this.connection.raw( query );
  }

  async executeScalarAsync( query ) {
    const result = await this.executeQueryAsync( query );

    if ( result.rowCount !== 1 ) {
      throw new Error( 'Invalid row count for scalar query' );
    }

    const onlyRow = result.rows[ 0 ];
    const onlyRowKeys = Object.keys( onlyRow );

    if ( onlyRowKeys.length !== 1 ) {
      throw new Error( 'Invalid column count for scalar query' );
    }

    return onlyRow[ onlyRowKeys[ 0 ] ];
  }

  async executeMigrationsAsync() {
    const schemaBuilder = new KnexSchemaBuilder( this.connection );

    await schemaBuilder.sync( this.schema );
    await schemaBuilder.populate( this.schema );
    await this.connection.migrate.latest();
  }


  dropDatabaseAsync( database ) {
    return this.executeQueryAsync( `DROP DATABASE IF EXISTS ${database}` );
  }

  createDatabaseAsync( database ) {
    return this.executeQueryAsync( `CREATE DATABASE ${database}` );
  }

  disposeAsync() {
    return this.connection.destroy();
  }
}
