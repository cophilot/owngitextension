<img src="https://github.com/phil1436/owngitextension/raw/main/resources/logo.png" width="25%"/>

# OwnGitExtension

Provides tools for creating and changing GitHub repositories.

---

* [Features](https://github.com/phil1436/OwnGitExtension#features)
  * [Create GitHub Repository Files](https://github.com/phil1436/OwnGitExtension#create-github-repository-files)
  * [Add Readme Overview](https://github.com/phil1436/OwnGitExtension#add-readme-overview)
  * [Add New Version](https://github.com/phil1436/OwnGitExtension#add-new-version)
* [Installation](https://github.com/phil1436/OwnGitExtension#installation)
* [Commands](https://github.com/phil1436/OwnGitExtension#commands)
* [Options](https://github.com/phil1436/OwnGitExtension#options)
* [Bugs](https://github.com/phil1436/OwnGitExtension#bugs)
* [Release Notes](https://github.com/phil1436/OwnGitExtension#release-notes)

---

## Features

### `Create GitHub Repository Files`

Will create a *README*, *CHANGELOG*, *.gitignore* and *LICENSE* file to your current folder.

![CreateGitHubRepoDemo](https://github.com/phil1436/owngitextension/raw/main/resources/CreateGitHubRepoDemo.gif)

> Tip: You can change the *README* and *CHANGELOG* templates in the *options.json* file.

### `Add Readme Overview`

![AddReadmeOverviewDemo](https://github.com/phil1436/owngitextension/raw/main/resources/AddReadmeOverviewDemo.gif)

Adds a Overview to your *README* file, at the current position of your cursor.

### `Add New Version`

![AddNewVersionDemo](https://github.com/phil1436/owngitextension/raw/main/resources/AddNewVersionDemo.gif)

Adds a new Version to your repository.

---

## Installation

Clone this repository (recommended under `~/.vscode/extensions`)

````shell
git clone https://github.com/phil1436/owngitextension C:\Users\<your-user>\.vscode\extensions\owngitextension
````

Then run the command `Developer: Install Extension from Location...` and choose the cloned repository.

---

## Commands

* `Create GitHub Repository Files`: Creates standard files for a new GitHub repository.
* `Add Readme Overview`: Adds a Overview to your *README* file.
* `Add New Version`: Adds a new Version to your current repository.
* `Open Options File`: Opens the *options.json* file.

---

## Options

Open the *options.json* file via `Own ObjectScript Options: Open Options File`

* *GitHubName*: Your GitHub name.
* *FullName*: Your full name.
* *README Template*: A Template for the *README* file.
* *CHANGELOG Template*: A Template for the *CHANGELOG* file.

---

## Bugs

* *no known bugs*

---

## [Release Notes](https://github.com/phil1436/owngitextension/blob/master/CHANGELOG.md)

### [v0.0.1](https://github.com/phil1436/owngitextension/tree/0.0.1)

* *Initial release*

---

by Philipp B.
