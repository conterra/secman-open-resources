const { assert } = require("chai");
const { validateServer, validatePolicy } = require('./validate');

describe("server-config.schema.json", function () {
    it("should accept a config with multiple services", function() {
        assert.isTrue(validateServer(require("./json/server-config/services-multiple.json")))
    });
    it("should not accept a file without server config", function() {
        assert.isFalse(validateServer(require("./json/server-config/server-missing.json")))
    });
    it("should not accept an empty server config", function() {
        assert.isFalse(validateServer(require("./json/server-config/server-empty.json")))
    });
    it("should not accept an empty hostname ", function() {
        assert.isFalse(validateServer(require("./json/server-config/hostname-empty.json")))
    });
    it("should not accept a hostname ending with a /", function () {
        assert.isFalse(validateServer(require("./json/server-config/hostname-ending-with-slash.json")));
    });
    it("should accept a hostname with environmental variable", function () {
        assert.isTrue(validateServer(require("./json/server-config/hostname-env.json")));
    });
    it("should accept a hostname with http", function () {
        assert.isTrue(validateServer(require("./json/server-config/hostname-http.json")));
    });
    it("should accept a hostname with https", function () {
        assert.isTrue(validateServer(require("./json/server-config/hostname-https.json")));
    });
    it("should not accept localhost as hostname", function () {
        assert.isFalse(validateServer(require("./json/server-config/hostname-localhost.json")));
    });
    it("should accept a hostname with a port", function () {
        assert.isTrue(validateServer(require("./json/server-config/hostname-port.json")));
    });
    it("should not accept a hostname without a scheme", function() {
        assert.isFalse(validateServer(require("./json/server-config/hostname-no-scheme.json")))
    });
    it("should not accept a hostname with a path ", function() {
        assert.isFalse(validateServer(require("./json/server-config/hostname-path.json")))
    });
    it("should not accept a abc as hostname", function() {
        assert.isFalse(validateServer(require("./json/server-config/hostname-string.json")))
    });

    it("should accept serverAuth basic", function () {
        assert.isTrue(validateServer(require("./json/server-config/server-auth-basic.json")));
    });
    it("should not accept serverAuth basic with missing password", function () {
        assert.isFalse(validateServer(require("./json/server-config/server-auth-basic-missing-password.json")));
    });
    it("should not accept serverAuth basic with missing attributes", function () {
        assert.isFalse(validateServer(require("./json/server-config/server-auth-basic-missing-password-username.json")));
    });
    it("should not accept serverAuth basic with additional attributes", function () {
        assert.isFalse(validateServer(require("./json/server-config/server-auth-basic-additional-property.json")));
    });
    it("should not accept empty serverAuth", function () {
        assert.isFalse(validateServer(require("./json/server-config/server-auth-empty.json")));
    });
    it("should not accept serverAuth with invalid type", function () {
        assert.isFalse(validateServer(require("./json/server-config/server-auth-invalid-type.json")));
    });
    it("should accept serverAuth type none", function () {
        assert.isTrue(validateServer(require("./json/server-config/server-auth-none.json")));
    });
    it("should not accept serverAuth type none with username", function () {
        assert.isFalse(validateServer(require("./json/server-config/server-auth-none-with-username.json")));
    });

    it("should not accept an empty services array", function () {
        assert.isFalse(validateServer(require("./json/server-config/services-empty-array.json")));
    });
    it("should not accept an empty services object", function () {
        assert.isFalse(validateServer(require("./json/server-config/services-empty-item.json")));
    });
    it("should not accept an empty service path", function () {
        assert.isFalse(validateServer(require("./json/server-config/services-path-empty.json")));
    });
    it("should not accept services with a path not starting with an /", function () {
        assert.isFalse(validateServer(require("./json/server-config/services-path-no-leading-slash.json")));
    });
    it("should accept a service path with fileending", function () {
        assert.isTrue(validateServer(require("./json/server-config/services-path-with-fileending.json")));
    });
    it("should not accept a service path with a query", function () {
        assert.isFalse(validateServer(require("./json/server-config/services-path-with-query.json")));
    });
    it("should accept a valid service path", function () {
        assert.isTrue(validateServer(require("./json/server-config/services-path.json")));
    });
    it("should not accept an empty policy-ref", function () {
        assert.isFalse(validateServer(require("./json/server-config/services-policy-ref-empty.json")));
    });
    it("should accept a valid policy-ref", function () {
        assert.isTrue(validateServer(require("./json/server-config/services-policy-ref.json")));
    });
    it("should accept service type FORWARD", function () {
        assert.isTrue(validateServer(require("./json/server-config/services-type-forward-without-policy-ref.json")));
    });
    it("should accept service type FORWARD with policy-ref", function () {
        assert.isTrue(validateServer(require("./json/server-config/services-type-forward-with-policy-ref.json")));
    });
    it("should not accept an invalid service type", function () {
        assert.isFalse(validateServer(require("./json/server-config/services-type-invalid.json")));
    });
    it("should accept service type WFS", function () {
        assert.isTrue(validateServer(require("./json/server-config/services-type-wfs.json")));
    });
    it("should accept service type WMS", function () {
        assert.isTrue(validateServer(require("./json/server-config/services-type-wms.json")));
    });
});

