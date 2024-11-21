import * as fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export async function generateComponent(componentType: string, componentName: string) {
    const validTypes = ['controller', 'service', 'route', 'util'];
    if (!validTypes.includes(componentType)) {
        console.log(chalk.red(`Invalid component type: ${componentType}`));
        console.log(`Valid types: ${validTypes.join(', ')}`);
        return;
    }

    const srcPath = path.join(process.cwd(), 'src');
    if (!fs.existsSync(srcPath)) {
        console.log(chalk.red('Cannot find src directory. Are you in the project root?'));
        return;
    }

    const componentDir = path.join(srcPath, `${componentType}s`);
    const componentFile = path.join(componentDir, `${componentName}.ts`);

    if (fs.existsSync(componentFile)) {
        console.log(chalk.red(`${componentType} ${componentName} already exists.`));
        return;
    }

    // Ensure the component directory exists
    fs.ensureDirSync(componentDir);

    // Load the template
    const templatePath = path.join(__dirname, `../../templates/${componentType}.ts`);
    if (!fs.existsSync(templatePath)) {
        console.log(chalk.red(`Template for ${componentType} not found.`));
        return;
    }

    let template = fs.readFileSync(templatePath, 'utf-8');
    template = template.replace(/__COMPONENT_NAME__/g, componentName);

    // Write the component file
    fs.writeFileSync(componentFile, template);

    console.log(chalk.green(`${componentType} ${componentName} created successfully.`));

    // If the component is a route, update routes/index.ts
    if (componentType === 'route') {
        const routesIndexPath = path.join(srcPath, 'routes', 'index.ts');
        if (fs.existsSync(routesIndexPath)) {
            let routesIndex = fs.readFileSync(routesIndexPath, 'utf-8');
            const importStatement = `import ${componentName} from './${componentName}';`;
            const useRouteStatement = `router.use('/${componentName}', ${componentName});`;

            if (!routesIndex.includes(importStatement)) {
                routesIndex = `${importStatement}\n${routesIndex}`;
            }
            if (!routesIndex.includes(useRouteStatement)) {
                routesIndex = routesIndex.replace('// Routes', `// Routes\n${useRouteStatement}`);
            }

            fs.writeFileSync(routesIndexPath, routesIndex);
            console.log(chalk.green(`Updated routes/index.ts with ${componentName} route.`));
        }
    }
}
