import type {PathLike} from 'fs';
import * as fs from 'fs';

import {exec} from 'child_process';
import {join} from 'path';

const ngVersion = '17.1.0';

console.log('ngVersion for openapi generation', ngVersion);

function deleteFile(filePath: PathLike): void {
    fs.unlinkSync(filePath);
}

function deleteOldFiles(directory: string, timestamp: Date): void {
    if (fs.existsSync(directory)) {
        const files = fs.readdirSync(directory);
        for (const file of files) {
            const filePath = join(directory, file);
            const stats = fs.statSync(filePath);
            if (stats.mtime.getTime() < timestamp.getTime()) {
                deleteFile(filePath);
            }
        }
    }
}

/**
 * @param {string} pathToYaml
 * @param {string} directory
 * @param {string[]} apis The names of APIs (i.e.: OpenAPI Tags) that should get generated
 */
async function generateOpenApi(directory: string): Promise<unknown> {
    const env = {
        ...process.env,
        JAVA_OPTS: '',
    };

    // Remember: the generated API is split by OpenApi @Tag annotations on resources
    // Docs:
    //   https://openapi-generator.tech/docs/usage/#generate
    //   https://openapi-generator.tech/docs/globals
    //   https://openapi-generator.tech/docs/generators/typescript-angular/

    const typesPath = '../../types';
    const typeMap = [
        // [OpenApi-Name/Format, Typescript-Name, Import-Path]
        ['AnyType', 'object', undefined],
        ['DateTime', 'BackendLocalDateTime', `${typesPath}/backend-local-date-time`],
    ] as const;
    const paths = typeMap
        .map(([_format, _modelName, importPath]) => importPath)
        .filter((importPath) => importPath);
    const uniquePaths = new Set(paths);
    if (paths.length !== uniquePaths.size) {
        throw new Error('import mapping works only with unique import paths');
    }

    const typeMappingsArg = typeMap.map((e) => `${e[0]}=${e[1]}`).join(',');
    const strings = typeMap.filter((e) => !!e[2]).map((e) => `${e[1]}=${e[2]}`);
    strings.push('string=../../types');
    const importMappingsArg = strings.join(',');

    // eslint-disable-next-line prefer-template
    const cmd =
        'npx @openapitools/openapi-generator-cli generate' +
        ` -i http://localhost:8000/schema?format=json` +
        ' -g typescript-angular' +
        // ' --template-dir scripts/openapi/conf/openapi-templates' +
        ` --global-property models,apis,supportingFiles` +
        ` -p ngVersion=${ngVersion}` +
        ' -p disallowAdditionalPropertiesIfNotPresent=false' +
        ' -p ensureUniqueParams=true' +
        ' -p removeOperationIdPrefix=true' +
        ' -p prefixParameterInterfaces=true' +
        ' -p legacyDiscriminatorBehavior=false' +
        ' -p taggedUnions=true' +
        ' -p fileNaming=kebab-case' +
        // Sortierung: uebernimmt Originalreihenfolge
        ' -p sortModelPropertiesByRequiredFlag=false' +
        ' -p sortParamsByRequiredFlag=false' +
        // Enums: uppercase plus underscores
        ' -p enumPropertyNaming=UPPERCASE' +
        // sonst schneidet es bei einigen Enums den vordersten Teil einfach ab
        ' -p removeEnumValuePrefix=false' +
        // ' -p useSingleRequestParameter=true' +
        // ' -p useCustomPathParameterExpansion=true' +
        // type-mappings also work for Format-Mappings (see: rest-includes)
        ` --type-mappings ${typeMappingsArg}` +
        ` --import-mappings ${importMappingsArg}` +
        ' --openapi-normalizer REF_AS_PARENT_IN_ALLOF=true' +
        ' --openapi-normalizer REMOVE_ANYOF_ONEOF_AND_KEEP_PROPERTIES_ONLY=true' +
        ' --openapi-normalizer SIMPLIFY_ANYOF_STRING_AND_ENUM_STRING=true' +
        ' --openapi-normalizer SIMPLIFY_BOOLEAN_ENUM=true' +
        ' --openapi-normalizer SIMPLIFY_ONEOF_ANYOF=true' +
        ' --openapi-normalizer KEEP_ONLY_FIRST_TAG_IN_OPERATION=true' +
        ' --output ' +
        directory;

    console.log('executing command: ', cmd);
    const child = exec(cmd, { env });
    child.stdout?.on('data', (data) => {
        console.log(data.toString());
    });
    child.stderr?.on('data', (data) => {
        console.error(data.toString());
    });

    return new Promise((resolve, reject) => {
        child.on('exit', (code) =>
            code === 0 ? resolve(undefined) : reject(`exit code: ${code}`)
        );
        child.on('error', reject);
    });
}

async function sleep(msec: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, msec));
}

// async main
(async () => {
    const timestamp = new Date();
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    await sleep(100); // make sure timestamp ticks

    const generatorPath = 'libs/generated-api-client/src/lib/generated';

    await generateOpenApi(generatorPath).catch((err) =>
        console.error('Error generating models', err)
    );

    // TODO Figure out why we don't have permissions to delete these files
    // deleteOldFiles(generatorPath, timestamp);
})();
