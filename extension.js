const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

//workspace path
const workspacePath = path.join(__dirname, '../', 'owngitextension-workspace');

let fileTemplatesFile = undefined;
let fileTemplatesJSON = undefined;
try {
    fileTemplatesFile = path.join(workspacePath, 'FileTemplates.json');

    fileTemplatesJSON = JSON.parse(
        fs.readFileSync(fileTemplatesFile).toString()
    )['File Templates'];
} catch (e) {
    createWorkspace();

    fileTemplatesFile = path.join(workspacePath, 'FileTemplates.json');

    fileTemplatesJSON = JSON.parse(
        fs.readFileSync(fileTemplatesFile).toString()
    )['File Templates'];
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // create git Repo
    let disposable = vscode.commands.registerCommand(
        'owngitextension.createGitRepo',
        async function () {
            if (vscode.workspace.workspaceFolders.length == 0) {
                vscode.window.showErrorMessage('Open a folder!');
                return;
            }
            let workspacefolderUri = undefined;
            let workspacefolderName = undefined;
            if (vscode.workspace.workspaceFolders.length > 1) {
                let wsfList = [];
                for (let i in vscode.workspace.workspaceFolders) {
                    wsfList.push(vscode.workspace.workspaceFolders[i].name);
                }
                let choice = undefined;
                await vscode.window.showQuickPick(wsfList).then(
                    (value) => {
                        choice = value;
                    },
                    (reason) => {
                        vscode.window.showErrorMessage(
                            'Something went wrong:' + reason
                        );
                    }
                );
                for (let i in vscode.workspace.workspaceFolders) {
                    if (choice == vscode.workspace.workspaceFolders[i].name) {
                        workspacefolderUri =
                            vscode.workspace.workspaceFolders[i].uri;
                        workspacefolderName =
                            vscode.workspace.workspaceFolders[i].name;
                        break;
                    }
                }
            } else {
                workspacefolderUri = vscode.workspace.workspaceFolders[0].uri;
                workspacefolderName = vscode.workspace.workspaceFolders[0].name;
            }
            if (workspacefolderUri == undefined) {
                vscode.window.showErrorMessage('Something went wrong!');
                return;
            }
            //repository name
            let repoName = await vscode.window.showInputBox({
                placeHolder: 'Repository Name',
                value: workspacefolderName,
                title: 'Repository Name',
            });
            if (repoName == undefined) {
                return;
            }
            //github name
            let githubName = await vscode.window.showInputBox({
                placeHolder: 'Your GitHub Name',
                value: vscode.workspace
                    .getConfiguration('owngitextension')
                    .get('GitHubName'),
                title: 'GitHub Name',
            });
            if (githubName == undefined) {
                return;
            }
            //Fullname
            let fullName = await vscode.window.showInputBox({
                placeHolder: 'Your Full Name',
                value: vscode.workspace
                    .getConfiguration('owngitextension')
                    .get('FullName'),
                title: 'Full Name',
            });
            if (fullName == undefined) {
                return;
            }
            //license name
            let licenseName = '';
            await vscode.window
                .showQuickPick(
                    fs
                        .readdirSync(
                            path.join(workspacePath, 'LicenseTemplate')
                        )
                        .map((value, index, array) => {
                            return value.replace('.txt', '');
                        })
                )
                .then(
                    (value) => {
                        licenseName = value;
                    },
                    (reason) => {
                        vscode.window.showErrorMessage(
                            'Something went wrong:' + reason
                        );
                    }
                );
            if (licenseName == '' || licenseName == undefined) return;

            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            let gitignoreContent = 'node_modules/**\n';

            //add files
            for (let i in fileTemplatesJSON) {
                let template = fileTemplatesJSON[i];
                let fileContent = '';
                for (let j in template['text']) {
                    let line = template['text'][j].replace(
                        /\$\{GITHUBNAME\}/g,
                        githubName
                    );
                    line = line.replace(/\$\{FULLNAME\}/g, fullName);
                    line = line.replace(/\$\{REPONAME\}/g, repoName);
                    line = line.replace(/\$\{YEAR\}/g, year);
                    line = line.replace(/\$\{MONTH\}/g, month);
                    line = line.replace(/\$\{DAY\}/g, day);
                    fileContent += line + '\n';
                }

                if (template.hasOwnProperty('gitignore')) {
                    if (template['gitignore'])
                        gitignoreContent += template['name'] + '\n';
                }

                let fileUri = vscode.Uri.joinPath(
                    workspacefolderUri,
                    template['name']
                );

                await vscode.workspace.fs.writeFile(
                    fileUri,
                    new TextEncoder().encode(fileContent)
                );
                if (template.hasOwnProperty('open')) {
                    if (template['open'])
                        vscode.window.showTextDocument(fileUri, {
                            preview: false,
                        });
                }
            }

            //.gitignore
            let gitignoreUri = vscode.Uri.joinPath(
                workspacefolderUri,
                '.gitignore'
            );
            await vscode.workspace.fs.writeFile(
                gitignoreUri,
                new TextEncoder().encode(gitignoreContent)
            );

            //LICENSE
            let licenseUri = vscode.Uri.joinPath(workspacefolderUri, 'LICENSE');
            let licenseContent = readLicense(licenseName);

            licenseContent = licenseContent.replace(
                /\$\{GITHUBNAME\}/g,
                githubName
            );
            licenseContent = licenseContent.replace(
                /\$\{FULLNAME\}/g,
                fullName
            );
            licenseContent = licenseContent.replace(
                /\$\{REPONAME\}/g,
                repoName
            );
            licenseContent = licenseContent.replace(/\$\{YEAR\}/g, year);
            licenseContent = licenseContent.replace(/\$\{MONTH\}/g, month);
            licenseContent = licenseContent.replace(/\$\{DAY\}/g, day);
            await vscode.workspace.fs.writeFile(
                licenseUri,
                new TextEncoder().encode(licenseContent)
            );
        }
    );
    //add markdown overview
    vscode.commands.registerCommand(
        'owngitextension.addMarkdownOverview',
        async function () {
            if (!preConditionsMarkdown()) return;

            let repoName = undefined;
            let headings = [];
            for (
                let i = 0;
                i < vscode.window.activeTextEditor.document.lineCount;
                i++
            ) {
                let line =
                    vscode.window.activeTextEditor.document.lineAt(i).text;

                let includeFirstLine = vscode.workspace
                    .getConfiguration('owngitextension.Overview')
                    .get('IncludeFirstHeading');

                if (line.startsWith('#')) {
                    let level =
                        line.match(/#/g).length - (includeFirstLine ? 0 : 1);
                    line = line.replace(/#/g, '');
                    line = line.replace(/\*/g, '').replace(/\`/g, '');
                    if (line.includes('[') && line.includes(']')) {
                        line = line.split('[')[1].split(']')[0];
                    }
                    if (line.startsWith(' ')) line = line.replace(' ', '');
                    if (level == 0 && !includeFirstLine) {
                        repoName = line;
                        continue;
                    }
                    let header = {
                        name: line,
                        level: level,
                    };
                    headings.push(header);
                }
            }
            let overview = '';
            for (let i in headings) {
                let line = '';
                for (let j = 1; j < headings[i].level; j++) line += '  ';
                let trimmedName = headings[i].name
                    .toLowerCase()
                    .replace(/\./g, '')
                    .replace(/\s/g, '-')
                    .replace(/\&/g, '')
                    .replace(/\(/g, '')
                    .replace(/\)/g, '')
                    .replace(/\]/g, '')
                    .replace(/\[/g, '')
                    .replace(/\_/g, '')
                    .replace(/\>/g, '')
                    .replace(/\</g, '')
                    .replace(/\*/g, '')
                    .replace(/\$/g, '')
                    .replace(/\`/g, '')
                    .replace(/\"/g, '')
                    .replace(/\?/g, '')
                    .replace(/\!/g, '')
                    .replace(/\%/g, '')
                    .replace(/\=/g, '')
                    .replace(/\}/g, '')
                    .replace(/\{/g, '')
                    .replace(/\//g, '');
                line += '* [' + headings[i].name + '](#' + trimmedName + ')';
                overview += line + '\n';
            }

            //vscode.env.clipboard.writeText(overview);
            vscode.window.activeTextEditor.edit(function (editBuilder) {
                editBuilder.insert(
                    vscode.window.activeTextEditor.selection.active,
                    overview
                );
            });
        }
    );
    //Add new version
    vscode.commands.registerCommand(
        'owngitextension.addNewVersion',
        async function () {
            let newVersion = await vscode.window.showInputBox({
                placeHolder: 'x.x.x',
                title: 'New Version Label',
            });
            if (newVersion == undefined) {
                return;
            }
            //find changelog and readme
            let changelogUri = undefined;
            let readmeUri = undefined;
            await vscode.workspace.findFiles('**.md').then((uris) => {
                for (let i in uris) {
                    if (
                        uris[i].toString().toLowerCase().endsWith('readme.md')
                    ) {
                        readmeUri = uris[i];
                    }
                    if (
                        uris[i]
                            .toString()
                            .toLowerCase()
                            .endsWith('changelog.md')
                    ) {
                        changelogUri = uris[i];
                    }
                }
            });

            let githubName = vscode.workspace
                .getConfiguration('owngitextension')
                .get('GitHubName');
            if (githubName == '') githubName = 'GitHubName';
            //changelog
            if (changelogUri != undefined) {
                await (
                    await vscode.workspace.openTextDocument(changelogUri)
                ).save();
                let date = new Date();
                let newVersionContent =
                    '---\n\n## [v' +
                    newVersion +
                    '](https://github.com/' +
                    githubName +
                    '/RepoName/tree/' +
                    newVersion +
                    ') (' +
                    date.getFullYear() +
                    '-' +
                    (date.getMonth() + 1) +
                    '-' +
                    date.getDate() +
                    ')\n\n* \n\n';
                let oldChangelogcontent = fs
                    .readFileSync(changelogUri.fsPath, 'utf-8')
                    .split('\n');
                let newChangelogcontent = '';
                let alreadyIncluded = false;
                for (let i in oldChangelogcontent) {
                    if (oldChangelogcontent[i].includes(newVersion)) {
                        alreadyIncluded = true;
                        break;
                    }
                    newChangelogcontent += oldChangelogcontent[i];
                    if (i != oldChangelogcontent.length - 1) {
                        newChangelogcontent += '\n';
                    }
                    if (i == 1) {
                        newChangelogcontent += newVersionContent;
                    }
                }
                if (!alreadyIncluded)
                    fs.writeFileSync(changelogUri.fsPath, newChangelogcontent);
            }
            //readme
            if (readmeUri != undefined) {
                await (
                    await vscode.workspace.openTextDocument(readmeUri)
                ).save();
                let newVersionContent =
                    '\n### [v' +
                    newVersion +
                    '](https://github.com/' +
                    githubName +
                    '/RepoName/tree/' +
                    newVersion +
                    ')\n\n* \n';
                let oldReadmecontent = fs
                    .readFileSync(readmeUri.fsPath, 'utf-8')
                    .split('\n');
                let newReadmecontent = '';
                let alreadyIncluded = false;
                for (let i in oldReadmecontent) {
                    if (oldReadmecontent[i].includes(newVersion)) {
                        alreadyIncluded = true;
                        break;
                    }
                    newReadmecontent += oldReadmecontent[i];
                    if (i != oldReadmecontent.length - 1) {
                        newReadmecontent += '\n';
                    }
                    if (
                        oldReadmecontent[i]
                            .toLowerCase()
                            .replace(/\s/g, '')
                            .replace(/\[/g, '')
                            .includes('##releasenotes')
                    ) {
                        newReadmecontent += newVersionContent;
                    }
                }
                if (!alreadyIncluded)
                    fs.writeFileSync(readmeUri.fsPath, newReadmecontent);
            }

            //package.json
            let packageJsonUri = undefined;
            await vscode.workspace.findFiles('package.json').then((uris) => {
                if (uris.length == 1) packageJsonUri = uris[0];
            });

            if (
                packageJsonUri != undefined &&
                vscode.workspace
                    .getConfiguration('owngitextension.NewVersion')
                    .get('EditPackageFile')
            ) {
                await (
                    await vscode.workspace.openTextDocument(packageJsonUri)
                ).save();

                let oldPackageContent = fs
                    .readFileSync(packageJsonUri.fsPath, 'utf-8')
                    .split('\n');
                let newPackageContent = '';
                let depth = 0;
                for (let i in oldPackageContent) {
                    //only edit if the depth = 1
                    if (oldPackageContent[i].includes('{'))
                        depth += (oldPackageContent[i].match(/\{/g) || [])
                            .length;
                    if (oldPackageContent[i].includes('}'))
                        depth -= (oldPackageContent[i].match(/\}/g) || [])
                            .length;

                    //edit
                    if (
                        oldPackageContent[i].includes('"version":') &&
                        depth == 1
                    ) {
                        newPackageContent +=
                            '   "version": "' + newVersion + '",\n';
                    } else {
                        newPackageContent += oldPackageContent[i];
                        if (i != oldPackageContent.length - 1) {
                            newPackageContent += '\n';
                        }
                    }
                }

                fs.writeFileSync(packageJsonUri.fsPath, newPackageContent);
            }
            //package-lock.json
            let packageLockJsonUri = undefined;
            await vscode.workspace
                .findFiles('package-lock.json')
                .then((uris) => {
                    if (uris.length == 1) packageLockJsonUri = uris[0];
                });

            if (
                packageLockJsonUri != undefined &&
                vscode.workspace
                    .getConfiguration('owngitextension.NewVersion')
                    .get('EditPackageLockFile')
            ) {
                await (
                    await vscode.workspace.openTextDocument(packageLockJsonUri)
                ).save();
                let oldPackageLockContent = fs
                    .readFileSync(packageLockJsonUri.fsPath, 'utf-8')
                    .split('\n');
                let newPackageLockContent = '';
                let depth = 0;
                for (let i in oldPackageLockContent) {
                    //only edit if the depth = 1
                    if (oldPackageLockContent[i].includes('{'))
                        depth += (oldPackageLockContent[i].match(/\{/g) || [])
                            .length;
                    if (oldPackageLockContent[i].includes('}'))
                        depth -= (oldPackageLockContent[i].match(/\}/g) || [])
                            .length;

                    if (
                        oldPackageLockContent[i].includes('"version":') &&
                        depth == 1
                    ) {
                        newPackageLockContent +=
                            '   "version": "' + newVersion + '",\n';
                    } else {
                        newPackageLockContent +=
                            oldPackageLockContent[i] + '\n';
                    }
                }

                fs.writeFileSync(
                    packageLockJsonUri.fsPath,
                    newPackageLockContent
                );
            }
        }
    );
    //open file templates
    vscode.commands.registerCommand(
        'owngitextension.openFileTemplates',
        function () {
            vscode.workspace
                .openTextDocument(vscode.Uri.file(fileTemplatesFile))
                .then((a) => {
                    vscode.window.showTextDocument(a, 1, false);
                });
            vscode.window.showWarningMessage('Reload window after editing!');
        }
    );
    //add license template
    vscode.commands.registerCommand(
        'owngitextension.addLicenseTemplate',
        async function () {
            //license name
            let licenseName = await vscode.window.showInputBox({
                placeHolder: 'License Name',
                title: 'License Name',
            });
            if (licenseName == undefined) {
                return;
            }
            let header =
                '/$/ ' +
                licenseName +
                ' License Template\n/$/ /$/ marks a comment line and will not appear in your licen\n/$/ Use ${GITHUBNAME} for your github na\n/$/ Use ${FULLNAME} for your full na\n/$/ Use ${REPONAME} for the name of the reposito\n/$/ Use ${Year} for the current ye\n/$/ Use ${MONTH} for the current mon\n/$/ Use ${DAY} for the current day\n/$/\n';
            fs.writeFileSync(
                path.join(
                    workspacePath,
                    'LicenseTemplate',
                    licenseName + '.txt'
                ),
                header
            );
            vscode.workspace
                .openTextDocument(
                    vscode.Uri.file(
                        path.join(
                            workspacePath,
                            'LicenseTemplate',
                            licenseName + '.txt'
                        )
                    )
                )
                .then((a) => {
                    vscode.window.showTextDocument(a, 1, false);
                });
        }
    );
    //edit license template
    vscode.commands.registerCommand(
        'owngitextension.editLicenseTemplate',
        async function () {
            //license name
            let licenseName = '';
            await vscode.window
                .showQuickPick(
                    fs
                        .readdirSync(
                            path.join(workspacePath, 'LicenseTemplate')
                        )
                        .map((value, index, array) => {
                            return value.replace('.txt', '');
                        })
                )
                .then(
                    (value) => {
                        licenseName = value;
                    },
                    (reason) => {
                        vscode.window.showErrorMessage(
                            'Something went wrong:' + reason
                        );
                    }
                );
            if (licenseName == '' || licenseName == undefined) return;

            vscode.workspace
                .openTextDocument(
                    vscode.Uri.file(
                        path.join(
                            workspacePath,
                            'LicenseTemplate',
                            licenseName + '.txt'
                        )
                    )
                )
                .then((a) => {
                    vscode.window.showTextDocument(a, 1, false);
                });
        }
    );
    //link to file
    vscode.commands.registerCommand(
        'owngitextension.linkToFile',
        async function () {
            if (vscode.window.activeTextEditor == undefined) return;

            //get file path
            let uris = undefined;
            await vscode.workspace.findFiles('').then((x) => {
                uris = x.map((value) => {
                    return value.fsPath;
                });
            });
            //choose file path
            let filePath = undefined;
            await vscode.window.showQuickPick(uris).then((value) => {
                filePath = value;
            });
            if (filePath == '' || filePath == undefined) return;

            //make reltive to current file
            filePath = path.relative(
                vscode.window.activeTextEditor.document.uri.fsPath,
                filePath
            );
            filePath = filePath.replace('..\\', '');

            //name
            let name = '';
            let placeholder = filePath.split('.')[0];
            placeholder =
                placeholder.split('\\')[placeholder.split('\\').length - 1];
            await vscode.window
                .showInputBox({ title: 'Title', placeHolder: placeholder })
                .then((value) => {
                    name = value;
                });
            if (name == undefined) return;
            if (name == '') name = placeholder;

            //check if is image
            let imageEndings = [
                'gif',
                'jpg',
                'jpeg',
                'png',
                'svg',
                'webp',
                'ico',
            ];
            let isImage = false;
            if (imageEndings.includes(filePath.split('.').at(-1).toLowerCase()))
                isImage = true;

            //markdown or html style
            let isMarkdown = true;
            await vscode.window
                .showQuickPick(['Markdown Style', 'HTML Style'])
                .then((value) => {
                    if (value == 'HTML Style') isMarkdown = false;
                });
            // replace \ with /
            filePath = filePath.replace(/\\/g, '/');
            //make content
            let content = '';
            if (isMarkdown) {
                content = '[' + name + '](' + filePath + ')';
                if (isImage) content = '!' + content;
            } else {
                if (isImage) {
                    content =
                        '<img src = "' +
                        filePath +
                        '" title = "' +
                        name +
                        '"/>';
                } else {
                    content = '<a href = "' + filePath + '">' + name + '</a>';
                }
            }

            //write to file
            vscode.window.activeTextEditor.edit(function (editBuilder) {
                editBuilder.insert(
                    vscode.window.activeTextEditor.selection.active,
                    content
                );
            });
        }
    );

    context.subscriptions.push(disposable);
}

// FUNCTIONS -----------------------------------------------------------------------------------------------------

// This method is called when your extension is deactivated
function deactivate() {}

function createWorkspace() {
    //make workspace
    fs.mkdir(workspacePath, (err) => {
        if (err) throw err;
    });
    //make file templates
    fs.writeFileSync(
        path.join(workspacePath, 'FileTemplates.json'),
        fs.readFileSync(path.join(__dirname, 'FileTemplates.json')).toString()
    );
    //make license templates
    fs.mkdir(path.join(workspacePath, 'LicenseTemplate'), (err) => {
        if (err) throw err;
    });
    //apache2.0
    fs.writeFileSync(
        path.join(workspacePath, 'LicenseTemplate', 'Apache2.0.txt'),
        fs
            .readFileSync(
                path.join(__dirname, 'LicenseTemplate', 'Apache2.0.txt')
            )
            .toString()
    );
    //GPL3
    fs.writeFileSync(
        path.join(workspacePath, 'LicenseTemplate', 'GPL3.txt'),
        fs
            .readFileSync(path.join(__dirname, 'LicenseTemplate', 'GPL3.txt'))
            .toString()
    );
    //ISC
    fs.writeFileSync(
        path.join(workspacePath, 'LicenseTemplate', 'ISC.txt'),
        fs
            .readFileSync(path.join(__dirname, 'LicenseTemplate', 'ISC.txt'))
            .toString()
    );
    //MIT
    fs.writeFileSync(
        path.join(workspacePath, 'LicenseTemplate', 'MIT.txt'),
        fs
            .readFileSync(path.join(__dirname, 'LicenseTemplate', 'MIT.txt'))
            .toString()
    );
}

function readLicense(licenseName) {
    let textArr = fs
        .readFileSync(
            path.join(workspacePath, 'LicenseTemplate', licenseName + '.txt'),
            'utf-8'
        )
        .split('\n');
    let text = '';
    for (let i in textArr) {
        if (textArr[i].startsWith('/$/')) continue;
        text += textArr[i] + '\n';
    }
    return text;
}

function preConditionsMarkdown() {
    // Check if there is an active TexteEditor
    if (vscode.window.activeTextEditor == undefined) {
        vscode.window.showErrorMessage('Please open an Markdown file first!');
        return false;
    }

    // Check if TextEditor is ObjectScript
    if (!vscode.window.activeTextEditor.document.fileName.endsWith('.md')) {
        vscode.window.showErrorMessage('Only works with Markdown files!');
        return false;
    }
    return true;
}

module.exports = {
    activate,
    deactivate,
};
