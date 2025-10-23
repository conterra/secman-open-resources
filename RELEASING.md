# Releasing Steps

Determine target `<version>`

On `dev`branch...
1. In `package.json` update `"version"`
1. In `README.md` update `"$schema"` to `https://raw.githubusercontent.com/conterra/policies-json/<version>/schema/policies.schema.json`
1. In `./schema/policies.schema.json` update `"$id"` to to `https://raw.githubusercontent.com/conterra/policies-json/<version>/schema/policies.schema.json`
1. Merge changes of `dev` branch into `master`
1. Create tag `<version>` on `master`
