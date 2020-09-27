const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
  try {
    const token = core.getInput('token', { required: true });
    const octokit = github.getOctokit(token);
    const owner = github.context.payload.sender.login;
    const repo = github.context.payload.repository.name;

    const { data } = await octokit.pulls.list({
      owner,
      repo,
      state: 'open',
    });

    for (let i = 0; i < data.length; i++) {
      const { requested_reviewers, assignees } = data[i];
      // const requestedReviewersLogin = requested_reviewers.map(r => r.login)
      const requestedReviewersLogin = assignees.map(r => `@${r.login}`).join(', ');
      await octokit.issues.createComment({ 
        owner,
        repo,
        issue_number: data[i].number,
        body: `Hey ${requestedReviewersLogin} ! Don't forget to review this PR !`,
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
};

if (require.main === module) {
  run();
}

module.exports = run;
