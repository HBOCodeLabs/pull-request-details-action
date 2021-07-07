#!/usr/bin/env node

// Copyright (c) WarnerMedia Direct, LLC. All rights reserved. Licensed under the MIT license.
// See the LICENSE file for license information.

const { execSync } = require('child_process');
const fs = require('fs');

function verifyNotYetPublished(fullVersion) {
    try {
        execSync(`git show-ref --quiet --verify refs/remotes/origin/${fullVersion}`, { encoding: 'utf8' });
        console.log(`Version ${fullVersion} already published, nothing to do.`);
        process.exit(2);
    } catch { }
}

function createVersionBranch(fullVersion) {
    execSync(`git checkout -b ${fullVersion}`, { stdio: 'inherit' });
}

function editGitIgnoreFile() {
    console.log('Updating the .gitignore file...');

    const lines = fs.readFileSync('.gitignore').split(/\r?\n/);
    lines = lines.map(line => line.replace(/^dist$/, '# dist');
    fs.writeFileSync('.gitignore', lines.join('\n'));
}

function buildAction() {
    console.log('Building action...');

    execSync(`npm run build`, { stdio: 'inherit' });
}

function pushFullVersionBranch(fullVersion) {
    console.log(`Pushing branch ${fullVersion}...`);

    execSync(`git add .gitignore`, { stdio: 'inherit' });
    execSync(`git add dist`, { stdio: 'inherit' });
    execSync(`git commit -m ":bookmark: ${fullVersion}"`, { stdio: 'inherit' });
    execSync(`git push -u origin HEAD`, { stdio: 'inherit' });
}

function getLatestCommit() {
    return execSync(`git show-ref --hash HEAD`, { encoding: 'utf8' }).stdout.split(/\r?\n/)[0];
}

function pushMajorVersionBranch(majorVersion, commit) {
    console.log(`Pushing branch ${majorVersion}...`);

    try {
        execSync(`git checkout ${majorVersion}`, { stdio: 'inherit' });
    } catch {
        execSync(`git checkout -b ${majorVersion}`, { stdio: 'inherit' });
    }

    execSync(`git reset --hard ${commit}`, { stdio: 'inherit' });
    execSync(`git push -f`, { stdio: 'inherit' });
}

function publish() {
    const fullVersion = 'v' + JSON.parse(fs.readFileSync('package.json')).version;
    const majorVersion = fullVersion.split('.')[0];

    verifyNotYetPublished(fullVersion);

    createVersionBranch(fullVersion);

    editGitIgnoreFile();

    buildAction();

    pushFullVersionBranch(fullVersion);

    const commit = getLatestCommit();
    pushMajorVersionBranch(majorVersion, commit);
}

publish();
