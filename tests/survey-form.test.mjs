import assert from "node:assert/strict";
import { test } from "node:test";
import {
  audienceOptions,
  materialConcernOptions,
  OTHER_OPTION,
  priorityOptions,
  problemOptions,
  proofOptions,
  toGoogleFormBody,
  treeConcernOptions,
} from "../lib/survey-form.ts";

test("maps every BIOPAVE field to the supplied Google Form entry", () => {
  const values = toGoogleFormBody({
    email: "sample@example.com",
    name: "Mẫu kiểm tra",
    phone: "0000000000",
    audience: audienceOptions[0],
    problems: [problemOptions[0], problemOptions[1], OTHER_OPTION],
    problemsOther: "Khó khăn khác",
    priority: priorityOptions[2],
    treeConcern: OTHER_OPTION,
    treeConcernOther: "E ngại khác",
    materialConcerns: [materialConcernOptions[0], OTHER_OPTION],
    materialConcernsOther: "Băn khoăn khác",
    proof: proofOptions[1],
    proofOther: "",
    consent: true,
    website: "",
  });

  assert.equal(values.get("emailAddress"), "sample@example.com");
  assert.equal(values.get("entry.273687989"), "Mẫu kiểm tra");
  assert.equal(values.get("entry.997652286"), "0000000000");
  assert.equal(values.get("entry.1454477984"), audienceOptions[0]);
  assert.deepEqual(values.getAll("entry.1400762379"), [problemOptions[0], problemOptions[1], OTHER_OPTION]);
  assert.equal(values.get("entry.1400762379.other_option_response"), "Khó khăn khác");
  assert.equal(values.get("entry.2066649427"), priorityOptions[2]);
  assert.equal(values.get("entry.1558420696"), OTHER_OPTION);
  assert.equal(values.get("entry.1558420696.other_option_response"), "E ngại khác");
  assert.deepEqual(values.getAll("entry.70805562"), [materialConcernOptions[0], OTHER_OPTION]);
  assert.equal(values.get("entry.70805562.other_option_response"), "Băn khoăn khác");
  assert.equal(values.get("entry.330441103"), proofOptions[1]);
  assert.equal(values.has("entry.330441103.other_option_response"), false);
});
