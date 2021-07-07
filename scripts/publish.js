#!/usr/bin/env node

// Copyright (c) WarnerMedia Direct, LLC. All rights reserved. Licensed under the MIT license.
// See the LICENSE file for license information.

const { execSync } = require('child_process');
const fs = require('fs');

function verifyCleanWorkspace() {
    const output = execSync(`git status --porcelain`, { encoding: 'utf8' });
    if (output != '') {
        console.log('ERROR: Working copy should not contain any uncommitted or untracked files.');
        process.exit(2);
    }
}

function verifyNotYetPublished(fullVersion) {
    try {
        execSync(`git show-ref --quiet --verify refs/remotes/origin/${fullVersion}`, { encoding: 'utf8' });
        console.log(`Version ${fullVersion} already published, nothing to do.`);
        process.exit(3);
    } catch { }
}

function createVersionBranch(fullVersion) {
    execSync(`git checkout -b ${fullVersion}`, { stdio: 'inherit' });
}

function editGitIgnoreFile() {
    let lines = fs.readFileSync('.gitignore', 'utf8').split(/\r?\n/);
    lines = lines.map(line => line.replace(/^dist$/, '# dist'));
    fs.writeFileSync('.gitignore', lines.join('\n'));
}

function buildAction() {
    execSync(`npm run build`, { stdio: 'inherit' });
}

function pushFullVersionBranch(fullVersion) {
    execSync(`git add .gitignore`, { stdio: 'inherit' });
    execSync(`git add dist`, { stdio: 'inherit' });
    execSync(`git commit -m ":bookmark: ${fullVersion}"`, { stdio: 'inherit' });
    execSync(`git push -u origin HEAD`, { stdio: 'inherit' });
}

function pushMajorVersionBranch(majorVersion) {
    try {
        execSync(`git branch -D ${majorVersion}`, { stdio: 'inherit' });
    } catch { }

    execSync(`git checkout -b ${majorVersion}`, { stdio: 'inherit' });
    execSync(`git push -f -u origin HEAD`, { stdio: 'inherit' });
}

function publish() {
    const fullVersion = 'v' + JSON.parse(fs.readFileSync('package.json')).version;
    const majorVersion = fullVersion.split('.')[0];

    verifyCleanWorkspace();

    console.log(`#### Checking if ${fullVersion} already exists...`);
    verifyNotYetPublished(fullVersion);

    console.log(`#### Creating version branch for ${fullVersion}...`);
    createVersionBranch(fullVersion);

    console.log('#### Updating the .gitignore file...');
    editGitIgnoreFile();

    console.log('#### Building action...');
    buildAction();

    console.log(`#### Pushing branch ${fullVersion}...`);
    pushFullVersionBranch(fullVersion);

    console.log(`#### Updating branch ${majorVersion}...`);
    pushMajorVersionBranch(majorVersion);

    console.log('#### Done.');
}

publish();
