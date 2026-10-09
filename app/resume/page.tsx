import type { Metadata } from "next";
import { ResumeScreen } from "../components/ResumeScreen";

export const metadata: Metadata = {
  title: "Resume — Yasmin Wong",
  description:
    "Resume of Yasmin Wong, frontend developer. UI/UX, backend, automation, and AI.",
};

export default function ResumePage() {
  return <ResumeScreen />;
}
