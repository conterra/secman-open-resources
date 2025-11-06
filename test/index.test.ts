import { validateServer, validatePolicy, ValidateResult } from "./validate";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";

describe("server-config.schema.json", function () {
    it("should accept a config with multiple services", function () {
        const result = validateServer(getJson("./json/server-config/services-multiple.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept a file without server config", function () {
        const result = validateServer(getJson("./json/server-config/server-missing.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`"Object must have required property "server""`);
    });
    it("should not accept an empty server config", function () {
        const result = validateServer(getJson("./json/server-config/server-empty.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""server" property must have required property "host""`);
    });
    it("should not accept an empty hostname ", function () {
        const result = validateServer(getJson("./json/server-config/hostname-empty.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""host" property must match pattern "(^http[s]?://[^@/]+$)|(\\$\\{.+\\})""`
        );
    });
    it("should not accept a hostname ending with a /", function () {
        const result = validateServer(getJson("./json/server-config/hostname-ending-with-slash.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""host" property must match pattern "(^http[s]?://[^@/]+$)|(\\$\\{.+\\})""`
        );
    });
    it("should accept a hostname with environmental variable", function () {
        const result = validateServer(getJson("./json/server-config/hostname-env.json"));
        expect(result.valid).toBe(true);
    });
    it("should accept a hostname with http", function () {
        const result = validateServer(getJson("./json/server-config/hostname-http.json"));
        expect(result.valid).toBe(true);
    });
    it("should accept a hostname with https", function () {
        const result = validateServer(getJson("./json/server-config/hostname-https.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept localhost as hostname", function () {
        const result = validateServer(getJson("./json/server-config/hostname-localhost.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""host" property must match pattern "(^http[s]?://[^@/]+$)|(\\$\\{.+\\})""`
        );
    });
    it("should accept a hostname with a port", function () {
        const result = validateServer(getJson("./json/server-config/hostname-port.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept a hostname without a scheme", function () {
        const result = validateServer(getJson("./json/server-config/hostname-no-scheme.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""host" property must match pattern "(^http[s]?://[^@/]+$)|(\\$\\{.+\\})""`
        );
    });
    it("should not accept a hostname with a path ", function () {
        const result = validateServer(getJson("./json/server-config/hostname-path.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""host" property must match pattern "(^http[s]?://[^@/]+$)|(\\$\\{.+\\})""`
        );
    });
    it("should not accept a abc as hostname", function () {
        const result = validateServer(getJson("./json/server-config/hostname-string.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""host" property must match pattern "(^http[s]?://[^@/]+$)|(\\$\\{.+\\})""`
        );
    });

    it("should accept serverAuth basic", function () {
        const result = validateServer(getJson("./json/server-config/server-auth-basic.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept serverAuth basic with missing password", function () {
        const result = validateServer(getJson("./json/server-config/server-auth-basic-missing-password.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""serverAuthn" property must have required property "password""`
        );
    });
    it("should not accept serverAuth basic with missing attributes", function () {
        const result = validateServer(getJson("./json/server-config/server-auth-basic-missing-password-username.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""serverAuthn" property must have required property "username""`
        );
    });
    it("should not accept serverAuth basic with additional attributes", function () {
        const result = validateServer(getJson("./json/server-config/server-auth-basic-additional-property.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`"Property "test" is not expected to be here"`);
    });
    it("should not accept empty serverAuth", function () {
        const result = validateServer(getJson("./json/server-config/server-auth-empty.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""serverAuthn" property tag "type" must be string"`);
    });
    it("should not accept serverAuth with invalid type", function () {
        const result = validateServer(getJson("./json/server-config/server-auth-invalid-type.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""type" property must be equal to one of the allowed values: "none", "basic""`
        );
    });
    it("should accept serverAuth type none", function () {
        const result = validateServer(getJson("./json/server-config/server-auth-none.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept serverAuth type none with username", function () {
        const result = validateServer(getJson("./json/server-config/server-auth-none-with-username.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`"Property "username" is not expected to be here"`);
    });
    it("should not accept an empty services array", function () {
        const result = validateServer(getJson("./json/server-config/services-empty-array.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""services" property must not have fewer than 1 items"`);
    });
    it("should not accept an empty services object", function () {
        const result = validateServer(getJson("./json/server-config/services-empty-item.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""0" property must have required property "policy-ref""`);
    });
    it("should not accept an empty service path", function () {
        const result = validateServer(getJson("./json/server-config/services-path-empty.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""path" property must match pattern "^/[\\w\\-/\\.]+$""`);
    });
    it("should not accept services with a path not starting with an /", function () {
        const result = validateServer(getJson("./json/server-config/services-path-no-leading-slash.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""path" property must match pattern "^/[\\w\\-/\\.]+$""`);
    });
    it("should accept a service path with file ending", function () {
        const result = validateServer(getJson("./json/server-config/services-path-with-fileending.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept a service path with a query", function () {
        const result = validateServer(getJson("./json/server-config/services-path-with-query.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""path" property must match pattern "^/[\\w\\-/\\.]+$""`);
    });
    it("should accept a valid service path", function () {
        const result = validateServer(getJson("./json/server-config/services-path.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept an empty policy-ref", function () {
        const result = validateServer(getJson("./json/server-config/services-policy-ref-empty.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""policy-ref" property must match pattern "^[\\p{L}\\p{N}\\-.#@_]+$""`
        );
    });
    it("should accept a valid policy-ref", function () {
        const result = validateServer(getJson("./json/server-config/services-policy-ref.json"));
        expect(result.valid).toBe(true);
    });
    it("should accept service type FORWARD", function () {
        const result = validateServer(getJson("./json/server-config/services-type-forward-without-policy-ref.json"));
        expect(result.valid).toBe(true);
    });
    it("should accept service type FORWARD with policy-ref", function () {
        const result = validateServer(getJson("./json/server-config/services-type-forward-with-policy-ref.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept an invalid service type", function () {
        const result = validateServer(getJson("./json/server-config/services-type-invalid.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""type" property must be equal to one of the allowed values: "FORWARD", "WMS", "WFS""`
        );
    });
    it("should accept service type WFS", function () {
        const result = validateServer(getJson("./json/server-config/services-type-wfs.json"));
        expect(result.valid).toBe(true);
    });
    it("should accept service type WMS", function () {
        const result = validateServer(getJson("./json/server-config/services-type-wms.json"));
        expect(result.valid).toBe(true);
    });
});

describe("policies.schema.json", function () {
    it("should accept an empty file", function () {
        const result = validatePolicy(getJson("./json/policies/empty.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept unknown property", function () {
        const result = validatePolicy(getJson("./json/policies/unknown-property.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`"Property "unknown" is not expected to be here"`);
    });
    it("should accept property replacements", function () {
        const result = validatePolicy(getJson("./json/policies/property-replacement.json"));
        expect(result.valid).toBe(true);
    });
    it("should accept a file only with policies", function () {
        const result = validatePolicy(getJson("./json/policies/only-policies.json"));
        expect(result.valid).toBe(true);
    });
    it("should accept a file only with fallbackPolicies", function () {
        const result = validatePolicy(getJson("./json/policies/only-fallbackPolicies.json"));
        expect(result.valid).toBe(true);
    });
    it("should accept a file only with restrictions", function () {
        const result = validatePolicy(getJson("./json/policies/only-restrictions.json"));
        expect(result.valid).toBe(true);
    });
    it("should not accept an empty policies array", function () {
        const result = validatePolicy(getJson("./json/policies/policies-empty.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""policies" property must not have fewer than 1 items"`);
    });
    it("should not accept policies with unknown properties", function () {
        const result = validatePolicy(getJson("./json/policies/policies-unknown-property.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`"Property "unknown" is not expected to be here"`);
    });
    it("should not accept a policy with missing layers", function () {
        const result = validatePolicy(getJson("./json/policies/policies-layers-missing.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""0" property must have required property "layers""`);
    });
    it("should not accept a policy with empty layers array", function () {
        const result = validatePolicy(getJson("./json/policies/policies-layers-empty-array.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""layers" property must not have fewer than 1 items"`);
    });

    it("should not accept a policy with empty layers value", function () {
        const result = validatePolicy(getJson("./json/policies/policies-layers-empty-value.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`
          ""0" property must not have fewer than 1 characters
          "0" property must match pattern "^\\$\\{[A-Za-z][A-Za-z0-9_.-]*\\}$"
          "0" property must match a schema in anyOf
          "0" property must be equal to one of the allowed values
          "0" property must match a schema in anyOf"
        `);
    });

    it("should not accept a policy with duplicate layer items", function () {
        const result = validatePolicy(getJson("./json/policies/policies-layers-not-unique.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""layers" property must not have duplicate items (items ## 1 and 2 are identical)"`
        );
    });

    it("should not accept a policy with missing roles", function () {
        const result = validatePolicy(getJson("./json/policies/policies-roles-missing.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""0" property must have required property "roles""`);
    });

    it("should not accept a policy with empty roles array", function () {
        const result = validatePolicy(getJson("./json/policies/policies-roles-empty-array.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""roles" property must not have fewer than 1 items"`);
    });

    it("should not accept a policy with empty roles value", function () {
        const result = validatePolicy(getJson("./json/policies/policies-roles-empty-value.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`
          ""0" property must not have fewer than 1 characters
          "0" property must match pattern "^\\$\\{[A-Za-z][A-Za-z0-9_.-]*\\}$"
          "0" property must match a schema in anyOf
          "0" property must be equal to one of the allowed values
          "0" property must match a schema in anyOf"
        `);
    });

    it("should accept a policy with valid restriction reference", function () {
        const result = validatePolicy(getJson("./json/policies/policies-restrictions.json"));
        expect(result.valid).toBe(true);
    });

    it("should accept a policy with an empty restriction reference array", function () {
        const result = validatePolicy(getJson("./json/policies/policies-restrictions-empty-array.json"));
        expect(result.valid).toBe(true);
    });

    it("should not accept a policy with an empty restriction reference value", function () {
        const result = validatePolicy(getJson("./json/policies/policies-restrictions-empty-value.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""0" property must not have fewer than 1 characters"`);
    });

    it("should accept fallbackPolicies with empty array", function () {
        const result = validatePolicy(getJson("./json/policies/fallbackPolicies-empty-array.json"));
        expect(result.valid).toBe(true);
    });

    it("should not accept fallbackPolicies with missing layers", function () {
        const result = validatePolicy(getJson("./json/policies/fallbackPolicies-missing-layers.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""0" property must have required property "layers""`);
    });

    it("should not accept fallbackPolicies with roles", function () {
        const result = validatePolicy(getJson("./json/policies/fallbackPolicies-with-roles.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`"Property "roles" is not expected to be here"`);
    });

    it("should accept fallbackPolicies and policies", function () {
        const result = validatePolicy(getJson("./json/policies/fallbackPolicies-and-policies.json"));
        expect(result.valid).toBe(true);
    });

    it("should not accept fallbackPolicies with unknown property", function () {
        const result = validatePolicy(getJson("./json/policies/fallbackPolicies-unknown-property.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`"Property "unknown" is not expected to be here"`);
    });

    it("should not accept spatial restrictions with source without file endings", function () {
        const result = validatePolicy(getJson("./json/policies/restrictions-spatial-source-no-file-ending.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`
          ""source" property must match pattern "^[\\p{L}\\p{N}\\-.#@_]+(\\.(geo)?json)$"
          "source" property must match pattern "^\\$\\{[A-Za-z][A-Za-z0-9_.-]*\\}$"
          "source" property must match a schema in anyOf"
          `);
    });

    it("should not accept spatial restrictions without source", function () {
        const result = validatePolicy(getJson("./json/policies/restrictions-spatial-source-missing.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""europe" property must have required property "source""`);
    });

    it("should not accept spatial restrictions with a path to the source", function () {
        const result = validatePolicy(getJson("./json/policies/restrictions-spatial-source-with-path.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`
          ""source" property must match pattern "^[\\p{L}\\p{N}\\-.#@_]+(\\.(geo)?json)$"
          "source" property must match pattern "^\\$\\{[A-Za-z][A-Za-z0-9_.-]*\\}$"
          "source" property must match a schema in anyOf"
          `);
    });

    it("should not accept spatial restrictions with unknown spatialOperation", function () {
        const result = validatePolicy(getJson("./json/policies/restrictions-spatial-spatialOperation-unknown.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""spatialOperation" property must be equal to one of the allowed values: "intersect", "within""`
        );
    });

    it("should not accept spatial restrictions with unknown property", function () {
        const result = validatePolicy(getJson("./json/policies/restrictions-spatial-unknown-property.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`"Property "featurequery" is not expected to be here"`);
    });

    it("should accept spatial restrictions", function () {
        const result = validatePolicy(getJson("./json/policies/restrictions-spatial.json"));
        expect(result.valid).toBe(true);
    });

    it("should accept readonly restrictions", function () {
        const result = validatePolicy(getJson("./json/policies/restrictions-readonly.json"));
        expect(result.valid).toBe(true);
    });

    it("should not accept readonly restrictions with unknown properties", function () {
        const result = validatePolicy(getJson("./json/policies/restrictions-readonly-unknown-property.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`"Property "layers" is not expected to be here"`);
    });

    it("should not accept restrictions with unknown type", function () {
        const result = validatePolicy(getJson("./json/policies/restrictions-type-unknown.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(
            `""type" property must be equal to one of the allowed values: "spatial", "readonly""`
        );
    });

    it("should not accept restrictions with missing type", function () {
        const result = validatePolicy(getJson("./json/policies/restrictions-type-missing.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""europe" property tag "type" must be string"`);
    });

    it("should not accept restrictions with illegal character", function () {
        const result = validatePolicy(getJson("./json/policies/restrictions-illegal-character.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`
          ""restrictions" property must match pattern "^[A-Za-z][A-Za-z0-9_-]*$"
          "restrictions" property property name must be valid"
        `);
    });

    it("should not accept restrictions with illegal id (starting with a number)", function () {
        const result = validatePolicy(getJson("./json/policies/restrictions-illegal-id-first-not-a-number.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`
          ""restrictions" property must match pattern "^[A-Za-z][A-Za-z0-9_-]*$"
          "restrictions" property property name must be valid"
        `);
    });

    it("should accept a properties section", function () {
        const result = validatePolicy(getJson("./json/policies/properties.json"));
        expect(result.valid).toBe(true);
    });

    it("should not accept a properties section with number values", function () {
        const result = validatePolicy(getJson("./json/policies/properties-invalid-number-values.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`""numbersNotAllowed" property type must be string"`);
    });

    it("should not accept a properties section with keys starting with number values", function () {
        const result = validatePolicy(getJson("./json/policies/properties-invalid-starting-number.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`
          ""properties" property must match pattern "^[A-Za-z][A-Za-z0-9_-]*$"
          "properties" property property name must be valid"
        `);
    });

    it("should not accept a properties section with keys using invalid keys", function () {
        const result = validatePolicy(getJson("./json/policies/properties-invalid-character-in-key.json"));
        expect(getErrors(result)).toMatchInlineSnapshot(`
          ""properties" property must match pattern "^[A-Za-z][A-Za-z0-9_-]*$"
          "properties" property property name must be valid"
        `);
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
