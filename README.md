# pull-request-details-action

> Retrieve the branch details of a specific pull request.

This action is designed to retrieve useful details about a pull request in contexts where the event doesn't provide it.

For example, if your workflow is triggered by event type `issue_comment`, the event data does not include details like the base branch name or head branch name. If you need these details, you can use `pull-request-details-action` to get them.

## Inputs

Input Name    | Required? | Description
----------    | --------- | -----------
`owner`       | No        | user/org name of the repo containing the PR (defaults to current org)
`repo`        | No        | repo name of the repo containing the PR (defaults to current name)
`pull-number` | No        | PR number (defaults to current PR number)
`repo-token`  | No        | the API token to use for access (usually GITHUB_TOKEN)

For example, to get the details of `PR #37` on `AcmeCorp/RocketSled`, you would pass the following inputs:

```yaml
  with:
    owner: AcmeCorp
    repo: RocketSled
    pull-number: 37
    repo-token: ${{ secrets.GITHUB_TOKEN }}
```

To retrieve the "current pull request" for an event attached to a pull request, you can skip all the inputs.

## Outputs

Output Name  | Description
-----------  | -----------
`base-ref`   | ref name of base branch
`base-sha`   | commit sha of base branch
`base-owner` | user/org name of base branch
`base-repo`  | repo name of base branch
`head-ref`   | ref name of head branch
`head-sha`   | commit sha of head branch
`head-owner` | user/org name of head branch
`head-repo`  | repo name of head branch

Example outputs:

```yaml
  base-ref: main
  base-sha: 609fa8c98d829
  base-owner: AcmeCorp
  base-repo: RocketSled
  head-ref: my-branch
  head-sha: 20c98a92828d
  head-owner: AcmeCorp
  head-repo: RocketSled
```

Note: to access these outputs, give the step an `id`, and use the step output value expression `steps.<step id>.outputs.<output name>`, as described in the [GitHub Actions reference][gh action docs]. For example:

```yaml
  - uses: HBOCodeLabs/pull-request-details-action@v1
    id: pull-request
  - run: echo Merging ${FROM_BRANCH} to ${TO_BRANCH}
    env:
      # Stash the outputs of pull-request-details-action in env vars
      FROM_BRANCH: ${{ steps.pull-request.outputs.head-ref }}
      TO_BRANCH: ${{ steps.pull-request.outputs.base-ref }}
```

## Changelog

Note: for the versions listed below, your workflows can refer to either the version tag (`HBOCodeLabs/pull-request-details-action@v1.0.5`) or the major version branch (`HBOCodeLabs/pull-request-details-action@v1`).

The major version branch may be updated with backwards-compatible features and bug fixes. Version tags will not be modified once released.

#### 2021-08-04 - `v1.1.0` (`v1`)

 - All inputs are now optional.

#### 2021-07-09 - `v1.0.6` (`v1`)

 - Initial public release.

## Contributions

Pull requests welcome. To ensure unit tests pass locally:

```console
npm install
npm test
```

## Testing changes in a live workflow

To test out modifications in a developer branch, create a branch in your fork, then comment out the `dist`
line in `.gitignore`. Then you can run the `bundle` task, check in all changes, and push up your branch.

```console
git checkout -b testing
npm run bundle
git add .gitignore
git add dist
git commit -m "testing out my changes in a workflow"
git push -u origin HEAD
```

In your GitHub workflow in another project, point at your custom branch:

```yaml
  - uses: MyForkedCopy/pull-request-details-action@testing
```

[gh action docs]: https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions
