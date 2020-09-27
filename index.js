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

    console.log(data[0]);
    for (let i = 0; i < data.length; i++) {
      await octokit.issues.createComment({ 
        owner,
        repo,
        issue_number: data[i].number,
        body: "Hello, world! Thanks for creating the PR",
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
