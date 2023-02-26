import { FileObject } from './components/Editor/types';
import { GitDiff } from './components/Git/types';
import { Package, FileChanges, CreateInfo, ActivePath, Template } from './types';


declare global {
    interface Window {
        dialogue: {
            openImageFile(): void
        }
        shared: {
            incomingData(channel, callback): any;
            removeListeners(channel): void;
        };
        settings: {
            set(val: any): Promise<any>;
            get(key: string): any;
            del(key: string): Promise<any>
            logPath(): string
            platform(): string
        };
        projects: {
            getFileBasename({ filepath }: { filepath: string }): string
            getFolderFiles({ directoryPath }: { directoryPath: string }): string[]
            rename({ newName, activePath }: { newName: string, activePath: ActivePath }): Promise<ActivePath>
            projectPath(): Promise<string>
            openSystemFolder(): void
            getProjectTemplates(query: string): Promise<Template[]>
            createFile(createInfo: CreateInfo): Promise<string>;
            createFolder(createInfo: CreateInfo): Promise<string>;
            readActiveFile(filepath: string): Promise<string>;
            loadimagebase64(filepath: string): Promise<string>
            getDirName({ filepath }: { filepath: string }): string

            mkbasedir(data: any): Promise<void>;
            getLocalProjectsNames(): string[];
            delete(name: string): void;
            showFiles(): Promise<FileObject[]>;
            writeActiveFile(fileChange: FileChanges): any;
            deleteTreeElement(activePath: ActivePath): any;
            mkprojectdir(project_name: string): any;
            copyFile(args: { src: string, destination: string, root: boolean }): Promise<void>
            renameFile(data: { newName: string, activePath: ActivePath }): any
        };
        git: {
            addGitHubRemote({ repo, token, url }: { repo: string, token: string, url: string }): Promise<void>
            testGitHubToken({ repo, token, git_url }: { repo: string, token: string, git_url: string }): Promise<void>
            checkoutBranch({ branch }: { branch: string }): Promise<void>
            listBranches(): Promise<string[]>
            status(): Promise<string[]>
            headPositonLocal({ branch, url }: { branch: string, url: string }): Promise<string>
            getCurrentBranch(): Promise<string>
            clone({ repo, git_url }: { repo: string, git_url: string }): Promise<void>;
            revert(args: { oid: string, oid_prev: string }): Promise<void>
            pull(branch: string): Promise<void>;
            push({ branch, force }: { branch: string, force: boolean }): Promise<void>;
            commit(): Promise<void>;
            log(): Promise<string[]>;
            diff(args: { oid: string, oid_prev: string }): Promise<GitDiff[]>;
            init(project_name: string): void;
        };
        terminal: {
            keystoke(e: string): any;
            fit(data: { x?: number, y?: number }): any;
            exec(data: { exec: string, path: string }): void
        };
        pkg: {
            install(pkgs: Package[]): any;
            getlogs(): any;
            check(pkgs: Package[]): void
            sudo(password: string): void
        };
    }
}
