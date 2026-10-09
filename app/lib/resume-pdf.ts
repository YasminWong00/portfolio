import { education, experience, profile, skillGroups } from "../data/profile";

function ascii(text: string) {
  return text
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[—–]/g, "-")
    .replace(/•/g, "-")
    .replace(/[^\x20-\x7E]/g, "");
}

function pdfEscape(text: string) {
  return ascii(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrap(text: string, size: number, maxWidth: number) {
  const maxChars = Math.max(12, Math.floor(maxWidth / (size * 0.52)));
  const words = ascii(text).split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function buildResumePdf() {
  const commands: string[] = [];
  let y = 800;
  const left = 48;
  const right = 547;
  const width = right - left;

  const text = (
    value: string,
    x: number,
    top: number,
    size: number,
    font: "F1" | "F2",
    color = "0.11 0.11 0.12",
  ) => {
    commands.push(
      `BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x} ${top} Tm (${pdfEscape(value)}) Tj ET`,
    );
  };

  const rule = (top: number) => {
    commands.push(`0.82 0.82 0.86 RG 0.7 w ${left} ${top} m ${right} ${top} l S`);
  };

  text(profile.name, left, y, 22, "F2");
  y -= 18;
  text(profile.role, left, y, 11, "F1", "0.0 0.38 0.78");
  y -= 16;
  text(
    `${profile.location}  |  ${profile.email}  |  ${profile.linkedinLabel}`,
    left,
    y,
    9,
    "F1",
    "0.28 0.28 0.32",
  );
  y -= 12;
  rule(y);
  y -= 22;

  const section = (label: string) => {
    text(label.toUpperCase(), left, y, 10, "F2", "0.2 0.2 0.24");
    y -= 6;
    rule(y);
    y -= 16;
  };

  const paragraph = (value: string, size = 10, leading = 14) => {
    for (const line of wrap(value, size, width)) {
      text(line, left, y, size, "F1");
      y -= leading;
    }
  };

  section("Summary");
  paragraph(profile.summary);
  y -= 8;

  section("Experience");
  for (const job of experience) {
    text(job.role, left, y, 11, "F2");
    text(job.dates, right - job.dates.length * 5.4, y, 9, "F1", "0.28 0.28 0.32");
    y -= 14;
    text(`${job.company}, ${job.location}`, left, y, 10, "F1", "0.18 0.32 0.55");
    y -= 14;
    for (const point of job.points) {
      const lines = wrap(point, 10, width - 14);
      lines.forEach((line, index) => {
        text(index === 0 ? `- ${line}` : `  ${line}`, left, y, 10, "F1");
        y -= 13;
      });
    }
    y -= 8;
  }

  section("Education");
  text(education.degree, left, y, 11, "F2");
  y -= 14;
  text(education.school, left, y, 10, "F1", "0.18 0.32 0.55");
  y -= 13;
  text(`${education.dates}  |  ${education.note}`, left, y, 10, "F1", "0.28 0.28 0.32");
  y -= 20;

  section("Skills");
  for (const group of skillGroups) {
    paragraph(`${group.label}: ${group.value}`, 10, 13);
    y -= 2;
  }

  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Count 1 /Kids [3 0 R] >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  ];

  let body = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(body.length);
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = body.length;
  body += `xref\n0 ${objects.length + 1}\n`;
  body += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i += 1) {
    body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(body);
}
