import { ResumeDocument } from "../ResumeDocument";
import {
  coreSkills,
  focus,
  mailto,
  moreSkills,
  profile,
} from "../../data/profile";
import { AppGlyph } from "./icons";
import type { AppId } from "./state";

export function SafariView({ onOpen }: { onOpen: (id: AppId) => void }) {
  return (
    <div className="safari-view">
      <div className="safari-toolbar">
        <div className="safari-address">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <rect
              x="3"
              y="7"
              width="10"
              height="7"
              rx="1.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
          <span>file:///Users/yasmin/Portfolio/Welcome.html</span>
        </div>
      </div>
      <div className="safari-scroll">
        <div className="safari-sheet">
          <header className="hero">
            <div className="avatar" aria-hidden="true">
              {profile.initials}
            </div>
            <div className="hero-copy">
              <h1>{profile.name}</h1>
              <p className="hero-role">{profile.role}</p>
              <p className="hero-meta">
                {profile.location}
                <span aria-hidden="true"> · </span>
                {profile.educationShort}
              </p>
            </div>
          </header>

          <p className="welcome">{profile.welcome}</p>
          <p className="now">{profile.now}</p>

          <div className="hero-actions">
            <a className="action" href={mailto}>
              Email
            </a>
            <a
              className="action"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <button className="action" type="button" onClick={() => onOpen("preview")}>
              Resume
            </button>
          </div>

          <section className="block">
            <h2>Selected work</h2>
            <div className="work-grid">
              {focus.map((item, index) => (
                <article className="work-card" key={item.title}>
                  <span>{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="block">
            <h2>Core skills</h2>
            <ul className="skill-row">
              {coreSkills.map((skill) => (
                <li key={skill.label} className={`skill tone-${skill.tone}`}>
                  {skill.label}
                </li>
              ))}
            </ul>
            <ul className="more-skills">
              {moreSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      <footer className="safari-status">
        <span>Done</span>
        <span>{profile.location}</span>
      </footer>
    </div>
  );
}

export function PreviewView() {
  return (
    <div className="preview-view">
      <div className="preview-toolbar">
        <span>{profile.resumeFile}</span>
        <div className="preview-actions">
          <a href="/files/resume" download={profile.resumeFile}>
            Download
          </a>
          <a href="/resume?export=1" target="_blank" rel="noreferrer">
            Print
          </a>
        </div>
      </div>
      <div className="preview-canvas">
        <ResumeDocument />
      </div>
    </div>
  );
}

const finderFiles: { name: string; id: AppId; glyph: "html" | "pdf" | "mail" }[] = [
  { name: "Welcome.html", id: "safari", glyph: "html" },
  { name: "Resume.pdf", id: "preview", glyph: "pdf" },
  { name: "Hello.eml", id: "mail", glyph: "mail" },
];

export function FinderView({ onOpen }: { onOpen: (id: AppId) => void }) {
  return (
    <div className="finder-view">
      <aside>
        <p>Favorites</p>
        <button type="button" className="is-on">
          <AppGlyph id="folder" size={18} />
          Portfolio
        </button>
      </aside>
      <div className="finder-main">
        <div className="finder-path">Macintosh HD / Users / yasmin / Portfolio</div>
        <div className="finder-grid">
          {finderFiles.map((file) => (
            <button key={file.name} type="button" onClick={() => onOpen(file.id)}>
              <AppGlyph id={file.glyph} size={52} />
              <span>{file.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MailView() {
  return (
    <div className="mail-view">
      <aside>
        <p>Mailboxes</p>
        <button type="button" className="is-on">
          Inbox
          <span>1</span>
        </button>
      </aside>
      <div className="mail-main">
        <header>
          <h2>Say hello</h2>
          <p>
            From <strong>{profile.name}</strong>
            <span> · </span>
            <a href={mailto}>{profile.email}</a>
          </p>
        </header>
        <article>
          <p>Thanks for opening Mail.</p>
          <p>
            I&apos;m a frontend developer who also works on the backend, UI/UX, and
            automation, and I&apos;m learning forward into AI. If you want to talk
            about a product, a role, or a collaboration, write to me or find me on
            LinkedIn.
          </p>
          <div className="mail-actions">
            <a className="action solid" href={mailto}>
              Email Yasmin
            </a>
            <a
              className="action"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
