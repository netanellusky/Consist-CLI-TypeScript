// createProject.ts

import * as fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import chalk from 'chalk';

interface ServiceInfo {
    dependencies?: { [key: string]: string };
    envConfig?: string;
    files?: { source: string; destination: string }[];
}

const servicesInfo: { [key: string]: ServiceInfo } = {
    'Google Sheets': {
        dependencies: {
            'google-auth-library': '^9.15.0',
            'google-spreadsheet': '^4.1.4',
        },
        envConfig: `
    google: {
        serviceAccountEmail: getEnvVar('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
        privateKey: getEnvVar('GOOGLE_PRIVATE_KEY').replace(/\\\\n/g, '\\n'),
        spreadsheetId: getEnvVar('GOOGLE_SPREADSHEET_ID'),
        refreshIntervalMs: parseInt(getEnvVar('REFRESH_INTERVAL_MS', true, (6 * 60 * 60 * 1000).toString())), // Defaults to 6 hours
    }`,
    },
    'Redis': {
        dependencies: {
            ioredis: '^5.4.1',
        },
        envConfig: `
    redis: {
        host: getEnvVar('REDIS_HOST'),
        port: parseInt(getEnvVar('REDIS_PORT', true, '6380')),
        password: getEnvVar('REDIS_PASSWORD', true),
    }`,
        files: [
            {
                source: 'redis/config/redisConfig.ts',
                destination: 'src/config/redisConfig.ts',
            },
            {
                source: 'redis/shared/services/cacheService.ts',
                destination: 'src/shared/services/cacheService.ts',
            },
        ],
    },
    'Azure Key Vault': {
        dependencies: {
            '@azure/identity': '^4.5.0',
            '@azure/keyvault-secrets': '^4.9.0',
        },
        envConfig: `
    azure: {
        tenantId: getEnvVar('AZURE_TENANT_ID'),
        clientId: getEnvVar('AZURE_CLIENT_ID'),
        clientSecret: getEnvVar('AZURE_CLIENT_SECRET'),
        keyVaultName: getEnvVar('KEY_VAULT_NAME'),
    }`,
    },
};

export async function createProject(projectName: string) {
    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
        console.log(chalk.red(`Project ${projectName} already exists.`));
        return;
    }

    const { author, services } = await promptUserForProjectInfo();

    copyProjectTemplate(projectPath);
    addServiceFeatures(services, projectPath);
    modifyEnvConfig(services, projectPath);
    updatePackageJson(projectName, author, services, projectPath);
    displayNextSteps(projectName);
}

async function promptUserForProjectInfo() {
    return await inquirer.prompt([
        {
            type: 'input',
            name: 'author',
            message: 'Author name:',
        },
        {
            type: 'checkbox',
            name: 'services',
            message: 'Select services:',
            choices: ['Glassix', 'Google Sheets', 'Redis', 'Azure Key Vault'],
        },
    ]);
}

function copyProjectTemplate(projectPath: string) {
    fs.copySync(path.join(__dirname, '../../templates/project'), projectPath);
}

function addServiceFeatures(services: string[], projectPath: string) {
    for (const service of services) {
        const serviceName = service.toLowerCase().replace(' ', '-');
        const serviceInfo = servicesInfo[service];

        if (serviceInfo && serviceInfo.files && serviceInfo.files.length > 0) {
            // Copy each file to its destination
            for (const file of serviceInfo.files) {
                const sourcePath = path.join(__dirname, '../../templates/services', file.source);
                const destinationPath = path.join(projectPath, file.destination);

                if (fs.existsSync(sourcePath)) {
                    fs.copySync(sourcePath, destinationPath);
                    console.log(chalk.green(`Added ${service} file: ${file.destination}`));
                } else {
                    console.log(chalk.yellow(`File not found for ${service}: ${sourcePath}`));
                }
            }
        } else {
            // Copy the service feature folder
            const serviceTemplatePath = path.join(
                __dirname,
                `../../templates/services/${serviceName}`
            );
            if (fs.existsSync(serviceTemplatePath)) {
                fs.copySync(
                    serviceTemplatePath,
                    path.join(projectPath, `src/features/${serviceName}`)
                );
                console.log(chalk.green(`Added ${service} feature to the project.`));
            } else {
                console.log(chalk.yellow(`No template found for ${service}.`));
            }
        }
    }
}


function modifyEnvConfig(services: string[], projectPath: string) {
    const envConfigPath = path.join(projectPath, 'src', 'config', 'envConfig.ts');
    let envConfigContent = fs.readFileSync(envConfigPath, 'utf-8');

    let serviceConfigEntries: string[] = [];

    for (const service of services) {
        const serviceInfo = servicesInfo[service];
        if (serviceInfo && serviceInfo.envConfig) {
            serviceConfigEntries.push(serviceInfo.envConfig);
        }
        // Glassix depends on Azure Key Vault
        if (service === 'Glassix') {
            const azureServiceInfo = servicesInfo['Azure Key Vault'];
            if (azureServiceInfo && azureServiceInfo.envConfig) {
                serviceConfigEntries.push(azureServiceInfo.envConfig);
            }
        }
    }

    // Remove duplicate entries
    serviceConfigEntries = [...new Set(serviceConfigEntries)];

    const serviceConfigs = serviceConfigEntries.join(',');

    // Replace the placeholder with the service configurations
    envConfigContent = envConfigContent.replace(
        '//SERVICE_CONFIGS_PLACEHOLDER',
        serviceConfigs
    );

    // Write back the updated envConfig.ts
    fs.writeFileSync(envConfigPath, envConfigContent, 'utf-8');
}

function updatePackageJson(
    projectName: string,
    author: string,
    services: string[],
    projectPath: string
) {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = fs.readJSONSync(packageJsonPath);
    packageJson.name = projectName;
    packageJson.author = author;

    // Add additional dependencies based on selected services
    packageJson.dependencies = packageJson.dependencies || {};

    for (const service of services) {
        const serviceInfo = servicesInfo[service];
        if (serviceInfo && serviceInfo.dependencies) {
            for (const [dependency, version] of Object.entries(
                serviceInfo.dependencies
            )) {
                packageJson.dependencies[dependency] = version;
            }
        }
        // Glassix depends on Azure Key Vault
        if (service === 'Glassix') {
            const azureServiceInfo = servicesInfo['Azure Key Vault'];
            if (azureServiceInfo && azureServiceInfo.dependencies) {
                for (const [dependency, version] of Object.entries(
                    azureServiceInfo.dependencies
                )) {
                    packageJson.dependencies[dependency] = version;
                }
            }
        }
    }

    fs.writeJSONSync(packageJsonPath, packageJson, { spaces: 2 });
}

function displayNextSteps(projectName: string) {
    console.log(chalk.green(`Project ${projectName} created successfully.`));
    console.log(`\nNext steps:\n`);
    console.log(`  cd ${projectName}`);
    console.log(`  npm install`);
    console.log(`  npm run dev`);
}
