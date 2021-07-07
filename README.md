# pull-request-details-action

Retrieve the details of a specific pull request's head and base branches.

This action is not useful for workflows triggered by pull request events, where information about the head and base branches of the pull request is already available. However, some events (such as issue comments) do not include the full SHA information for both the head and the base branch, and in those cases this action can be helpful.

## Examples

In this example, the action is used to retrieve the base branch name from an issue comment trigger.

```yaml
on:
  issue_comment:
    types: [created]
jobs:
  helper:
    runs-on: ubuntu-latest
    steps:
      - uses: HBOCodeLabs/pull-request-details-action
        id: pull-request
        with:
          owner: ${{ github.event.repository.owner.login }}
          repo: ${{ github.event.repository.name }}
          pull-number: ${{ github.event.issue.number }}
          repo-token: ${{ secrets.GITHUB_TOKEN }}
      - run |
          echo I'm on branch ${BRANCH}
        env:
          BRANCH: ${{ steps.pull-request.outputs.head-ref }}
```
