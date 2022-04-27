[![Maintainability](https://api.codeclimate.com/v1/badges/9ca3572ed6d55c403b49/maintainability)](https://codeclimate.com/github/blombard/review-reminder/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/9ca3572ed6d55c403b49/test_coverage)](https://codeclimate.com/github/blombard/review-reminder/test_coverage)

# Review reminder
Send reminders to requested reviewers of a pull request

## Example

```yml
on:
  schedule:
    - cron: '0 9 * * *'

jobs:
  deploy:
    name: Review reminders
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - uses: blombard/review-reminder@master
      with:
        token: "${{ secrets.GITHUB_TOKEN }}"
        reminder-comment: "Don't forget to review this PR !"
        days-before-reminder: '1'
```

## Inputs
#### token
`required: true`\
Should be your GITHUB_TOKEN secret

#### reminder-comment
`required: false`\
`default: "Don't forget to review this PR !"`\
Note that `"Hey @reviewer1, @reviewer2, @... !"` will be appended before.

#### days-before-reminder
`required: false`\
`default: '1'`\
Should be greater or equal to `0`
