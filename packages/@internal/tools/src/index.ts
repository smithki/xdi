import fs from 'fs';
import path from 'path';

import { start } from 'flik';

import plopCommand from './commands/plop';

/**
 * Starts a command-line interface with built-in
 * static argument types and generated help-text.
 */
start({
  binaryName: 'tools',
  version: getVersion(),
  commands: [plopCommand],
});

/**
 * Glean "version" from `package.json` at the root of this workspace.
 */
function getVersion() {
  const pkgJsonFilePath = path.resolve(__dirname, '../package.json');
  return `v${JSON.parse(fs.readFileSync(pkgJsonFilePath).toString('utf-8')).version}`;
}
