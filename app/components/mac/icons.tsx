import { useId } from "react";
import type { AppId } from "./state";

type IconProps = { size?: number };

export function FinderIcon({ size = 48 }: IconProps) {
  const clip = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <rect width="64" height="64" rx="14" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width="32" height="64" fill="#6ec2ff" />
        <rect x="32" width="32" height="64" fill="#1d6fe0" />
      </g>
      <ellipse cx="24" cy="28" rx="3.2" ry="4.2" fill="#fff" />
      <ellipse cx="40" cy="28" rx="3.2" ry="4.2" fill="#fff" />
      <path
        d="M22 40c3.6 5.2 16.4 5.2 20 0"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SafariIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#f7f7f8" />
      <circle cx="32" cy="32" r="22" fill="#0a84ff" />
      <circle cx="32" cy="32" r="17" fill="#f4fbff" />
      <polygon points="32,14 37,33 32,30" fill="#ff5a5f" />
      <polygon points="32,50 27,31 32,34" fill="#ffffff" />
      <polygon points="32,14 27,33 32,30" fill="#ffd1d1" />
      <polygon points="32,50 37,31 32,34" fill="#8eb6ff" />
      <circle cx="32" cy="32" r="2.4" fill="#1c1c1e" />
    </svg>
  );
}

export function PreviewIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#ececef" />
      <rect x="12" y="8" width="40" height="48" rx="5" fill="#fff" />
      <rect x="16" y="13" width="32" height="20" rx="2" fill="#8ecbff" />
      <circle cx="38" cy="20" r="3.2" fill="#ffe08a" />
      <path d="M16 33l8-7 6 5 7-8 11 10v2H16z" fill="#63c08a" />
      <rect x="16" y="40" width="22" height="3" rx="1.5" fill="#d9d9de" />
      <rect x="16" y="46" width="14" height="3" rx="1.5" fill="#ececf1" />
    </svg>
  );
}

export function MailIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#1a8cff" />
      <rect x="10" y="16" width="44" height="32" rx="5" fill="#fff" />
      <path
        d="M12 19l20 15L52 19"
        fill="none"
        stroke="#1a8cff"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PdfIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M16 6h22l14 14v36a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z"
        fill="#fff"
      />
      <path d="M38 6v12a2 2 0 0 0 2 2h12" fill="#e4e4ea" />
      <rect x="14" y="40" width="28" height="14" rx="3" fill="#ff3b30" />
      <text
        x="28"
        y="50.5"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="9"
        fontWeight="700"
        fill="#fff"
      >
        PDF
      </text>
    </svg>
  );
}

export function FolderIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect x="6" y="22" width="52" height="32" rx="6" fill="#4da3ff" />
      <path d="M6 26a6 6 0 0 1 6-6h12l4 5h22a6 6 0 0 1 6 6v3H6z" fill="#8ec8ff" />
    </svg>
  );
}

export function HtmlIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M16 6h22l14 14v36a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z"
        fill="#fff"
      />
      <path d="M38 6v12a2 2 0 0 0 2 2h12" fill="#d6e8ff" />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="11"
        fontWeight="700"
        fill="#0a84ff"
      >
        HTML
      </text>
    </svg>
  );
}

export function LinkedInIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0a66c2" />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="30"
        fontWeight="700"
        fill="#fff"
      >
        in
      </text>
    </svg>
  );
}

export function AppGlyph({
  id,
  size = 28,
}: {
  id: AppId | "linkedin" | "pdf" | "folder" | "html";
  size?: number;
}) {
  switch (id) {
    case "finder":
      return <FinderIcon size={size} />;
    case "safari":
      return <SafariIcon size={size} />;
    case "preview":
      return <PreviewIcon size={size} />;
    case "mail":
      return <MailIcon size={size} />;
    case "linkedin":
      return <LinkedInIcon size={size} />;
    case "pdf":
      return <PdfIcon size={size} />;
    case "folder":
      return <FolderIcon size={size} />;
    case "html":
      return <HtmlIcon size={size} />;
  }
}
