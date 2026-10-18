import test from "node:test";
import assert from "node:assert/strict";
import { bookingSchema, bookingNotificationNotes } from "../src/lib/booking-schema.ts";
import {
  captureCampaignAttribution,
  parseCampaignAttribution,
} from "../src/lib/campaign-attribution.ts";

const adultRequest = {
  type: "training",
  name: "QA adult",
  email: "qa@example.invalid",
  athlete_age_band: "8-9",
};

test("evaluation eligibility is required server-side without collecting a birth date", () => {
  const valid = bookingSchema.parse(adultRequest);
  assert.equal(valid.athlete_age_band, "8-9");
  assert.equal(
    bookingSchema.safeParse({ ...adultRequest, athlete_age_band: undefined }).success,
    false,
  );
  assert.equal(
    bookingSchema.safeParse({ ...adultRequest, athlete_age_band: "under-8" }).success,
    false,
  );
  assert.equal(bookingSchema.safeParse({ ...adultRequest, email: "invalid" }).success, false);
  assert.equal(
    bookingSchema.safeParse({ ...adultRequest, utm_source: "x".repeat(121) }).success,
    false,
  );
  assert.equal(
    bookingSchema.safeParse({ type: "wellness", name: "QA adult", email: "qa@example.invalid" })
      .success,
    true,
  );
  assert.equal(bookingNotificationNotes(valid), "Athlete age group: 8–9 years");
});

test("campaign labels retain source, reject unrelated query fields, and bound payload length", () => {
  assert.deepEqual(
    parseCampaignAttribution(
      "?utm_source=meta&utm_medium=paid_social&utm_campaign=evaluation&email=private%40example.invalid",
      "/evaluation",
    ),
    {
      utm_source: "meta",
      utm_medium: "paid_social",
      utm_campaign: "evaluation",
      landing_path: "/evaluation",
    },
  );
  assert.equal(
    parseCampaignAttribution("?utm_content=" + "x".repeat(200), "/evaluation").utm_content?.length,
    120,
  );
});

test("first campaign survives navigation in the same tab and ignores later replacement tags", () => {
  const storage = new Map<string, string>();
  const mock = {
    location: { search: "?utm_source=meta&utm_campaign=evaluation", pathname: "/evaluation" },
    sessionStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  };
  Object.defineProperty(globalThis, "window", { configurable: true, value: mock });
  try {
    captureCampaignAttribution();
    mock.location = { search: "?utm_source=other", pathname: "/programs" };
    assert.deepEqual(captureCampaignAttribution(), {
      utm_source: "meta",
      utm_campaign: "evaluation",
      landing_path: "/evaluation",
    });
    assert.equal(
      [...storage.values()].some((value) => value.includes("?")),
      false,
    );
  } finally {
    Reflect.deleteProperty(globalThis, "window");
  }
});

test("restricted storage does not block a direct evaluation request", () => {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: { search: "?utm_source=referral", pathname: "/evaluation" },
      get sessionStorage() {
        throw new Error("Storage disabled");
      },
    },
  });
  try {
    assert.deepEqual(captureCampaignAttribution(), {
      utm_source: "referral",
      landing_path: "/evaluation",
    });
  } finally {
    Reflect.deleteProperty(globalThis, "window");
  }
  assert.deepEqual(captureCampaignAttribution(), {});
});
