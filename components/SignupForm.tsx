"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { signup, type SignupState } from "@/app/actions";

const initialState: SignupState = { status: "idle", message: "" };

const APPS = [
  "Ring Neighbors",
  "Nextdoor",
  "Citizen",
  "Facebook groups",
  "iNaturalist",
  "Coyote Cacher",
  "PawBoost",
  "Petco Love Lost",
  "Other",
  "None",
];

const inputCls =
  "w-full rounded-lg border border-bark/20 bg-white/80 px-4 py-3 outline-none focus:border-clay focus:ring-2 focus:ring-clay/30";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark disabled:opacity-60"
    >
      {pending ? "Joining…" : "Join the Council"}
    </button>
  );
}

export default function SignupForm() {
  const [state, formAction] = useFormState(signup, initialState);
  const [role, setRole] = useState("");

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-moss/30 bg-white/60 p-6 text-center">
        <p className="text-lg font-semibold text-moss">Welcome aboard.</p>
        <p className="mt-1 text-bark/80">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* Role first — it drives the rest of the form */}
      <div>
        <label className="mb-1 block text-sm font-medium text-bark/80">
          I'm joining as <span className="text-clay">*</span>
        </label>
        <select
          name="role"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputCls + " text-bark/90"}
        >
          <option value="" disabled>
            Choose one …
          </option>
          <option value="resident">A resident / citizen</option>
          <option value="municipality">A municipality / city official</option>
          <option value="expert">An expert / professional</option>
          <option value="other">Other / just interested</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input type="text" name="full_name" required placeholder="Full name *" aria-label="Full name" className={inputCls} />
        <input type="tel" name="phone" required placeholder="Phone number *" aria-label="Phone number" className={inputCls} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="email"
          name="email"
          required
          placeholder={role === "municipality" ? "Official government email *" : "Email *"}
          aria-label="Email address"
          className={inputCls}
        />
        <input type="text" name="city" required placeholder="City *" aria-label="City of residence" className={inputCls} />
      </div>

      {role === "municipality" && (
        <p className="-mt-1 text-xs text-bark/60">
          Use your official city/government email (e.g., name@cityofirvine.org) so we can verify your role.
        </p>
      )}

      {role === "expert" && (
        <input
          type="url"
          name="linkedin"
          required
          placeholder="LinkedIn profile URL * (linkedin.com/in/…)"
          aria-label="LinkedIn profile URL"
          className={inputCls}
        />
      )}

      {/* Apps — select all that apply */}
      <fieldset className="rounded-lg border border-bark/15 bg-white/40 p-4">
        <legend className="px-1 text-sm font-medium text-bark/80">
          Which of these do you use? (select all that apply)
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          {APPS.map((app) => (
            <label key={app} className="flex items-center gap-2 text-sm text-bark/80">
              <input type="checkbox" name="apps" value={app} className="h-4 w-4 accent-clay" />
              {app}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <SubmitButton />
        {state.status === "error" && (
          <p className="text-sm text-clay" role="alert">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
