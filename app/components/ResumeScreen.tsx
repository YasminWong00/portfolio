"use client";

import Link from "next/link";
import { useEffect } from "react";
import { profile } from "../data/profile";
import { ResumeDocument } from "./ResumeDocument";

export function ResumeScreen() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("export") !== "1") return;
    const timer = window.setTimeout(() => window.print(), 350);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="resume-screen">
      <div className="resume-toolbar">
        <Link href="/">Back to desktop</Link>
        <div className="preview-actions">
          <a href="/files/resume" download={profile.resumeFile}>
            Download PDF
          </a>
          <button type="button" onClick={() => window.print()}>
            Print
          </button>
        </div>
      </div>
      <ResumeDocument />
    </main>
  );
}
