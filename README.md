# Schema files for security.manager OGC

The policies schema defines the [JSON schema](https://json-schema.org/) used for service access policies in security.manager OGC.
The server config schema defines the [JSON schema](https://json-schema.org/) used for server config in security.manager OGC.

Referencing the [policies schema definition files](./schema) in corresponding files serves two purposes:

1. **Validation** of JSON regarding
    - structure
    - types of values
    - allowed patterns for values
2. Provide **editing support**, eg. in Visual Studio Code, like
    - code suggest
    - type documentation
    - type examples

Please see the test folder more samples [/test/json](./test/json).
