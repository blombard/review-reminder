const core = require('@actions/core');
const nock = require('nock');

const run = require('./index.js');


process.env['GITHUB_REPOSITORY_OWNER'] = 'blombard';
process.env['GITHUB_REPOSITORY'] = 'blombard/review-reminder';

function mockGetInput(requestResponse) {
  return function (name, options) { // eslint-disable-line
    return requestResponse[name];
  };
}

jest.mock('@actions/core');

describe('check review request comment', () => {
  nock('https://api.github.com')
    .get(/\/repos\/.*\/pulls\?state=open/).times(2)
    .reply(200, [{ requested_reviewers: [{ login: 'foo' }],requested_teams: [{ slug: 'bar' }], updated_at: '2011-01-26T19:01:12.000Z', number: 2 }]);

  test('success with comment and days option', async () => {
    nock('https://api.github.com')
        .post(/\/repos\/.*\/issues\/2\/comments/, { body: "Hey @foo, @bar ! Don't forget to review this PR !" })
        .reply(200, {});

    const inputs = {
      token: 'foo',
      'reminder-comment': "Don't forget to review this PR !",
      'days-before-reminder': '1',
    };
    core.getInput = jest.fn().mockImplementation(mockGetInput(inputs));
    await run();
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('success with comment, days, organization option', async () => {
    nock('https://api.github.com')
        .post(/\/repos\/.*\/issues\/2\/comments/, { body: "Hey @blombard/foo, @blombard/bar ! Don't forget to review this PR !" })
        .reply(200, {});

    const inputs2 = {
      token: 'foo',
      'reminder-comment': "Don't forget to review this PR !",
      'days-before-reminder': '1',
      'organization': 'blombard'
    };

    core.getInput = jest.fn().mockImplementation(mockGetInput(inputs2));
    await run();
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('fail when no params are given', async () => {
    core.getInput.mockReset();
    await run();
    expect(core.setFailed).toHaveBeenCalled();
  });
});
