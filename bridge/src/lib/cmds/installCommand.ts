import { store } from '../api/storage'

export interface Command {
    elevate: boolean,
    install: string
}

export function choco({ name, version }: { name: string; version?: string }): Command {

    const cmd = []
    cmd.push(store.get('pkgs.choco'))
    cmd.push('install -y')
    cmd.push(name)
    if (version !== undefined) {
        cmd.push(`--version=${version}`)
    }
    return { elevate: true, install: cmd.join(' ') }
}

export function brew({ name }: { name: string; version?: string | null }): Command {
    const cmd = [];
    cmd.push(store.get('pkgs.brew'));
    cmd.push('install');
    cmd.push(name);
    return { elevate: false, install: cmd.join(' ') };
}

export function pip({ name, version }: { name: string; version?: string }): Command {
    const cmd = [];
    cmd.push(store.get('pkgs.python3'));
    cmd.push('-m');
    cmd.push('pip install');
    if (version !== undefined) {
        cmd.push(`${name}==${version}`);
    }
    else {
        cmd.push(name);
    }
    const platform = process.platform;
    platform === 'win32' ? cmd.push('--user') : null;
    return { elevate: false, install: cmd.join(' ') };
}


export function shell({ name }: { name: string; version?: string }): Command {
    const cmds = {
        'choco': "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(''https://community.chocolatey.org/install.ps1''))",
        // -- it only prompts if stdin is a TTY. So we echo the output
        // to run script in a noninteractive mode
        'brew': `echo | /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`
    };
    return { elevate: true, install: cmds[name] };
}
