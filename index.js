const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
  try {
    const token = core.getInput('token');
    const octokit = github.getOctokit(token);
    // const owner = github.context.payload.repository.full_name.split('/')[0];
    const owner = github.context.payload.sender.login;
    const repo = github.context.payload.repository.name;
    const pull_number = context.payload.pull_request.number;

    const { data } = await octokit.pulls.list({
      owner,
      repo,
      state: 'open',
    });

    console.log(data[0]);
    // console.log(data[0].labels);

    await octokit.pulls.createComment({ 
      owner,
      repo,
      pull_number,
      body: "Hello, world! Thanks for creating the PR",
    })
  } catch (error) {
    core.setFailed(error.message);
  }
};

if (require.main === module) {
  run();
}

module.exports = run;
