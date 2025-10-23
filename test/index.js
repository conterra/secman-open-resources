const { assert } = require("chai");
const validate = require("./validate");

describe("server-config.schema.json", function () {
    it("should accept a config with multiple services", function() {
        assert.isTrue(validate(require("./json/server-config/services-multiple.json")))
    });
    it("should not accept a file without server config", function() {
        assert.isFalse(validate(require("./json/server-config/server-missing.json")))
    });
    it("should not accept an empty server config", function() {
        assert.isFalse(validate(require("./json/server-config/server-empty.json")))
    });
    it("should not accept an empty hostname ", function() {
        assert.isFalse(validate(require("./json/server-config/hostname-empty.json")))
    });
    it("should not accept a hostname ending with a /", function () {
        assert.isFalse(validate(require("./json/server-config/hostname-ending-with-slash.json")));
    });
    it("should accept a hostname with environmental variable", function () {
        assert.isTrue(validate(require("./json/server-config/hostname-env.json")));
    });
    it("should accept a hostname with http", function () {
        assert.isTrue(validate(require("./json/server-config/hostname-http.json")));
    });
    it("should accept a hostname with https", function () {
        assert.isTrue(validate(require("./json/server-config/hostname-https.json")));
    });
    it("should not accept localhost as hostname", function () {
        assert.isFalse(validate(require("./json/server-config/hostname-localhost.json")));
    });
    it("should accept a hostname with a port", function () {
        assert.isTrue(validate(require("./json/server-config/hostname-port.json")));
    });
    it("should not accept a hostname without a scheme", function() {
        assert.isFalse(validate(require("./json/server-config/hostname-no-scheme.json")))
    });
    it("should not accept a hostname with a path ", function() {
        assert.isFalse(validate(require("./json/server-config/hostname-path.json")))
    });
    it("should not accept a abc as hostname", function() {
        assert.isFalse(validate(require("./json/server-config/hostname-string.json")))
    });

    it("should accept serverAuth basic", function () {
        assert.isTrue(validate(require("./json/server-config/server-auth-basic.json")));
    });
    it("should not accept serverAuth basic with missing password", function () {
        assert.isFalse(validate(require("./json/server-config/server-auth-basic-missing-password.json")));
    });
    it("should not accept serverAuth basic with missing attributes", function () {
        assert.isFalse(validate(require("./json/server-config/server-auth-basic-missing-password-username.json")));
    });
    it("should not accept serverAuth basic with additional attributes", function () {
        assert.isFalse(validate(require("./json/server-config/server-auth-basic-additional-property.json")));
    });
    it("should not accept empty serverAuth", function () {
        assert.isFalse(validate(require("./json/server-config/server-auth-empty.json")));
    });
    it("should not accept serverAuth with invalid type", function () {
        assert.isFalse(validate(require("./json/server-config/server-auth-invalid-type.json")));
    });
    it("should accept serverAuth type none", function () {
        assert.isTrue(validate(require("./json/server-config/server-auth-none.json")));
    });
    it("should not accept serverAuth type none with username", function () {
        assert.isFalse(validate(require("./json/server-config/server-auth-none-with-username.json")));
    });
    // it("should accept ", function() {
    //     assert.isTrue(validate(require("./json/server-config")))
    // });





    it("should not accept an empty services array", function () {
        assert.isFalse(validate(require("./json/server-config/services-empty-array.json")));
    });
    it("should not accept an empty services object", function () {
        assert.isFalse(validate(require("./json/server-config/services-empty-item.json")));
    });
    it("should not accept an empty service path", function () {
        assert.isFalse(validate(require("./json/server-config/services-path-empty.json")));
    });
    it("should not accept services with a path not starting with an /", function () {
        assert.isFalse(validate(require("./json/server-config/services-path-no-leading-slash.json")));
    });
    it("should accept a service path with fileending", function () {
        assert.isTrue(validate(require("./json/server-config/services-path-with-fileending.json")));
    });
    it("should not accept a service path with a query", function () {
        assert.isFalse(validate(require("./json/server-config/services-path-with-query.json")));
    });
    it("should accept a valid service path", function () {
        assert.isTrue(validate(require("./json/server-config/services-path.json")));
    });
    it("should not accept an empty policy-ref", function () {
        assert.isFalse(validate(require("./json/server-config/services-policy-ref-empty.json")));
    });
    it("should accept a valid policy-ref", function () {
        assert.isTrue(validate(require("./json/server-config/services-policy-ref.json")));
    });
    it("should accept service type FORWARD", function () {
        assert.isTrue(validate(require("./json/server-config/services-type-forward-without-policy-ref.json")));
    });
    it("should accept service type FORWARD with policy-ref", function () {
        assert.isTrue(validate(require("./json/server-config/services-type-forward-with-policy-ref.json")));
    });
    it("should not accept an invalid service type", function () {
        assert.isFalse(validate(require("./json/server-config/services-type-invalid.json")));
    });
    it("should accept service type WFS", function () {
        assert.isTrue(validate(require("./json/server-config/services-type-wfs.json")));
    });
    it("should accept service type WMS", function () {
        assert.isTrue(validate(require("./json/server-config/services-type-wms.json")));
    });
});
