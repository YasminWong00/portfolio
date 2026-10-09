import { profile } from "../../data/profile";
import { buildResumePdf } from "../../lib/resume-pdf";

export function GET() {
  const pdf = buildResumePdf();
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${profile.resumeFile}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
