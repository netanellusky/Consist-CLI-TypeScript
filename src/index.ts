#!/usr/bin/env node

import { Command } from 'commander';
import { createProject } from './commands/createProject';
import { generateComponent } from './commands/generateComponent';

const program = new Command();

program
    .name('my-cli')
    .description('CLI tool for generating TypeScript projects and components')
    .version('1.0.0');

program
    .command('new <project-name>')
    .description('Create a new TypeScript project')
    .action((projectName) => {
        createProject(projectName);
    });

program
    .command('generate <component-type> <component-name>')
    .alias('g')
    .description('Generate a new component (controller, service, route, util)')
    .action((componentType, componentName) => {
        generateComponent(componentType, componentName);
    });

program.parse(process.argv);