describe("policies.schema.json", function () {
    it("should accept an empty file", function() {
        assert.isTrue(validatePolicy(require("./json/policies/empty.json")))
    });
    it("should not accept unknown property", function() {
        assert.isFalse(validatePolicy(require("./json/policies/unknown-property.json")))
    });
    it("should accept property replacements", function() {
        assert.isTrue(validatePolicy(require("./json/policies/property-replacement.json")))
    });
    it("should accept a file only with policies", function() {
        assert.isTrue(validatePolicy(require("./json/policies/only-policies.json")))
    });
    it("should accept a file only with fallbackPolicies", function() {
        assert.isTrue(validatePolicy(require("./json/policies/only-fallbackPolicies.json")))
    });
    it("should accept a file only with restrictions", function() {
        assert.isTrue(validatePolicy(require("./json/policies/only-restrictions.json")))
    });
    it("should not accept an empty policies array", function() {
        assert.isFalse(validatePolicy(require("./json/policies/policies-empty.json")))
    });
    it("should not accept policies with unknown properties", function() {
        assert.isFalse(validatePolicy(require("./json/policies/policies-unknown-property.json")))
    });
    it("should not accept a policy with missing layers", function() {
        assert.isFalse(validatePolicy(require("./json/policies/policies-layers-missing.json")))
    });
    it("should not accept a policy with empty layers array", function() {
        assert.isFalse(validatePolicy(require("./json/policies/policies-layers-empty-array.json")))
    });
    it("should not accept a policy with empty layers value", function() {
        assert.isFalse(validatePolicy(require("./json/policies/policies-layers-empty-value.json")))
    });
    it("should not accept a policy with duplicate layer items", function() {
        assert.isFalse(validatePolicy(require("./json/policies/policies-layers-not-unique.json")))
    });
    it("should not accept a policy with missing roles", function() {
        assert.isFalse(validatePolicy(require("./json/policies/policies-roles-missing.json")))
    });
    it("should not accept a policy with empty roles array", function() {
        assert.isFalse(validatePolicy(require("./json/policies/policies-roles-empty-array.json")))
    });
    it("should not accept a policy with empty roles value", function() {
        assert.isFalse(validatePolicy(require("./json/policies/policies-roles-empty-value.json")))
    });
    it("should accept a policy with valid restriction reference", function() {
        assert.isTrue(validatePolicy(require("./json/policies/policies-restrictions.json")))
    });
    it("should accept a policy with an empty restriction reference array", function() {
        assert.isTrue(validatePolicy(require("./json/policies/policies-restrictions-empty-array.json")))
    });
    it("should not accept a policy with an empty restriction reference value", function() {
        assert.isFalse(validatePolicy(require("./json/policies/policies-restrictions-empty-value.json")))
    });
    it("should accept fallbackPolicies with empty array", function() {
        assert.isTrue(validatePolicy(require("./json/policies/fallbackPolicies-empty-array.json")))
    });
    it("should not accept fallbackPolicies with missing layers", function() {
        assert.isFalse(validatePolicy(require("./json/policies/fallbackPolicies-missing-layers.json")))
    });
    it("should not accept fallbackPolicies with roles", function() {
        assert.isFalse(validatePolicy(require("./json/policies/fallbackPolicies-with-roles.json")))
    });
    it("should accept fallbackPolicies and policies", function() {
        assert.isTrue(validatePolicy(require("./json/policies/fallbackPolicies-and-policies.json")))
    });
    it("should not accept fallbackPolicies with unknown property", function() {
        assert.isFalse(validatePolicy(require("./json/policies/fallbackPolicies-unknown-property.json")))
    });
    it("should not accept spatial restrictions with source without file endings", function() {
        assert.isFalse(validatePolicy(require("./json/policies/restrictions-spatial-source-no-file-ending.json")))
    });
    it("should not accept spatial restrictions without source", function() {
        assert.isFalse(validatePolicy(require("./json/policies/restrictions-spatial-source-missing.json")))
    });
    it("should not accept spatial restrictions with a path to the source", function() {
        assert.isFalse(validatePolicy(require("./json/policies/restrictions-spatial-source-with-path.json")))
    });
    it("should not accept spatial restrictions with unknown spatialOperation", function() {
        assert.isFalse(validatePolicy(require("./json/policies/restrictions-spatial-spatialOperation-unknown.json")))
    });
    it("should not accept spatial restrictions with unknown property", function() {
        assert.isFalse(validatePolicy(require("./json/policies/restrictions-spatial-unknown-property.json")))
    });
    it("should accept spatial restrictions", function() {
        assert.isTrue(validatePolicy(require("./json/policies/restrictions-spatial.json")))
    });
    it("should accept readonly restrictions", function() {
        assert.isTrue(validatePolicy(require("./json/policies/restrictions-readonly.json")))
    });
    it("should not accept readonly restrictions with unknown properties", function() {
        assert.isFalse(validatePolicy(require("./json/policies/restrictions-readonly-unknown-property.json")))
    });
    it("should not accept restrictions with unknown type", function() {
        assert.isFalse(validatePolicy(require("./json/policies/restrictions-type-unknown.json")))
    });
    it("should not accept restrictions with missing type", function() {
        assert.isFalse(validatePolicy(require("./json/policies/restrictions-type-missing.json")))
    });
    it("should not accept restrictions with illegal character", function() {
        assert.isFalse(validatePolicy(require("./json/policies/restrictions-illegal-character.json")))
    });
    it("should not accept restrictions with illegal id (starting with a number)", function() {
        assert.isFalse(validatePolicy(require("./json/policies/restrictions-illegal-id-first-not-a-number.json")))
    });
    it("should accept a properties section", function () {
        assert.isTrue(validatePolicy(require("./json/policies/properties.json")));
    });
    it("should not accept a properties section with number values", function () {
        assert.isFalse(validatePolicy(require("./json/policies/properties-invalid-number-values.json")));
    });
    it("should not accept a properties section with keys starting with number values", function () {
        assert.isFalse(validatePolicy(require("./json/policies/properties-invalid-starting-number.json")));
    });
    it("should not accept a properties section with keys using invalid keys", function () {
        assert.isFalse(validatePolicy(require("./json/policies/properties-invalid-character-in-key.json")));
    });
});
