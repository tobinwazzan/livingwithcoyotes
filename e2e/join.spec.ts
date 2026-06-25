import { test, expect, type Page } from "@playwright/test";

const tag = () => `zz-e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

// Fill the visible Phase-1 fields the way a real person (or autofill) would.
async function fillContact(page: Page, { email }: { email: string }) {
  await page.getByRole("combobox").selectOption("Resident / citizen");
  await page.getByRole("textbox", { name: "Full name" }).fill("ZZ E2E Tester");
  await page.getByRole("textbox", { name: "Phone number" }).fill("9495550100");
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "City of residence" }).fill("Irvine");
}

test.describe("join funnel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/join");
  });

  // THE REGRESSION GUARD. The launch bug was a honeypot named "company" — a
  // browser-autofill magnet — so autofill filled it and the server silently
  // dropped real submissions. This fails if ANY hidden input is named something
  // autofill targets, so the bug can never come back unnoticed.
  test("no hidden field uses a browser-autofill keyword", async ({ page }) => {
    // Cover all the ways a honeypot can hide: aria-hidden, tabindex=-1, AND
    // type=hidden — so reintroducing the bug in any of those forms is caught.
    // Exclude our legitimate hidden attribution fields by name.
    const known = new Set(["source", "referrer", "meta"]);
    const hiddenNames: string[] = (
      await page
        .locator('input[aria-hidden="true"], input[tabindex="-1"], input[type="hidden"]')
        .evaluateAll((els) => els.map((e) => (e as HTMLInputElement).name.toLowerCase()))
    ).filter((n) => !known.has(n));

    const autofillMagnets = [
      "company", "organization", "org", "name", "fname", "firstname", "first-name",
      "lname", "lastname", "last-name", "email", "tel", "phone", "address",
      "address-line1", "street", "city", "country", "postal-code", "zip",
      "cc-name", "cc-number", "username", "given-name", "family-name",
    ];
    for (const n of hiddenNames) {
      expect(autofillMagnets, `hidden input named "${n}" is an autofill magnet`).not.toContain(n);
    }
  });

  // The happy path must reach the payment step — runs on desktop AND mobile.
  test("a resident reaches the payment step", async ({ page }) => {
    await fillContact(page, { email: tag() });
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByText("You're on the list")).toBeVisible();
    await expect(page.getByRole("button", { name: /Card/ })).toBeVisible();
  });

  // Server-side validation must SURFACE an error — never silently drop.
  test("municipality with a personal email is rejected with a visible error", async ({ page }) => {
    await page.getByRole("combobox").selectOption("Municipality / city official");
    await page.getByRole("textbox", { name: "Full name" }).fill("ZZ Muni Tester");
    await page.getByRole("textbox", { name: "Phone number" }).fill("9495550101");
    await page.getByRole("textbox", { name: "Email address" }).fill("someone@gmail.com");
    await page.getByRole("textbox", { name: "City of residence" }).fill("Irvine");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByText(/official government email/i)).toBeVisible();
    await expect(page.getByText("You're on the list")).toHaveCount(0);
  });
});
