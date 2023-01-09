<img src="https://github.com/phil1436/owngitextension/raw/main/resources/logo.png" width="25%"/>

# OwnGitExtension

Provides tools for creating and changing GitHub repositories.

---

* [Features](https://github.com/phil1436/owngitextension#features)
  * [Create GitHub Repository Files](https://github.com/phil1436/owngitextension#create-github-repository-files)
  * [Add Readme Overview](https://github.com/phil1436/owngitextension#add-readme-overview)
  * [Add New Version](https://github.com/phil1436/owngitextension#add-new-version)
* [Installation](https://github.com/phil1436/owngitextension#installation)
* [Commands](https://github.com/phil1436/owngitextension#commands)
* [Configuration](https://github.com/phil1436/owngitextension#configuration)
  * [New Version](https://github.com/phil1436/owngitextension#new-version)
* [Bugs](https://github.com/phil1436/owngitextension#bugs)
* [Release Notes](https://github.com/phil1436/owngitextension#release-notes)

---

## Features

### `Create GitHub Repository Files`

Will create a *README*, *CHANGELOG*, *.gitignore* and *LICENSE* file to your current folder.

![CreateGitHubRepoDemo](https://github.com/phil1436/owngitextension/raw/main/resources/CreateGitHubRepoDemo.gif)

> Tip: You can change the *README* and *CHANGELOG* templates in the *FileTemplates.json* file.

### `Add Readme Overview`

![AddReadmeOverviewDemo](https://github.com/phil1436/owngitextension/raw/main/resources/AddReadmeOverviewDemo.gif)

Adds a Overview to your *README* file, at the current position of your cursor.

### `Add New Version`

![AddNewVersionDemo](https://github.com/phil1436/owngitextension/raw/main/resources/AddNewVersionDemo.gif)

Adds a new Version to your repository.

---

## Installation

* Clone this repository (recommended under `~/.vscode/extensions`):

````shell
git clone https://github.com/phil1436/owngitextension C:\Users\<your-user>\.vscode\extensions\owngitextension
````

or download the [latest realease](https://github.com/phil1436/owngitextension/releases/latest) and extract the file into `~/.vscode/extensions`.

* If the extension did not got installed, run the command `Developer: Install Extension from Location...` and choose the extension folder.

---

## Commands

* `Create GitHub Repository Files`: Creates standard files for a new GitHub repository.
* `Add Readme Overview`: Adds a Overview to your *README* file.
* `Add New Version`: Adds a new Version to your current repository.
* `Edit File Templates`: Opens the *FileTemplates.json* file.
* `Add License Template`: Add a Custom license template.
* `Edit License Template`: Edit a existing license template.

---

## Configuration

Go to `File > Preferences > Settings` and than navigate to `Extensions > OwnGitExtension`.

* `GitHubName`: Your GitHub name.
* `FullName`: Your full name.

### New Version

* `Edit Package File`: If enabled adds a new Version to the *package.json* file
* `Edit Package Lock File`: If enabled adds a new Version to the *package-lock.json* file

---

## Bugs

* *no known bugs*

---

## [Release Notes](https://github.com/phil1436/owngitextension/blob/master/CHANGELOG.md)

### [v0.0.3](https://github.com/phil1436/owngitextension/tree/0.0.3)

* Bug fixes
* License Template added
* Commands added

### [v0.0.2](https://github.com/phil1436/owngitextension/tree/0.0.2)

* Bug fixes
* Insert Configurations
* Commands added
* Commands removed

### [v0.0.1](https://github.com/phil1436/owngitextension/tree/0.0.1)

* *Initial release*

---

by Philipp B.
