const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
  try {
    const token = core.getInput('token');
    const octokit = github.getOctokit(token);

    const { data } = await octokit.pulls.list({
      owner: github.context.payload.repository.full_name.split('/')[0],
      repo: github.context.payload.repository.name,
      state: 'open',
    });

    console.log(data[0].assignees);
    console.log(data[0].labels);
    // console.log(octokit);
    // console.log(core);
  } catch (error) {
    core.setFailed(error.message);
  }
};

if (require.main === module) {
  run();
}

module.exports = run;
