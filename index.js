const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
  try {
    const token = core.getInput('token', { required: true });
    const reviewComment = core.getInput('reminder-comment');
    const daysBeforeReminder = core.getInput('days-before-reminder');

    const octokit = github.getOctokit(token);
    const owner = github.context.payload.sender && github.context.payload.sender.login;
    const repo = github.context.payload.repositor && github.context.payload.repository.name;
    const { data } = await octokit.pulls.list({ owner, repo, state: 'open' });

    data.forEach(({ requested_reviewers, updated_at, number }) => {
      if (rightTimeForReminder(updated_at, daysBeforeReminder)) {
        const requestedReviewersLogin = requested_reviewers.map(r => `@${r.login}`).join(', ');
        octokit.issues.createComment({
          owner,
          repo,
          issue_number: number,
          body: `Hey ${requestedReviewersLogin} ! ${reviewComment}`,
        });
      }
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

const rightTimeForReminder = (updatedAt, daysBeforeReminder) => {
  const today = new Date().getTime();
  const updatedAtDate = new Date(updatedAt).getTime();
  const daysInMilliSecond = 86400000 * daysBeforeReminder;
  return today - daysInMilliSecond > updatedAtDate;
};

if (require.main === module) {
  run();
}

module.exports = run;
