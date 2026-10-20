#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/e04c207a49a2c453ab3b941d75e6f4502a58b5441dd401d99832a3d33f95f686/contract';
import startContract from '../../snapshots/e04c207a49a2c453ab3b941d75e6f4502a58b5441dd401d99832a3d33f95f686/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/e25a97a0c089e1b30286ba538593e65fe691d12bd1016938a4dc5abae8cab3d1/contract';
import endContract from '../../snapshots/e25a97a0c089e1b30286ba538593e65fe691d12bd1016938a4dc5abae8cab3d1/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('password', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-user-password', {
        check: () => placeholder('backfill-user-password:check'),
        run: () => placeholder('backfill-user-password:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'user', column: 'password' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
