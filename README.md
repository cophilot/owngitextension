<img src="https://github.com/phil1436/owngitextension/raw/main/resources/logo.png" width="25%"/>

# OwnGitExtension

A Visual Studio Code Extension that offers tools for working with GitHub projects.

---

-  [Features](#features)
   -  [Create GitHub Repository Files](#create-github-repository-files)
   -  [Add Markdown Overview](#add-markdown-overview)
   -  [Add New Version](#add-new-version)
   -  [Link To File](#link-to-file)
-  [Installation](#installation)
-  [Workspace](#workspace)
-  [Commands](#commands)
   -  [Own Git Repository](#own-git-repository)
   -  [Own Git Markdown](#own-git-markdown)
   -  [Own Git License](#own-git-license)
-  [Configuration](#configuration)
-  [File Templates](#file-templates)
-  [Bugs](#bugs)
-  [Release Notes](#release-notes)

---

## Features

### `Create GitHub Repository Files`

Will create files based on the templates in _[FileTemplates.json](FileTemplates.json)_ file as well as a _LICENSE_ and a _.gitignore_ file. Default Files are: _README.md_, _CHANGELOG.md_ and _ideas.txt_.

![CreateGitHubRepoDemo](https://github.com/phil1436/owngitextension/raw/main/resources/CreateGitHubRepoDemo.gif)

### `Add Markdown Overview`

Adds a Overview to your markdown file, at the current position of your cursor.

![AddMarkdownOverviewDemo](https://github.com/phil1436/owngitextension/raw/main/resources/AddMarkdownOverviewDemo.gif)

### `Add New Version`

Adds a new Version to your repository.

![AddNewVersionDemo](https://github.com/phil1436/owngitextension/raw/main/resources/AddNewVersionDemo.gif)

### `Link To File`

Adds a link to a file, in Markdown or HTML style, to the position of the cursor.

![LinkToFileDemo](https://github.com/phil1436/owngitextension/raw/main/resources/LinkToFileDemo.gif)

---

## Installation

-  Clone this repository (recommended under `~/.vscode/extensions`):

```shell
git clone https://github.com/phil1436/owngitextension C:\Users\<your-user>\.vscode\extensions\owngitextension
```

or download the [latest realease](https://github.com/phil1436/owngitextension/releases/latest) and extract the file into `~/.vscode/extensions`.

-  If the extension did not got installed, run the command `Developer: Install Extension from Location...` and choose the extension folder.

---

## Workspace

This extension will create a directory named _owngitextension-workspace_ in the same directory as the extension. The workspace contains all template files, so your changes in those files will not be lost when installing a new version.

---

## Commands

### Own Git Repository

-  `Create GitHub Repository Files`: Creates standard files for a new GitHub repository.
-  `Edit File Templates`: Opens the _FileTemplates.json_ file.
-  `Add New Version`: Adds a new Version to your current repository.

### Own Git Markdown

-  `Add Markdown Overview`: Adds a Overview to your markdown file.
-  `Link To File`: Adds a link to a file, in Markdown or HTML style, to the position of the cursor.

### Own Git License

-  `Add License Template`: Add a Custom license template.
-  `Edit License Template`: Edit a existing license template.

---

## Configuration

Go to `File > Preferences > Settings` and than navigate to `Extensions > OwnGitExtension`.

-  `GitHubName`: Your GitHub name.
-  `FullName`: Your full name.

### New Version

-  `Edit Package File`: If enabled adds a new Version to the _package.json_ file
-  `Edit Package Lock File`: If enabled adds a new Version to the _package-lock.json_ file

---

## File Templates

You can configure the File Templates in the _[FileTemplates.json](FileTemplates.json)_ file. Open it with `Edit File Templates`. This files will be created with `Create GitHub Repository Files` Command.
Add a new file template in the `File Templates` array as JSON object:

-  `name`: The name of the file with the file ending.
-  `text`: An array of strings with the text in the file. You can use placeholders (view `__comment`).
-  `gitignore`(optional): If set to `true` will add the file to the _.gitignore_ file (default is `false`).
-  `open`(optional): If set to `true` eill open the file after it was created (default is `false`).

Example:

```json
"File Templates":[
  {
    "name":"path/to/myFile.md",
    "gitignore":true,
    "open":true,
    "text":[
      "This is Line 1",
      "This is Line 2",
      "This is Line 3"
    ]
  },
  ...
]
```

---

## Bugs

-  _no known bugs_

---

## [Release Notes](https://github.com/phil1436/owngitextension/blob/master/CHANGELOG.md)

### [v0.0.6](https://github.com/phil1436/RepoName/tree/0.0.6)

-  Bug fixes

### [v0.0.5](https://github.com/phil1436/owngitextension/tree/0.0.5)

-  _.gitattributes_ added
-  Categories added
-  _workspace_ added

### [v0.0.4](https://github.com/phil1436/owngitextension/tree/0.0.4)

-  Command added
-  Command renamed
-  Commands extended

### [v0.0.3](https://github.com/phil1436/owngitextension/tree/0.0.3)

-  Bug fixes
-  License Template added
-  Commands added

### [v0.0.2](https://github.com/phil1436/owngitextension/tree/0.0.2)

-  Bug fixes
-  Insert Configurations
-  Commands added
-  Commands removed

### [v0.0.1](https://github.com/phil1436/owngitextension/tree/0.0.1)

-  _Initial release_

---

by Philipp B.
