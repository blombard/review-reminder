const core = require('@actions/core');
const nock = require('nock');

const run = require('./index.js');

const inputs = {
  token: 'foo',
  'reminder-comment': "Don't forget to review this PR !",
  'days-before-reminder': '1',
};

function mockGetInput(requestResponse) {
  return function (name, options) { // eslint-disable-line
    return requestResponse[name];
  };
}

jest.mock('@actions/core');

describe('Run the test suite', () => {
  nock('https://api.github.com')
    .get(/\/repos\/.*\/pulls\?state=open/)
    .reply(200, [{ requested_reviewers: [{ login: 'foo' }], updated_at: '2011-01-26T19:01:12.000Z', number: 1 }]);
  nock('https://api.github.com')
    .post(/\/repos\/.*\/issues\/1\/comments/, { body: "Hey @foo ! Don't forget to review this PR !" })
    .reply(200, {});

  test('it should be a success when the params are good', async () => {
    core.getInput = jest.fn().mockImplementation(mockGetInput(inputs));
    await run();
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('it should be a failure when no params are given', async () => {
    core.getInput.mockReset();
    await run();
    expect(core.setFailed).toHaveBeenCalled();
  });
});
