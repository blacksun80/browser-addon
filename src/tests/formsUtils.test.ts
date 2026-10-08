// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { FormUtils } from "../page/formsUtils";

const logger = { debug: () => {} } as any;

describe("getFormFields", () => {
    it("treats a field with autocomplete=username as the username field", () => {
        document.body.innerHTML = `
            <form>
                <input id="search" type="text">
                <input id="input-username" type="email" autocomplete="username">
            </form>`;

        const result = new FormUtils(logger).getFormFields(document.forms[0], false, 50);

        expect(result.pwFields).toEqual([]);
        expect(result.otherFields[result.actualUsernameIndex].DOMelement.id).toBe("input-username");
    });
});
