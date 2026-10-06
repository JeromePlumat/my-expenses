#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/9c83073fb5d8e345ab9ab1cdf00e72ef1ce4f6df0491d71e50bfbb705521c5f2/contract';
import startContract from '../../snapshots/9c83073fb5d8e345ab9ab1cdf00e72ef1ce4f6df0491d71e50bfbb705521c5f2/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/e04c207a49a2c453ab3b941d75e6f4502a58b5441dd401d99832a3d33f95f686/contract';
import endContract from '../../snapshots/e04c207a49a2c453ab3b941d75e6f4502a58b5441dd401d99832a3d33f95f686/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'category',
        columns: [
          col('colour', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'expense',
        column: col('categoryId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'category',
        constraint: 'category_name_key',
        columns: ['name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'expense',
        index: 'expense_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'expense',
        foreignKey: {
          name: 'expense_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'category', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
