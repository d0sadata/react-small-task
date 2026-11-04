# Contributing

Use the Node version pinned in `.nvmrc`, then run `npm ci`. The `prepare` script
installs the local Git hooks for staged-file checks and commit-message validation.

New commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add product filtering
fix: preserve the selected category
docs: clarify the exercise brief
```

The pre-commit hook checks staged files, and the commit-message hook checks the
commit subject. Pull request CI checks the commit range as well. The original
repository commit predates this convention; history is not rewritten.

Run the checks listed in the [README](README.md) before opening a pull request.
The Markdown lint configuration exempts code-block line length so the supplied
product data can remain in its original form.
