// import fs from 'fs'
// import os from 'os'
// import path from 'path'
// import crypto from 'crypto'
// import { spawn } from 'child_process';


// function EscapeDoubleQuotes(string) {
//     if (typeof string !== 'string') throw new Error('Expected a string.');
//     return string.replace(/"/g, '\\"');
// }

// function Remove(path, end) {
//     if (typeof path !== 'string' || !path.trim()) {
//         return end(new Error('Argument path not defined.'));
//     }
//     let command = [];
//     if (process.platform === 'win32') {
//         if (/"/.test(path)) {
//             return end(new Error('Argument path cannot contain double-quotes.'));
//         }
//         command.push('rmdir /s /q "' + path + '"');
//     } else {
//         command.push('/bin/rm');
//         command.push('-rf');
//         command.push('"' + EscapeDoubleQuotes(path.normalize(path)) + '"');
//     }
//     const strCommand = command.join(' ');
//     const child = spawn(strCommand, { shell: true })
//     child.stdin.end();
// }

// function UUID(instance, end) {
//     crypto.randomBytes(256,
//         function (error, random) {
//             if (error) random = Date.now() + '' + Math.random();
//             var hash = crypto.createHash('SHA256');
//             hash.update('sudo-prompt-3');
//             hash.update(instance.options.name);
//             hash.update(instance.command);
//             hash.update(random);
//             var uuid = hash.digest('hex').slice(-32);
//             if (!uuid || typeof uuid !== 'string' || uuid.length !== 32) {
//                 // This is critical to ensure we don't remove the wrong temp directory.
//                 return end(new Error('Expected a valid UUID.'));
//             }
//             end(undefined, uuid);
//         }
//     );
// }


// function Mac(instance, callback) {
//     var temp = os.tmpdir();
//     if (!temp) return callback(new Error('os.tmpdir() not defined.'));
//     var user = process.env.USER; // Applet shell scripts require $USER.
//     if (!user) return callback(new Error('env[\'USER\'] not defined.'));
//     UUID(instance,
//         function (error, uuid) {
//             if (error) return callback(error);
//             instance.uuid = uuid;
//             instance.path = path.join(
//                 temp,
//                 instance.uuid,
//                 instance.options.name + '.app'
//             );
//             function end(error, stdout, stderr) {
//                 Remove(path.dirname(instance.path),
//                     function (errorRemove) {
//                         if (error) return callback(error);
//                         if (errorRemove) return callback(errorRemove);
//                         callback(undefined, stdout, stderr);
//                     }
//                 );
//             }
//             MacApplet(instance,
//                 function (error, stdout, stderr) {
//                     if (error) return end(error, stdout, stderr);
//                     MacIcon(instance,
//                         function (error) {
//                             if (error) return end(error);
//                             MacPropertyList(instance,
//                                 function (error, stdout, stderr) {
//                                     if (error) return end(error, stdout, stderr);
//                                     MacCommand(instance,
//                                         function (error) {
//                                             if (error) return end(error);
//                                             MacOpen(instance,
//                                                 function (error, stdout, stderr) {
//                                                     if (error) return end(error, stdout, stderr);
//                                                     MacResult(instance, end);
//                                                 }
//                                             );
//                                         }
//                                     );
//                                 }
//                             );
//                         }
//                     );
//                 }
//             );
//         }
//     );
// }

// function MacApplet(instance, end) {
//     var parent = path.dirname(instance.path);
//     fs.mkdir(parent,
//         function (error) {
//             if (error) return end(error);
//             var zip = path.join(parent, 'sudo-prompt-applet.zip');
//             fs.writeFile(zip, APPLET, 'base64',
//                 function (error) {
//                     if (error) return end(error);
//                     var command = [];
//                     command.push('/usr/bin/unzip');
//                     command.push('-o'); // Overwrite any existing applet.
//                     command.push('"' + EscapeDoubleQuotes(zip) + '"');
//                     command.push('-d "' + EscapeDoubleQuotes(instance.path) + '"');
//                     command = command.join(' ');
//                     Node.child.exec(command, { encoding: 'utf-8' }, end);
//                 }
//             );
//         }
//     );
// }

