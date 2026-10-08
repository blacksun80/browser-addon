// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { findInputsInOpenShadowRoots, findOpenShadowRoots } from "../page/shadowDom";

function addHost(parent: Node, mode: ShadowRootMode, innerHTML: string) {
    const host = document.createElement("div");
    parent.appendChild(host);
    const shadowRoot = host.attachShadow({ mode });
    shadowRoot.innerHTML = innerHTML;
    return { host, shadowRoot };
}

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("findInputsInOpenShadowRoots", () => {
    it("finds nothing when there are no shadow roots", () => {
        document.body.innerHTML = "<form><input type='text'></form>";
        expect(findInputsInOpenShadowRoots(document)).toEqual([]);
    });

    it("finds a password field in an open shadow root inside a form", () => {
        document.body.innerHTML = "<form><input id='username' type='email'></form>";
        const { shadowRoot } = addHost(
            document.querySelector("form"),
            "open",
            "<input id='password' type='password'>"
        );

        const inputs = findInputsInOpenShadowRoots(document);

        expect(inputs).toEqual([shadowRoot.getElementById("password")]);
        expect(inputs[0].form).toBeNull();
    });

    it("finds fields in nested open shadow roots", () => {
        const outer = addHost(document.body, "open", "<input id='outer'>");
        const inner = addHost(outer.shadowRoot, "open", "<input id='inner' type='password'>");

        const ids = findInputsInOpenShadowRoots(document).map(input => input.id);

        expect(ids).toEqual(["outer", "inner"]);
        expect(findOpenShadowRoots(document)).toEqual([outer.shadowRoot, inner.shadowRoot]);
    });

    it("ignores closed shadow roots", () => {
        addHost(document.body, "closed", "<input type='password'>");
        expect(findInputsInOpenShadowRoots(document)).toEqual([]);
    });

    it("includes the shadow root of the starting element itself", () => {
        const { host, shadowRoot } = addHost(document.body, "open", "<input type='password'>");
        expect(findOpenShadowRoots(host)).toEqual([shadowRoot]);
    });
});
