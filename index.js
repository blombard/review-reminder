const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
  try {
    const token = core.getInput('token', { required: true });
    const reviewComment = core.getInput('reminder-comment');
    const daysBeforeReminder = core.getInput('days-before-reminder');
    const organization = core.getInput('organization');

    const octokit = github.getOctokit(token);
    const { GITHUB_REPOSITORY_OWNER: owner, GITHUB_REPOSITORY } = process.env;
    const repo = GITHUB_REPOSITORY.split('/')[1];
    const { data } = await octokit.pulls.list({ owner, repo, state: 'open' });

    const reviewerPrefix = organization ? organization + "/" : "";
    data.forEach(({ requested_reviewers, requested_teams, updated_at, number }) => {
      if ((requested_reviewers.length || requested_teams.length) && rightTimeForReminder(updated_at, daysBeforeReminder)) {
        const requestedReviewersLogin = requested_reviewers.map(r => `@${reviewerPrefix}${r.login}`);
        const requestedTeamsSlug = requested_teams.map(r => `@${reviewerPrefix}${r.slug}`);
        const allReviewers = [...requestedReviewersLogin, ...requestedTeamsSlug].join(', ');
        octokit.issues.createComment({
          owner,
          repo,
          issue_number: number,
          body: `Hey ${allReviewers} ! ${reviewComment}`,
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