// function MacCommand(instance, end) {
//     var path = path.join(
//         instance.path,
//         'Contents',
//         'MacOS',
//         'sudo-prompt-command'
//     );
//     var script = [];
//     // Preserve current working directory:
//     // We do this for commands that rely on relative paths.
//     // This runs in a subshell and will not change the cwd of sudo-prompt-script.
//     script.push('cd "' + EscapeDoubleQuotes(Node.process.cwd()) + '"');
//     // Export environment variables:
//     for (var key in instance.options.env) {
//         var value = instance.options.env[key];
//         script.push('export ' + key + '="' + EscapeDoubleQuotes(value) + '"');
//     }
//     script.push(instance.command);
//     script = script.join('\n');
//     fs.writeFile(path, script, 'utf-8', end);
// }

// function MacIcon(instance, end) {
//     if (!instance.options.icns) return end();
//     fs.readFile(instance.options.icns,
//         function (error, buffer) {
//             if (error) return end(error);
//             var icns = path.join(
//                 instance.path,
//                 'Contents',
//                 'Resources',
//                 'applet.icns'
//             );
//             fs.writeFile(icns, buffer, end);
//         }
//     );
// }

// function MacOpen(instance, end) {
//     // We must run the binary directly so that the cwd will apply.
//     var binary = path.join(instance.path, 'Contents', 'MacOS', 'applet');
//     // We must set the cwd so that the AppleScript can find the shell scripts.
//     var options = {
//         cwd: path.dirname(binary),
//         encoding: 'utf-8'
//     };
//     // We use the relative path rather than the absolute path. The instance.path
//     // may contain spaces which the cwd can handle, but which exec() cannot.
//     Node.child.exec('./' + path.basename(binary), options, end);
// }

// function MacPropertyList(instance, end) {
//     // Value must be in single quotes (not double quotes) according to man entry.
//     // e.g. defaults write com.companyname.appname "Default Color" '(255, 0, 0)'
//     // The defaults command will be changed in an upcoming major release to only
//     // operate on preferences domains. General plist manipulation utilities will
//     // be folded into a different command-line program.
//     var plist = path.join(instance.path, 'Contents', 'Info.plist');
//     var path = EscapeDoubleQuotes(plist);
//     var key = EscapeDoubleQuotes('CFBundleName');
//     var value = instance.options.name + ' Password Prompt';
//     if (/'/.test(value)) {
//         return end(new Error('Value should not contain single quotes.'));
//     }
//     var command = [];
//     command.push('/usr/bin/defaults');
//     command.push('write');
//     command.push('"' + path + '"');
//     command.push('"' + key + '"');
//     command.push("'" + value + "'"); // We must use single quotes for value.
//     command = command.join(' ');
//     Node.child.exec(command, { encoding: 'utf-8' }, end);
// }

// function MacResult(instance, end) {
//     var cwd = path.join(instance.path, 'Contents', 'MacOS');
//     fs.readFile(path.join(cwd, 'code'), 'utf-8',
//         function (error, code) {
//             if (error) {
//                 if (error.code === 'ENOENT') return end(new Error(PERMISSION_DENIED));
//                 end(error);
//             } else {
//                 fs.readFile(path.join(cwd, 'stdout'), 'utf-8',
//                     function (error, stdout) {
//                         if (error) return end(error);
//                         fs.readFile(path.join(cwd, 'stderr'), 'utf-8',
//                             function (error, stderr) {
//                                 if (error) return end(error);
//                                 code = parseInt(code.trim(), 10); // Includes trailing newline.
//                                 if (code === 0) {
//                                     end(undefined, stdout, stderr);
//                                 } else {
//                                     error = new Error(
//                                         'Command failed: ' + instance.command + '\n' + stderr
//                                     );
//                                     error.code = code;
//                                     end(error, stdout, stderr);
//                                 }
//                             }
//                         );
//                     }
//                 );
//             }
//         }
//     );
// }
