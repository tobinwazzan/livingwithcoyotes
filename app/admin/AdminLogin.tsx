"use client";

import { useFormState } from "react-dom";
import { adminLogin, type LoginState } from "./actions";

export default function AdminLogin() {
  const [state, action] = useFormState(adminLogin, {} as LoginState);
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6">
      <form action={action} className="w-full max-w-sm rounded-xl border border-line/20 bg-card p-6 shadow-sm">
        <h1 className="text-lg font-bold text-heading">CCC Admin</h1>
        <p className="mt-1 text-sm text-ink/70">Enter the admin password to continue.</p>
        <input
          type="password"
          name="password"
          autoFocus
          placeholder="Password"
          className="mt-4 w-full rounded-lg border border-line/20 bg-card px-4 py-3 outline-none focus:border-clay focus:ring-2 focus:ring-clay/30"
        />
        {state.error && <p className="mt-2 text-sm text-clay" role="alert">{state.error}</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-clay px-6 py-3 font-semibold text-sand transition hover:bg-bark"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
