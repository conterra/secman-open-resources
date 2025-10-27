const Ajv = require('ajv');
const serverSchema = require("../schema/server-config.schema.json");
const policySchema = require("../schema/policies.schema.json");
const ajv = new Ajv({
    // for vscode schema extensions
    strict: false
});
const validateServer = ajv.compile(serverSchema);
const validatePolicy = ajv.compile(policySchema);

module.exports = {
    validateServer: function (data) {
        return validateServer(data);
    },
    validatePolicy: function (data) {
        return validatePolicy(data);
    }
};
