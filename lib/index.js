// Copyright (c) WarnerMedia Direct, LLC. All rights reserved. Licensed under the MIT license.
// See the LICENSE file for license information.

const core = require('@actions/core');
const github = require('@actions/github');

async function main() {
    const request = {
        owner: core.getInput('owner', { required: true }),
        repo: core.getInput('repo', { required: true }),
        pull_number: core.getInput('pull-number', { required: true })
    };
    const token = core.getInput('repo-token', { required: true });

    core.info(`Getting PR #${request.pull_number} from ${request.owner}/${request.repo}`);

    const octokit = github.getOctokit(token);
    const { data } = await octokit.pulls.get(request);
    core.setOutput('base-ref',   data.base.ref);
    core.setOutput('base-sha',   data.base.sha);
    core.setOutput('base-owner', data.base.repo.owner.login);
    core.setOutput('base-repo',  data.base.repo.name);
    core.setOutput('head-ref',   data.head.ref);
    core.setOutput('head-sha',   data.head.sha);
    core.setOutput('head-owner', data.head.repo.owner.login);
    core.setOutput('head-repo',  data.head.repo.name);
}

module.exports = { main };

/* istanbul ignore if */
if (require.main === module) {
    // If this file is the entry point for node, run main() immediately.
    // Unexpected errors are passed back to GitHub as failures.
    main().catch(error => core.setFailed(error));
}
