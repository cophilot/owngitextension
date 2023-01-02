const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

/* const optionsFile = path.join(__dirname, 'options.json');
let optionsJSON = JSON.parse(fs.readFileSync(optionsFile).toString()); */

const fileTemplatesFile = path.join(__dirname, 'FileTemplates.json');
let fileTemplatesJSON = JSON.parse(
   fs.readFileSync(fileTemplatesFile).toString()
);

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
   // create git Repo
   let disposable = vscode.commands.registerCommand(
      'owngitextension.createGitRepo',
      async function () {
         if (vscode.workspace.workspaceFolders.length == 0) {
            vscode.window.showErrorMessage('Open a folder first!');
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
                  workspacefolderUri = vscode.workspace.workspaceFolders[i].uri;
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
         await vscode.window.showQuickPick(['MIT', 'Apache2.0', 'ISC']).then(
            (value) => {
               licenseName = value;
            },
            (reason) => {
               vscode.window.showErrorMessage('Something went wrong:' + reason);
            }
         );
         //README
         let date = new Date();
         let year = date.getFullYear();
         let month = date.getMonth() + 1;
         let day = date.getDate();

         let readmecontent = '';
         for (let i in fileTemplatesJSON['README Template']) {
            let line = fileTemplatesJSON['README Template'][i].replace(
               /\$\{GITHUBNAME\}/g,
               githubName
            );
            line = line.replace(/\$\{FULLNAME\}/g, fullName);
            line = line.replace(/\$\{REPONAME\}/g, repoName);
            line = line.replace(/\$\{YEAR\}/g, year);
            line = line.replace(/\$\{MONTH\}/g, month);
            line = line.replace(/\$\{DAY\}/g, day);
            readmecontent += line + '\n';
         }
         let readmeUri = vscode.Uri.joinPath(workspacefolderUri, 'README.md');

         await vscode.workspace.fs.writeFile(
            readmeUri,
            new TextEncoder().encode(readmecontent)
         );
         vscode.window.showTextDocument(readmeUri, { preview: false });

         //CHANGELOG
         let changelogcontent = '';
         for (let i in fileTemplatesJSON['CHANGELOG Template']) {
            let line = fileTemplatesJSON['CHANGELOG Template'][i].replace(
               /\$\{GITHUBNAME\}/g,
               githubName
            );
            line = line.replace(/\$\{FULLNAME\}/g, fullName);
            line = line.replace(/\$\{REPONAME\}/g, repoName);
            line = line.replace(/\$\{YEAR\}/g, year);
            line = line.replace(/\$\{MONTH\}/g, month);
            line = line.replace(/\$\{DAY\}/g, day);
            changelogcontent += line + '\n';
         }
         let changelogUri = vscode.Uri.joinPath(
            workspacefolderUri,
            'CHANGELOG.md'
         );
         await vscode.workspace.fs.writeFile(
            changelogUri,
            new TextEncoder().encode(changelogcontent)
         );
         vscode.window.showTextDocument(changelogUri, { preview: false });

         //ideas.txt
         let ideasUri = vscode.Uri.joinPath(workspacefolderUri, 'ideas.txt');
         await vscode.workspace.fs.writeFile(
            ideasUri,
            new TextEncoder().encode('')
         );
         vscode.window.showTextDocument(ideasUri, { preview: false });

         //.gitignore
         let gitignoreUri = vscode.Uri.joinPath(
            workspacefolderUri,
            '.gitignore'
         );
         await vscode.workspace.fs.writeFile(
            gitignoreUri,
            new TextEncoder().encode('ideas.txt\nnode_modules/**\n')
         );
         vscode.window.showTextDocument(gitignoreUri, { preview: false });

         //LICENSE
         let licenseUri = vscode.Uri.joinPath(workspacefolderUri, 'LICENSE');
         let licenseContent = '';
         switch (licenseName.toLowerCase()) {
            case 'mit':
               licenseContent = readLicense('MIT');
               break;
            case 'apache2.0':
               licenseContent = readLicense('Apache2.0');
               break;
            case 'isc':
               licenseContent = readLicense('ISC');
               break;
            default:
               break;
         }
         licenseContent =
            licenseContent
               .replace(/\$\{FULLNAME\}/g, fullName)
               .replace(/\$\{YEAR\}/g, year) + '\n';
         await vscode.workspace.fs.writeFile(
            licenseUri,
            new TextEncoder().encode(licenseContent)
         );

         vscode.window.showTextDocument(licenseUri, { preview: false });
      }
   );
   //add readme overview
   vscode.commands.registerCommand(
      'owngitextension.addReadmeOverview',
      async function () {
         if (!preConditionsMarkdown()) return;
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
         let repoName = undefined;
         let headings = [];
         for (
            let i = 0;
            i < vscode.window.activeTextEditor.document.lineCount;
            i++
         ) {
            let line = vscode.window.activeTextEditor.document.lineAt(i).text;

            if (line.startsWith('#')) {
               let level = line.match(/#/g).length - 1;
               line = line.replace(/#/g, '');
               line = line.replace(/\*/g, '').replace(/\`/g, '');
               if (line.includes('[') && line.includes(']')) {
                  line = line.split('[')[1].split(']')[0];
               }
               if (line.startsWith(' ')) line = line.replace(' ', '');
               if (level == 0) {
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
               .replace(/\s/g, '-');
            line +=
               '* [' +
               headings[i].name +
               '](https://github.com/' +
               githubName +
               '/' +
               repoName +
               '#' +
               trimmedName +
               ')';
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
               if (uris[i].toString().toLowerCase().endsWith('readme.md')) {
                  readmeUri = uris[i];
               }
               if (uris[i].toString().toLowerCase().endsWith('changelog.md')) {
                  changelogUri = uris[i];
               }
            }
         });

         //changelog
         if (changelogUri != undefined) {
            await (
               await vscode.workspace.openTextDocument(changelogUri)
            ).save();
            let date = new Date();
            let newVersionContent =
               '---\n\n## [v' +
               newVersion +
               '](https://github.com/GitHubName/RepoName/tree/' +
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
            for (let i in oldChangelogcontent) {
               newChangelogcontent += oldChangelogcontent[i];
               if (i != oldChangelogcontent.length - 1) {
                  newChangelogcontent += '\n';
               }
               if (i == 1) {
                  newChangelogcontent += newVersionContent;
               }
            }
            fs.writeFileSync(changelogUri.fsPath, newChangelogcontent);
         }
         //readme
         if (readmeUri != undefined) {
            await (await vscode.workspace.openTextDocument(readmeUri)).save();
            let newVersionContent =
               '\n### [v' +
               newVersion +
               '](https://github.com/GitHubName/RepoName/tree/' +
               newVersion +
               ')\n\n* \n';
            let oldReadmecontent = fs
               .readFileSync(readmeUri.fsPath, 'utf-8')
               .split('\n');
            let newReadmecontent = '';
            for (let i in oldReadmecontent) {
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
                  depth += (oldPackageContent[i].match(/\{/g) || []).length;
               if (oldPackageContent[i].includes('}'))
                  depth -= (oldPackageContent[i].match(/\}/g) || []).length;

               //edit
               if (oldPackageContent[i].includes('"version":') && depth == 1) {
                  newPackageContent += '   "version": "' + newVersion + '",\n';
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
         await vscode.workspace.findFiles('package-lock.json').then((uris) => {
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
                  depth += (oldPackageLockContent[i].match(/\{/g) || []).length;
               if (oldPackageLockContent[i].includes('}'))
                  depth -= (oldPackageLockContent[i].match(/\}/g) || []).length;

               if (
                  oldPackageLockContent[i].includes('"version":') &&
                  depth == 1
               ) {
                  newPackageLockContent +=
                     '   "version": "' + newVersion + '",\n';
               } else {
                  newPackageLockContent += oldPackageLockContent[i] + '\n';
               }
            }

            fs.writeFileSync(packageLockJsonUri.fsPath, newPackageLockContent);
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

   context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

function readLicense(licenseName) {
   return fs.readFileSync(
      path.join(__dirname, 'LicenseTemplate', licenseName + '.txt'),
      'utf-8'
   );
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
