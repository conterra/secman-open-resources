import { validatePolicy, newValidateServer, ValidateResult } from "./validate";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, assert, expect } from "vitest";

describe("server-config.schema.json", function () {
    it("should accept a config with multiple services", function () {
        const result = newValidateServer(getJson("./json/server-config/services-multiple.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept a file without server config", function () {
        const result = newValidateServer(getJson("./json/server-config/server-missing.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`"Object must have required property "server""`);
    });
    it("should not accept an empty server config", function () {
        const result = newValidateServer(getJson("./json/server-config/server-empty.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""server" property must have required property "host""`);
    });
    it("should not accept an empty hostname ", function () {
        const result = newValidateServer(getJson("./json/server-config/hostname-empty.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""host" property must match pattern "(^http[s]?://[^@/]+$)|(\\$\\{.+\\})""`
        );
    });
    it("should not accept a hostname ending with a /", function () {
        const result = newValidateServer(getJson("./json/server-config/hostname-ending-with-slash.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""host" property must match pattern "(^http[s]?://[^@/]+$)|(\\$\\{.+\\})""`
        );
    });
    it("should accept a hostname with environmental variable", function () {
        const result = newValidateServer(getJson("./json/server-config/hostname-env.json"));
        expect(result.valid).toBe(true);
    });
    it("should accept a hostname with http", function () {
        const result = newValidateServer(getJson("./json/server-config/hostname-http.json"));
        expect(result.valid).toBe(true);
    });
    it("should accept a hostname with https", function () {
        const result = newValidateServer(getJson("./json/server-config/hostname-https.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept localhost as hostname", function () {
        const result = newValidateServer(getJson("./json/server-config/hostname-localhost.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""host" property must match pattern "(^http[s]?://[^@/]+$)|(\\$\\{.+\\})""`
        );
    });
    it("should accept a hostname with a port", function () {
        const result = newValidateServer(getJson("./json/server-config/hostname-port.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept a hostname without a scheme", function () {
        const result = newValidateServer(getJson("./json/server-config/hostname-no-scheme.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""host" property must match pattern "(^http[s]?://[^@/]+$)|(\\$\\{.+\\})""`
        );
    });
    it("should not accept a hostname with a path ", function () {
        const result = newValidateServer(getJson("./json/server-config/hostname-path.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""host" property must match pattern "(^http[s]?://[^@/]+$)|(\\$\\{.+\\})""`
        );
    });
    it("should not accept a abc as hostname", function () {
        const result = newValidateServer(getJson("./json/server-config/hostname-string.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""host" property must match pattern "(^http[s]?://[^@/]+$)|(\\$\\{.+\\})""`
        );
    });

    it("should accept serverAuth basic", function () {
        const result = newValidateServer(getJson("./json/server-config/server-auth-basic.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept serverAuth basic with missing password", function () {
        const result = newValidateServer(getJson("./json/server-config/server-auth-basic-missing-password.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""serverAuthn" property must have required property "password""`
        );
    });
    it("should not accept serverAuth basic with missing attributes", function () {
        const result = newValidateServer(
            getJson("./json/server-config/server-auth-basic-missing-password-username.json")
        );
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""serverAuthn" property must have required property "username""`
        );
    });
    it("should not accept serverAuth basic with additional attributes", function () {
        const result = newValidateServer(getJson("./json/server-config/server-auth-basic-additional-property.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`"Property "test" is not expected to be here"`);
    });
    it("should not accept empty serverAuth", function () {
        const result = newValidateServer(getJson("./json/server-config/server-auth-empty.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""serverAuthn" property tag "type" must be string"`);
    });
    it("should not accept serverAuth with invalid type", function () {
        const result = newValidateServer(getJson("./json/server-config/server-auth-invalid-type.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""type" property must be equal to one of the allowed values: "none", "basic""`
        );
    });
    it("should accept serverAuth type none", function () {
        const result = newValidateServer(getJson("./json/server-config/server-auth-none.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept serverAuth type none with username", function () {
        const result = newValidateServer(getJson("./json/server-config/server-auth-none-with-username.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`"Property "username" is not expected to be here"`);
    });
    it("should not accept an empty services array", function () {
        const result = newValidateServer(getJson("./json/server-config/services-empty-array.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""services" property must not have fewer than 1 items"`);
    });
    it("should not accept an empty services object", function () {
        const result = newValidateServer(getJson("./json/server-config/services-empty-item.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""0" property must have required property "policy-ref""`);
    });
    it("should not accept an empty service path", function () {
        const result = newValidateServer(getJson("./json/server-config/services-path-empty.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""path" property must match pattern "^/[\\w\\-/\\.]+$""`);
    });
    it("should not accept services with a path not starting with an /", function () {
        const result = newValidateServer(getJson("./json/server-config/services-path-no-leading-slash.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""path" property must match pattern "^/[\\w\\-/\\.]+$""`);
    });
    it("should accept a service path with file ending", function () {
        const result = newValidateServer(getJson("./json/server-config/services-path-with-fileending.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept a service path with a query", function () {
        const result = newValidateServer(getJson("./json/server-config/services-path-with-query.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""path" property must match pattern "^/[\\w\\-/\\.]+$""`);
    });
    it("should accept a valid service path", function () {
        const result = newValidateServer(getJson("./json/server-config/services-path.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept an empty policy-ref", function () {
        const result = newValidateServer(getJson("./json/server-config/services-policy-ref-empty.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""policy-ref" property must match pattern "^[\\p{L}\\p{N}\\-.#@_]+$""`
        );
    });
    it("should accept a valid policy-ref", function () {
        const result = newValidateServer(getJson("./json/server-config/services-policy-ref.json"));
        expect(result.valid).toBe(true);
    });
    it("should accept service type FORWARD", function () {
        const result = newValidateServer(getJson("./json/server-config/services-type-forward-without-policy-ref.json"));
        expect(result.valid).toBe(true);
    });
    it("should accept service type FORWARD with policy-ref", function () {
        const result = newValidateServer(getJson("./json/server-config/services-type-forward-with-policy-ref.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept an invalid service type", function () {
        const result = newValidateServer(getJson("./json/server-config/services-type-invalid.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""type" property must be equal to one of the allowed values: "FORWARD", "WMS", "WFS""`
        );
    });
    it("should accept service type WFS", function () {
        const result = newValidateServer(getJson("./json/server-config/services-type-wfs.json"));
        expect(result.valid).toBe(true);
    });
    it("should accept service type WMS", function () {
        const result = newValidateServer(getJson("./json/server-config/services-type-wms.json"));
        expect(result.valid).toBe(true);
    });
});

describe("policies.schema.json", function () {
    it("should accept an empty file", function () {
        assert.isTrue(validatePolicy(getJson("./json/policies/empty.json")));
    });
    it("should not accept unknown property", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/unknown-property.json")));
    });
    it("should accept property replacements", function () {
        assert.isTrue(validatePolicy(getJson("./json/policies/property-replacement.json")));
    });
    it("should accept a file only with policies", function () {
        assert.isTrue(validatePolicy(getJson("./json/policies/only-policies.json")));
    });
    it("should accept a file only with fallbackPolicies", function () {
        assert.isTrue(validatePolicy(getJson("./json/policies/only-fallbackPolicies.json")));
    });
    it("should accept a file only with restrictions", function () {
        assert.isTrue(validatePolicy(getJson("./json/policies/only-restrictions.json")));
    });
    it("should not accept an empty policies array", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/policies-empty.json")));
    });
    it("should not accept policies with unknown properties", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/policies-unknown-property.json")));
    });
    it("should not accept a policy with missing layers", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/policies-layers-missing.json")));
    });
    it("should not accept a policy with empty layers array", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/policies-layers-empty-array.json")));
    });
    it("should not accept a policy with empty layers value", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/policies-layers-empty-value.json")));
    });
    it("should not accept a policy with duplicate layer items", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/policies-layers-not-unique.json")));
    });
    it("should not accept a policy with missing roles", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/policies-roles-missing.json")));
    });
    it("should not accept a policy with empty roles array", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/policies-roles-empty-array.json")));
    });
    it("should not accept a policy with empty roles value", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/policies-roles-empty-value.json")));
    });
    it("should accept a policy with valid restriction reference", function () {
        assert.isTrue(validatePolicy(getJson("./json/policies/policies-restrictions.json")));
    });
    it("should accept a policy with an empty restriction reference array", function () {
        assert.isTrue(validatePolicy(getJson("./json/policies/policies-restrictions-empty-array.json")));
    });
    it("should not accept a policy with an empty restriction reference value", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/policies-restrictions-empty-value.json")));
    });
    it("should accept fallbackPolicies with empty array", function () {
        assert.isTrue(validatePolicy(getJson("./json/policies/fallbackPolicies-empty-array.json")));
    });
    it("should not accept fallbackPolicies with missing layers", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/fallbackPolicies-missing-layers.json")));
    });
    it("should not accept fallbackPolicies with roles", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/fallbackPolicies-with-roles.json")));
    });
    it("should accept fallbackPolicies and policies", function () {
        assert.isTrue(validatePolicy(getJson("./json/policies/fallbackPolicies-and-policies.json")));
    });
    it("should not accept fallbackPolicies with unknown property", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/fallbackPolicies-unknown-property.json")));
    });
    it("should not accept spatial restrictions with source without file endings", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/restrictions-spatial-source-no-file-ending.json")));
    });
    it("should not accept spatial restrictions without source", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/restrictions-spatial-source-missing.json")));
    });
    it("should not accept spatial restrictions with a path to the source", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/restrictions-spatial-source-with-path.json")));
    });
    it("should not accept spatial restrictions with unknown spatialOperation", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/restrictions-spatial-spatialOperation-unknown.json")));
    });
    it("should not accept spatial restrictions with unknown property", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/restrictions-spatial-unknown-property.json")));
    });
    it("should accept spatial restrictions", function () {
        assert.isTrue(validatePolicy(getJson("./json/policies/restrictions-spatial.json")));
    });
    it("should accept readonly restrictions", function () {
        assert.isTrue(validatePolicy(getJson("./json/policies/restrictions-readonly.json")));
    });
    it("should not accept readonly restrictions with unknown properties", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/restrictions-readonly-unknown-property.json")));
    });
    it("should not accept restrictions with unknown type", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/restrictions-type-unknown.json")));
    });
    it("should not accept restrictions with missing type", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/restrictions-type-missing.json")));
    });
    it("should not accept restrictions with illegal character", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/restrictions-illegal-character.json")));
    });
    it("should not accept restrictions with illegal id (starting with a number)", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/restrictions-illegal-id-first-not-a-number.json")));
    });
    it("should accept a properties section", function () {
        assert.isTrue(validatePolicy(getJson("./json/policies/properties.json")));
    });
    it("should not accept a properties section with number values", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/properties-invalid-number-values.json")));
    });
    it("should not accept a properties section with keys starting with number values", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/properties-invalid-starting-number.json")));
    });
    it("should not accept a properties section with keys using invalid keys", function () {
        assert.isFalse(validatePolicy(getJson("./json/policies/properties-invalid-character-in-key.json")));
    });
});

function getJson(filename: string) {
    try {
        const path = resolve(__dirname, filename);
        const text = readFileSync(path, "utf-8");
        const data = JSON.parse(text);
        return data;
    } catch (e) {
        throw new Error(`Failed to read json from '${filename}': ${(e as any).message}`, { cause: e });
    }
}

function getErrors(result: ValidateResult): string | undefined {
    return result.valid ? "" : result.messages;
}
