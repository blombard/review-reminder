const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
  try {
    const token = core.getInput('token');
    // const octokit = github.getOctokit(token);

    // const data = await octokit.pulls.list({
    //   owner,
    //   repo,
    // });

    console.log(github.context);
    // console.log(data);
  } catch (error) {
    core.setFailed(error.message);
  }
};

if (require.main === module) {
  run();
}

module.exports = run;
