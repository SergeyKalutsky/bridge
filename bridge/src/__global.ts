import { Commit } from './components/git/types';
import { Project } from './components/projects/types';
import { FileChanges, CreateInfo, ActivePath, ParsedGitDiff } from './types';


declare global {
    interface Window {
        shared: {
            incomingData(channel, callback): any;
            removeListeners(channel): void;
        };
        settings: {
            set(val: any): Promise<any>;
            get(key: string): any;
            del(key: string): Promise<any>
        };
        projects: {
            mkbasedir(data: any): Promise<any>;
            getLocalProjectsNames(): string[];
            delete(name: string): void;
            showFiles(): Promise<any>;
            readActiveFile(filepath: string): Promise<any>;
            writeActiveFile(fileChange: FileChanges): any;
            createFile(createInfo: CreateInfo): any;
            createFolder(createInfo: CreateInfo): any;
            deleteTreeElement(activePath: ActivePath): any;
            mkprojectdir(project_name: string): any;
            copyFile(args: { src: string, destination: string, root: boolean }): any
            renameFile(data: { newName: string, activePath: ActivePath}): any
        };
        git: {
            clone(project: Project): void;
            pull(): void;
            push(): void;
            commit(): void;
            log(): Commit[];
            diff(hash: string): ParsedGitDiff[];
            init(project_name: string): void;
        };
        terminal: {
            keystoke(e): any;
            fit(data: { x?: number, y?: number }): any;

        };
        pkg: {
            install(pkgs: string[]): any;
            getlogs(): any;
            check(cmd: string): void
        };
    }
}
