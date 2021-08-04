// Copyright (c) WarnerMedia Direct, LLC. All rights reserved. Licensed under the MIT license.
// See the LICENSE file for license information.

const core = require('@actions/core');
const github = require('@actions/github');
const { main } = require('.');

describe('main', () => {
    let mockOctokit = {};
    let examplePullRequest = {};
    let $processEnv = {};

    beforeEach(() => {
        $processEnv = { ...process.env };

        examplePullRequest = {
            base: {
                ref: 'main',
                sha: 'aaaaaa',
                repo: {
                    owner: {
                        login: 'AcmeCorp'
                    },
                    name: 'RocketSled'
                }
            },
            head: {
                ref: 'dev/branch-b',
                sha: 'bbbbbb',
                repo: {
                    owner: {
                        login: 'AcmeCorp'
                    },
                    name: 'RocketSled'
                }
            }
        };

        mockOctokit = {
            pulls: {
                get: jest.fn().mockReturnValue({
                    data: examplePullRequest
                })
            }
        };

        jest.spyOn(core, 'setOutput').mockReturnValue();
        jest.spyOn(github, 'getOctokit').mockReturnValue(mockOctokit);
    });

    afterEach(() => {
        process.env = $processEnv;
    });

    it('retrieves PR data using octokit and sets expected outputs', async () => {
        process.env['INPUT_OWNER'] = 'AcmeCorp';
        process.env['INPUT_REPO'] = 'RocketSled';
        process.env['INPUT_PULL-NUMBER'] = '37';
        process.env['INPUT_REPO-TOKEN'] = 'cafe43';

        await main();

        expect(github.getOctokit).toHaveBeenCalledWith('cafe43');
        expect(mockOctokit.pulls.get).toHaveBeenCalledWith({
            'owner': 'AcmeCorp',
            'repo': 'RocketSled',
            'pull_number': '37'
        });

        expect(core.setOutput).toHaveBeenCalledWith('base-ref', 'main');
        expect(core.setOutput).toHaveBeenCalledWith('base-sha', 'aaaaaa');
        expect(core.setOutput).toHaveBeenCalledWith('base-owner', 'AcmeCorp');
        expect(core.setOutput).toHaveBeenCalledWith('base-repo', 'RocketSled');
        expect(core.setOutput).toHaveBeenCalledWith('head-ref', 'dev/branch-b');
        expect(core.setOutput).toHaveBeenCalledWith('head-sha', 'bbbbbb');
        expect(core.setOutput).toHaveBeenCalledWith('head-owner', 'AcmeCorp');
        expect(core.setOutput).toHaveBeenCalledWith('head-repo', 'RocketSled');
    });

    it('raises an error if an input ends up empty', async () => {
        process.env['INPUT_OWNER'] = 'AcmeCorp';
        process.env['INPUT_REPO'] = 'RocketSled';
        process.env['INPUT_REPO-TOKEN'] = 'cafe43';

        await expect(main()).rejects.toThrowError('Input required and not supplied: pull-number');
    });
});
