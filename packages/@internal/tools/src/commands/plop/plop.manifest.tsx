import path from 'path';

import React from 'react';

import { Directory, Template, Zombi } from 'zombi';

// --- Types / constants / utils -------------------------------------------- //

export const TEMPLATE_IDENTIFIERS = ['node-library'] as const;
export type ValidTemplate = typeof TEMPLATE_IDENTIFIERS[number];

const TEMPLATE_ROOT = path.resolve(__dirname, './templates');

function standardFilepathModifier(filepath: string) {
  return filepath.endsWith('.template') ? filepath.slice(0, -9) : filepath;
}

// --- Templates ------------------------------------------------------------ //

/**
 * Values representing the different scaffold templates available.
 * These templates are intended to make quick work of bootstrapping
 * new libraries, apps, modules, and more throughout this monorepo.
 */
const TEMPLATES: Record<ValidTemplate, JSX.Element> = {
  'node-library': (
    <Zombi<{ libraryName: string }>
      name="node-library"
      templateRoot={TEMPLATE_ROOT}
      prompts={[
        {
          type: 'input',
          name: 'libraryName',
          message: 'Choose a name for your new library:',
        },
      ]}
    >
      {(data) => {
        return (
          <Directory name="packages">
            <Directory name={data.libraryName}>
              <Template name="/" source="node-library">
                {standardFilepathModifier}
              </Template>
            </Directory>
          </Directory>
        );
      }}
    </Zombi>
  ),
};

/**
 * A root "Zombi" template which prompts-for and
 * scaffolds out a boilerplate, interactively.
 */
export const ROOT_TEMPLATE = (
  <Zombi<{ template: ValidTemplate }>
    name="plop"
    templateRoot={TEMPLATE_ROOT}
    prompts={[
      {
        type: 'select',
        name: 'template',
        message: 'Choose a template:',
        choices: TEMPLATE_IDENTIFIERS as unknown as string[],
      },
    ]}
  >
    {(data) => {
      return TEMPLATES[data.template];
    }}
  </Zombi>
);
