"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createComment } from "./actions";

export default function CommentComposer({ postId }: { postId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const res = await createComment(postId, body);
    setBusy(false);
    if (res.ok) {
      setBody("");
      router.refresh();
    } else {
      setMsg(res.message ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line/15 bg-card/60 p-4">
      <label htmlFor="comment-body" className="block text-sm font-semibold text-heading">
        Add a reply
      </label>
      <textarea
        id="comment-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        placeholder="Reply with care…"
        className="mt-2 w-full rounded-lg border border-line/30 bg-surface px-4 py-3 text-ink placeholder:text-ink/40 focus:border-clay focus:outline-none"
      />
      {msg && <p className="mt-2 text-sm text-clay">{msg}</p>}
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={busy || body.trim().length < 1}
          className="rounded-lg bg-clay px-5 py-2.5 font-semibold text-sand transition hover:bg-bark disabled:opacity-60"
        >
          {busy ? "Replying…" : "Reply"}
        </button>
      </div>
    </form>
  );
}
