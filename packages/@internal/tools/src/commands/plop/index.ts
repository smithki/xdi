import { createCommand } from 'flik';
import { scaffold } from 'zombi';

import { ROOT_TEMPLATE } from './plop.manifest';

export default createCommand(
  {
    command: 'plop',
    description: 'Scaffold something in this monorepo',
  },

  async () => {
    await scaffold(ROOT_TEMPLATE);
  },
);
