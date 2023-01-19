import { FileObject } from './components/Editor/types';
import { GitDiff } from './components/git/types';
import { Project } from './components/projects/types';
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
            openSystemFolder(): void
            getProjectTemplates(query: string): Promise<Template[]>
            addGitHubRemote({ repo, token, url }: { repo: string, token: string, url: string }): Promise<void>
            createFile(createInfo: CreateInfo): Promise<string>;
            createFolder(createInfo: CreateInfo): Promise<string>;
            readActiveFile(filepath: string): Promise<string>;
            loadimagebase64(filepath: string): Promise<string>

            mkbasedir(data: any): Promise<any>;
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
            clone({ repo, git_url }: { repo: string, git_url: string }): Promise<void>;
            revert(args: { oid: string, oid_prev: string }): Promise<void>
            pull(): Promise<void>;
            push(): Promise<void>;
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
