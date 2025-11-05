# Development Notes

## Setup

The package manager PNPM is required for working within this repository.
See [Installation](https://pnpm.io/installation).

To run tests:

```bash
$ pnpm install
$ pnpm test     # watch / interactive
$ pnpm test run # batch mode
```

## Releasing Steps

Determine target `<version>`

On `dev`branch...

1. In `package.json` update `"version"`
1. In `README.md` update `"$schema"` to
    - `"https://raw.githubusercontent.com/conterra/secman-open-resources/<version>/schema/policies.schema.json"`
    - `"https://raw.githubusercontent.com/conterra/secman-open-resources/<version>/schema/server-config.schema.json"`
1. In `./schema/policies.schema.json` update `"$id"` to `"https://raw.githubusercontent.com/conterra/secman-open-resources/<version>/schema/policies.schema.json"`
1. In `./schema/server-config.schema.json` update `"$id"` to `"https://raw.githubusercontent.com/conterra/secman-open-resources/<version>/schema/server-config.schema.json"`
1. Merge changes of `dev` branch into `master`
1. Create tag `<version>` on `master`
