/* eslint-disable no-restricted-syntax */
import * as ASAR from 'asar';
import * as fs from 'fs';
import log from 'loglevel';
import * as path from 'path';
import { _electron as electron, Page, ElectronApplication } from '@playwright/test'



type Architecture = 'x64' | 'x32' | 'arm64';
export interface ElectronAppInfo {
    /** Path to the app's executable file */
    executable: string;
    /** Path to the app's main (JS) file */
    main: string;
    /** Name of the app */
    name: string;
    /** Resources directory */
    resourcesDir: string;
    /** True if the app is using asar */
    asar: boolean;
    /** OS platform */
    platform: 'darwin' | 'win32' | 'linux';
    arch: Architecture;
}


export function findLatestBuild(): string {
    // root of your project
    const rootDir = path.resolve('../');
    // directory where the builds are stored
    const outDir = path.join(rootDir, 'out');
    // list of files in the out directory
    const builds = fs.readdirSync(outDir);
    const platforms = ['win32', 'win', 'windows', 'darwin', 'mac', 'macos', 'osx', 'linux', 'ubuntu'];

    const latestBuild = builds
        // eslint-disable-next-line array-callback-return
        .map(fileName => {
            // make sure it's a directory with "-" delimited platform in its name
            const stats = fs.statSync(path.join(outDir, fileName));
            const isBuild = fileName
                .toLocaleLowerCase()
                .split('-')
                .some(part => platforms.includes(part));
            if (stats.isDirectory() && isBuild) {
                return {
                    name: fileName,
                    time: fs.statSync(path.join(outDir, fileName)).mtimeMs,
                };
            }
        })
        .sort((a, b) => b.time - a.time)
        // eslint-disable-next-line array-callback-return
        .map(file => {
            if (file) {
                return file.name;
            }
        })[0];
    if (!latestBuild) {
        throw new Error('No build found in out directory');
    }
    return path.join(outDir, latestBuild);
}


export function parseElectronApp(buildDir: string): ElectronAppInfo {
    log.info(`Parsing Electron app in ${buildDir}`);
    let platform: string | undefined;
    if (buildDir.endsWith('.app')) {
        buildDir = path.dirname(buildDir);
        platform = 'darwin';
    }
    if (buildDir.endsWith('.exe')) {
        buildDir = path.dirname(buildDir);
        platform = 'win32';
    }

    const baseName = path.basename(buildDir).toLowerCase();
    if (!platform) {
        // parse the directory name to figure out the platform
        if (baseName.includes('win')) {
            platform = 'win32';
        }
        if (baseName.includes('linux') || baseName.includes('ubuntu') || baseName.includes('debian')) {
            platform = 'linux';
        }
        if (baseName.includes('darwin') || baseName.includes('mac') || baseName.includes('osx')) {
            platform = 'darwin';
        }
    }

    if (!platform) {
        throw new Error(`Platform not found in directory name: ${baseName}`);
    }

    let arch: Architecture;
    arch = 'x32'
    if (baseName.includes('x32') || baseName.includes('i386')) {
        arch = 'x32';
    }
    if (baseName.includes('x64')) {
        arch = 'x64';
    }
    if (baseName.includes('arm64')) {
        arch = 'arm64';
    }

    let executable: string;
    let main: string;
    let name: string;
    let asar: boolean;
    let resourcesDir: string;

    if (platform === 'darwin') {
        // MacOS Structure
        // <buildDir>/
        //   <appName>.app/
        //     Contents/
        //       MacOS/
        //        <appName> (executable)
        //       Info.plist
        //       PkgInfo
        //       Resources/
        //         electron.icns
        //         file.icns
        //         app.asar (asar bundle) - or -
        //         app
        //           package.json
        //           (your app structure)

        const list = fs.readdirSync(buildDir);
        let appBundle = list.find(fileName => {
            return fileName.endsWith('.app');
        });
        appBundle = appBundle === undefined ? '' : appBundle
        const appDir = path.join(buildDir, appBundle, 'Contents', 'MacOS');
        const appName = fs.readdirSync(appDir)[0];
        executable = path.join(appDir, appName);

        resourcesDir = path.join(buildDir, appBundle, 'Contents', 'Resources');
        const resourcesList = fs.readdirSync(resourcesDir);
        asar = resourcesList.includes('app.asar');

        let packageJson: { main: string; name: string };
        if (asar) {
            const asarPath = path.join(resourcesDir, 'app.asar');
            packageJson = JSON.parse(ASAR.extractFile(asarPath, 'package.json').toString('utf8'));
            main = path.join(asarPath, packageJson.main);
        } else {
            packageJson = JSON.parse(fs.readFileSync(path.join(resourcesDir, 'app', 'package.json'), 'utf8'));
            main = path.join(resourcesDir, 'app', packageJson.main);
        }
        name = packageJson.name;
    } else if (platform === 'win32') {
        // Windows Structure
        // <buildDir>/
        //   <appName>.exe (executable)
        //   resources/
        //     app.asar (asar bundle) - or -
        //     app
        //       package.json
        //       (your app structure)

        const list = fs.readdirSync(buildDir);
        let exe = list.find(fileName => {
            return fileName.endsWith('.exe');
        });
        exe = exe === undefined ? '' : exe
        executable = path.join(buildDir, exe);

        resourcesDir = path.join(buildDir, 'resources');
        const resourcesList = fs.readdirSync(resourcesDir);
        asar = resourcesList.includes('app.asar');

        let packageJson: { main: string; name: string };

        if (asar) {
            const asarPath = path.join(resourcesDir, 'app.asar');
            packageJson = JSON.parse(ASAR.extractFile(asarPath, 'package.json').toString('utf8'));
            main = path.join(asarPath, packageJson.main);
        } else {
            packageJson = JSON.parse(fs.readFileSync(path.join(resourcesDir, 'app', 'package.json'), 'utf8'));
            main = path.join(resourcesDir, 'app', packageJson.main);
        }
        name = packageJson.name;
    } else {
        /**  @todo add support for linux */
        throw new Error(`Platform not supported: ${platform}`);
    }
    return {
        executable,
        main,
        asar,
        name,
        platform,
        resourcesDir,
        arch,
    };
}

interface StartAppResponse {
    electronApp: ElectronApplication;
    appWindow: Page;
    appInfo: ElectronAppInfo;
}

export async function pause(ms: number): Promise<any> {
    return new Promise(f => setTimeout(f, ms));
}


export async function startApp(): Promise<StartAppResponse> {
    // find the latest build in the out directory
    const latestBuild = findLatestBuild();
    // parse the directory and find paths and other info
    const appInfo = parseElectronApp(latestBuild);
    const electronApp = await electron.launch({
        args: [appInfo.main],
        executablePath: appInfo.executable,
        recordVideo: {
            dir: 'recordings',
            size: {
                width: 800,
                height: 800
            },
        },
    });

    await pause(500);
    const windows = electronApp.windows();
    const appWindow: Page = windows[0];
    appWindow.on('console', console.log);
    return { appWindow, appInfo, electronApp }
}
