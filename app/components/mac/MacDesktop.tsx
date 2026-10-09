"use client";

import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { mailto, profile } from "../../data/profile";
import { AppGlyph } from "./icons";
import {
  type AppId,
  type MacAction,
  initialMacState,
  macReducer,
} from "./state";
import { FinderView, MailView, PreviewView, SafariView } from "./views";

const APP_MENU: Record<AppId, string> = {
  finder: "Finder",
  safari: "Safari",
  preview: "Preview",
  mail: "Mail",
};

const WINDOW_TITLE: Record<AppId, string> = {
  finder: "Portfolio",
  safari: "Welcome — Yasmin Wong",
  preview: profile.resumeFile,
  mail: "Mail",
};

const OFFSET: Record<AppId, number> = {
  safari: 0,
  preview: 1,
  finder: 2,
  mail: 1,
};

type Command = {
  key: string;
  label: string;
  detail: string;
  keywords: string;
  run: () => void;
  glyph: AppId | "linkedin" | "pdf";
};

function formatClock(date: Date) {
  const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return {
    full: `${weekday} ${date.getDate()} ${month}  ${time}`,
    short: time,
  };
}

export function MacDesktop() {
  const [state, dispatch] = useReducer(macReducer, initialMacState);
  const [now, setNow] = useState<Date | null>(null);
  const [bouncing, setBouncing] = useState<AppId | null>(null);
  const [spotIndex, setSpotIndex] = useState(0);
  const desktopRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLInputElement>(null);
  const dragFrame = useRef(0);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 10000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (state.spotlight) spotRef.current?.focus();
  }, [state.spotlight]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (state.about) dispatch({ type: "about", open: false });
        else if (state.help) dispatch({ type: "help", open: false });
        else if (state.spotlight || state.menu) dispatch({ type: "dismiss-popups" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.about, state.help, state.spotlight, state.menu]);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          ".mac-menu, .mac-spotlight, .mac-spot-btn, .mac-dialog, .mac-dialog-backdrop",
        )
      ) {
        return;
      }
      if (state.menu || state.spotlight) dispatch({ type: "dismiss-popups" });
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, [state.menu, state.spotlight]);

  const openApp = (id: AppId) => {
    setBouncing(id);
    window.setTimeout(() => setBouncing((current) => (current === id ? null : current)), 700);
    dispatch({ type: "open", id });
  };

  const commands: Command[] = [
    {
      key: "about",
      label: "About Me",
      detail: "Open in Safari",
      keywords: "about welcome portfolio yasmin safari",
      glyph: "safari",
      run: () => openApp("safari"),
    },
    {
      key: "projects",
      label: "Projects",
      detail: "Open in Finder",
      keywords: "projects work finder files",
      glyph: "finder",
      run: () => openApp("finder"),
    },
    {
      key: "resume",
      label: "Resume",
      detail: profile.resumeFile,
      keywords: "resume pdf cv preview file",
      glyph: "preview",
      run: () => openApp("preview"),
    },
    {
      key: "mail",
      label: "Mail",
      detail: profile.email,
      keywords: "mail email contact hello",
      glyph: "mail",
      run: () => openApp("mail"),
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      detail: "Open profile",
      keywords: "linkedin social",
      glyph: "linkedin",
      run: () => window.open(profile.linkedin, "_blank", "noopener,noreferrer"),
    },
    {
      key: "download",
      label: "Download resume",
      detail: profile.resumeFile,
      keywords: "download pdf resume file export",
      glyph: "pdf",
      run: () => {
        const link = document.createElement("a");
        link.href = "/files/resume";
        link.download = profile.resumeFile;
        link.click();
      },
    },
  ];

  const query = state.query.trim().toLowerCase();
  const results = commands.filter((command) => {
    if (!query) return true;
    return `${command.label} ${command.detail} ${command.keywords}`
      .toLowerCase()
      .includes(query);
  });
  const activeIndex = Math.min(spotIndex, Math.max(results.length - 1, 0));

  const front = state.front;
  const appName = front ? APP_MENU[front] : "Finder";

  const runCommand = (command: Command | undefined) => {
    if (!command) return;
    dispatch({ type: "spotlight", open: false });
    command.run();
  };

  const onTitlePointerDown = (event: ReactPointerEvent<HTMLElement>, id: AppId) => {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest(".mac-traffic")) return;
    const win = state.windows[id];
    if (win.zoomed) {
      dispatch({ type: "focus", id });
      return;
    }
    if (window.matchMedia("(max-width: 720px)").matches) {
      dispatch({ type: "focus", id });
      return;
    }
    const handle = event.currentTarget;
    const shell = handle.parentElement;
    const desk = desktopRef.current;
    if (!shell || !desk) return;
    const deskBox = desk.getBoundingClientRect();
    const shellBox = shell.getBoundingClientRect();
    const originX = shellBox.left - deskBox.left;
    const originY = shellBox.top - deskBox.top;
    const startX = event.clientX;
    const startY = event.clientY;
    let last = { x: originX, y: originY };
    dispatch({ type: "focus", id });

    const move = (ev: PointerEvent) => {
      const maxX = deskBox.width - 120;
      const maxY = deskBox.height - 96;
      last = {
        x: Math.min(maxX, Math.max(-shellBox.width + 180, originX + ev.clientX - startX)),
        y: Math.min(maxY, Math.max(32, originY + ev.clientY - startY)),
      };
      if (dragFrame.current) return;
      dragFrame.current = window.requestAnimationFrame(() => {
        dragFrame.current = 0;
        dispatch({ type: "move", id, x: last.x, y: last.y });
      });
    };
    const up = () => {
      if (dragFrame.current) {
        window.cancelAnimationFrame(dragFrame.current);
        dragFrame.current = 0;
      }
      dispatch({ type: "move", id, x: last.x, y: last.y });
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
    };
    handle.setPointerCapture(event.pointerId);
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
  };

  const menus = buildMenus(appName, front, dispatch);

  const clock = now ? formatClock(now) : null;

  return (
    <div
      className="mac-desktop"
      ref={desktopRef}
      onPointerDown={(event) => {
        const target = event.target as HTMLElement;
        if (
          target.closest(
            ".mac-window, .mac-dock, .mac-menubar, .mac-icons, .mac-spotlight, .mac-dialog, .mac-dialog-backdrop",
          )
        ) {
          return;
        }
        dispatch({ type: "desktop" });
      }}
    >
      <div className="mac-wallpaper" aria-hidden="true" />

      <header className="mac-menubar">
        <nav className="mac-menus" aria-label="Menu bar">
          <div className={`mac-menu ${state.menu === "apple" ? "is-open" : ""}`}>
            <button
              type="button"
              aria-label="Portfolio menu"
              aria-expanded={state.menu === "apple"}
              onClick={() => dispatch({ type: "menu", id: "apple" })}
            >
              <AppleMark />
            </button>
            {state.menu === "apple" ? (
              <div className="mac-dropdown" role="menu">
                <button type="button" role="menuitem" onClick={() => dispatch({ type: "about", open: true })}>
                  About This Portfolio
                </button>
              </div>
            ) : null}
          </div>
          {menus.map((menu) => (
            <div
              key={menu.id}
              className={`mac-menu ${menu.bold ? "is-app" : ""} ${menu.extra ? "mac-menu-extra" : ""} ${state.menu === menu.id ? "is-open" : ""}`}
            >
              <button
                type="button"
                aria-expanded={state.menu === menu.id}
                onClick={() => dispatch({ type: "menu", id: menu.id })}
              >
                {menu.label}
              </button>
              {state.menu === menu.id ? (
                <div className="mac-dropdown" role="menu">
                  {menu.items.map((item, index) =>
                    item.kind === "sep" ? (
                      <div key={`sep-${index}`} className="mac-sep" />
                    ) : (
                      <button
                        key={item.label}
                        type="button"
                        role="menuitem"
                        disabled={item.disabled}
                        onClick={item.action}
                      >
                        <span>{item.label}</span>
                        {item.hint ? <span className="mac-hint">{item.hint}</span> : null}
                      </button>
                    ),
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <div className="mac-status">
          <button
            type="button"
            className="mac-spot-btn"
            aria-label="Spotlight"
            aria-expanded={state.spotlight}
            onClick={() => {
              setSpotIndex(0);
              dispatch({ type: "spotlight", open: !state.spotlight });
            }}
          >
            <SearchMark />
          </button>
          <span className="mac-glyphs" aria-hidden="true">
            <WifiMark />
            <BatteryMark />
          </span>
          <time className="mac-clock" dateTime={now?.toISOString()}>
            <span className="mac-clock-long">{clock?.full ?? ""}</span>
            <span className="mac-clock-short">{clock?.short ?? ""}</span>
          </time>
        </div>
      </header>

      <div className="mac-icons">
        <button type="button" onClick={() => openApp("safari")}>
          <AppGlyph id="safari" size={52} />
          <span>About Me</span>
        </button>
        <button type="button" onClick={() => openApp("finder")}>
          <AppGlyph id="folder" size={52} />
          <span>Projects</span>
        </button>
        <button type="button" onClick={() => openApp("preview")}>
          <AppGlyph id="pdf" size={52} />
          <span>Resume.pdf</span>
        </button>
        <button type="button" onClick={() => openApp("mail")}>
          <AppGlyph id="mail" size={52} />
          <span>Mail</span>
        </button>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          <AppGlyph id="linkedin" size={52} />
          <span>LinkedIn</span>
        </a>
      </div>

      {(Object.keys(WINDOW_TITLE) as AppId[]).map((id) => {
        const win = state.windows[id];
        if (!win.open || win.minimized) return null;
        const placed = win.x !== null && win.y !== null && !win.zoomed;
        const stack = (Object.keys(WINDOW_TITLE) as AppId[])
          .filter((key) => state.windows[key].open && !state.windows[key].minimized)
          .sort((a, b) => state.windows[a].z - state.windows[b].z);
        return (
          <section
            key={id}
            className={`mac-window ${state.front === id ? "is-active" : ""} ${win.zoomed ? "is-zoomed" : ""} ${placed ? "" : "is-centered"}`}
            data-offset={OFFSET[id]}
            style={{
              zIndex: 12 + stack.indexOf(id),
              ...(placed ? { left: win.x ?? 0, top: win.y ?? 0, transform: "none" } : null),
            }}
            aria-label={WINDOW_TITLE[id]}
            onPointerDown={() => dispatch({ type: "focus", id })}
          >
            <header
              className="mac-titlebar"
              onPointerDown={(event) => onTitlePointerDown(event, id)}
              onDoubleClick={() => dispatch({ type: "zoom", id })}
            >
              <div className="mac-traffic" onPointerDown={(event) => event.stopPropagation()}>
                <button type="button" className="close" aria-label="Close" onClick={() => dispatch({ type: "close", id })}>
                  <span>×</span>
                </button>
                <button type="button" className="min" aria-label="Minimize" onClick={() => dispatch({ type: "minimize", id })}>
                  <span>–</span>
                </button>
                <button type="button" className="zoom" aria-label="Zoom" onClick={() => dispatch({ type: "zoom", id })}>
                  <span>+</span>
                </button>
              </div>
              <h2>{WINDOW_TITLE[id]}</h2>
            </header>
            <div className="mac-window-body">
              {id === "safari" ? <SafariView onOpen={openApp} /> : null}
              {id === "preview" ? <PreviewView /> : null}
              {id === "finder" ? <FinderView onOpen={openApp} /> : null}
              {id === "mail" ? <MailView /> : null}
            </div>
          </section>
        );
      })}

      <div className="mac-dock-wrap">
        <div className="mac-dock" role="toolbar" aria-label="Dock">
          <DockButton
            id="finder"
            label="Finder"
            bouncing={bouncing === "finder"}
            running={state.windows.finder.open}
            onClick={() => {
              setBouncing("finder");
              window.setTimeout(() => setBouncing((current) => (current === "finder" ? null : current)), 700);
              dispatch({ type: "dock", id: "finder" });
            }}
          />
          <DockButton
            id="safari"
            label="Safari"
            bouncing={bouncing === "safari"}
            running={state.windows.safari.open}
            onClick={() => {
              setBouncing("safari");
              window.setTimeout(() => setBouncing((current) => (current === "safari" ? null : current)), 700);
              dispatch({ type: "dock", id: "safari" });
            }}
          />
          <DockButton
            id="preview"
            label="Preview"
            bouncing={bouncing === "preview"}
            running={state.windows.preview.open}
            onClick={() => {
              setBouncing("preview");
              window.setTimeout(() => setBouncing((current) => (current === "preview" ? null : current)), 700);
              dispatch({ type: "dock", id: "preview" });
            }}
          />
          <DockButton
            id="mail"
            label="Mail"
            bouncing={bouncing === "mail"}
            running={state.windows.mail.open}
            onClick={() => {
              setBouncing("mail");
              window.setTimeout(() => setBouncing((current) => (current === "mail" ? null : current)), 700);
              dispatch({ type: "dock", id: "mail" });
            }}
          />
          <a
            className="mac-dock-item"
            data-label="LinkedIn"
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mac-dock-icon">
              <AppGlyph id="linkedin" size={52} />
            </span>
            <i className="mac-dock-dot is-off" />
          </a>
        </div>
      </div>

      {state.spotlight ? (
        <div className="mac-spotlight" role="dialog" aria-label="Spotlight">
          <input
            ref={spotRef}
            value={state.query}
            placeholder="Spotlight Search"
            aria-label="Spotlight Search"
            onChange={(event) => {
              setSpotIndex(0);
              dispatch({ type: "query", query: event.target.value });
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setSpotIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setSpotIndex((index) => Math.max(index - 1, 0));
              } else if (event.key === "Enter") {
                event.preventDefault();
                runCommand(results[activeIndex]);
              }
            }}
          />
          <ul>
            {results.length === 0 ? (
              <li className="mac-spot-empty">No results</li>
            ) : (
              results.map((command, index) => (
                <li key={command.key}>
                  <button
                    type="button"
                    className={index === activeIndex ? "is-on" : ""}
                    onMouseEnter={() => setSpotIndex(index)}
                    onClick={() => runCommand(command)}
                  >
                    <AppGlyph id={command.glyph} size={28} />
                    <span>
                      <strong>{command.label}</strong>
                      <small>{command.detail}</small>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}

      {state.about ? (
        <Dialog title="About This Portfolio" onClose={() => dispatch({ type: "about", open: false })}>
          <div className="about-mark">{profile.initials}</div>
          <h3>{profile.name}</h3>
          <p>{profile.role}</p>
          <p className="dialog-quiet">{profile.location}</p>
          <p>
            A Mac desktop for my portfolio. Safari is the introduction, Preview
            holds the resume, and Mail is how to reach me.
          </p>
          <p>
            <a href={mailto}>{profile.email}</a>
            <br />
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              {profile.linkedinLabel}
            </a>
          </p>
        </Dialog>
      ) : null}

      {state.help ? (
        <Dialog title="How to use this desktop" onClose={() => dispatch({ type: "help", open: false })}>
          <ul className="help-list">
            <li>Click a Dock icon or a file on the desktop to open it.</li>
            <li>Drag a window by its title bar. Double-click the title bar to zoom.</li>
            <li>Red closes, yellow minimizes, green zooms.</li>
            <li>Click the Dock icon of the front window to minimize it.</li>
            <li>The magnifying glass opens Spotlight. Search for resume, mail, or LinkedIn.</li>
          </ul>
        </Dialog>
      ) : null}
    </div>
  );
}

function DockButton({
  id,
  label,
  running,
  bouncing,
  onClick,
}: {
  id: AppId;
  label: string;
  running: boolean;
  bouncing: boolean;
  onClick: () => void;
}) {
  const [scale, setScale] = useState(1);
  return (
    <button
      type="button"
      className={`mac-dock-item ${bouncing ? "is-bouncing" : ""}`}
      data-label={label}
      onClick={onClick}
      onMouseEnter={() => setScale(1.28)}
      onMouseLeave={() => setScale(1)}
    >
      <span className="mac-dock-icon" style={{ transform: `scale(${scale})` }}>
        <AppGlyph id={id} size={52} />
      </span>
      {running ? <i className="mac-dock-dot" /> : <i className="mac-dock-dot is-off" />}
    </button>
  );
}

function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="mac-dialog-backdrop" onClick={onClose}>
      <div
        className="mac-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <h2>{title}</h2>
        {children}
        <button type="button" className="dialog-ok" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

type MenuItem =
  | { kind: "item"; label: string; hint?: string; disabled?: boolean; action: () => void }
  | { kind: "sep" };

function buildMenus(
  appName: string,
  front: AppId | null,
  dispatch: (action: MacAction) => void,
): { id: string; label: string; bold?: boolean; extra?: boolean; items: MenuItem[] }[] {
  const withWindow = (action: "close" | "minimize" | "zoom") => {
    if (!front) return;
    dispatch({ type: action, id: front });
  };

  return [
    {
      id: "app",
      label: appName,
      bold: true,
      items: [
        {
          kind: "item",
          label: `About ${appName}`,
          action: () => dispatch({ type: "about", open: true }),
        },
        { kind: "sep" },
        {
          kind: "item",
          label: `Close ${appName}`,
          disabled: !front,
          action: () => withWindow("close"),
        },
      ],
    },
    {
      id: "file",
      label: "File",
      extra: true,
      items: [
        {
          kind: "item",
          label: "Close Window",
          disabled: !front,
          action: () => withWindow("close"),
        },
        { kind: "sep" },
        {
          kind: "item",
          label: "Export Resume as PDF…",
          action: () => {
            dispatch({ type: "dismiss-popups" });
            window.open("/resume?export=1", "_blank", "noopener,noreferrer");
          },
        },
      ],
    },
    {
      id: "view",
      label: "View",
      extra: true,
      items: [
        {
          kind: "item",
          label: "Zoom Window",
          disabled: !front,
          action: () => withWindow("zoom"),
        },
      ],
    },
    {
      id: "window",
      label: "Window",
      extra: true,
      items: [
        {
          kind: "item",
          label: "Minimize",
          disabled: !front,
          action: () => withWindow("minimize"),
        },
        { kind: "sep" },
        {
          kind: "item",
          label: "Safari",
          action: () => dispatch({ type: "open", id: "safari" }),
        },
        {
          kind: "item",
          label: "Preview",
          action: () => dispatch({ type: "open", id: "preview" }),
        },
        {
          kind: "item",
          label: "Finder",
          action: () => dispatch({ type: "open", id: "finder" }),
        },
        {
          kind: "item",
          label: "Mail",
          action: () => dispatch({ type: "open", id: "mail" }),
        },
      ],
    },
    {
      id: "help",
      label: "Help",
      items: [
        {
          kind: "item",
          label: "How to Use This Desktop",
          action: () => dispatch({ type: "help", open: true }),
        },
      ],
    },
  ];
}

function AppleMark() {
  return (
    <svg viewBox="0 0 16 18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.7 9.4c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.3-.1-2.6.8-3.3.8s-1.7-.8-2.8-.7c-1.5.1-2.8.9-3.6 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7 1.9-1.1 2.6-2.2c.8-1.2 1.1-2.3 1.2-2.4-.1 0-2.2-.8-2.2-3.6zM10.8 3.2c.6-.7 1-1.7.9-2.7-1 .1-2.1.6-2.7 1.4-.6.7-1.1 1.7-.9 2.6 1 .1 2-.5 2.7-1.3z"
      />
    </svg>
  );
}

function SearchMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.2 10.2L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function WifiMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2 6.2c3.4-3 8.6-3 12 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M4.2 8.6c2.2-1.9 5.4-1.9 7.6 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M6.3 11c1-1 2.4-1 3.4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="8" cy="13.1" r="0.9" fill="currentColor" />
    </svg>
  );
}

function BatteryMark() {
  return (
    <svg viewBox="0 0 22 12" aria-hidden="true">
      <rect
        x="0.7"
        y="1"
        width="18"
        height="10"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect x="2.2" y="2.5" width="13.5" height="7" rx="1" fill="currentColor" />
      <path d="M19.5 4.2h1.2c.4 0 .8.3.8.8v2c0 .4-.4.8-.8.8h-1.2" fill="currentColor" />
    </svg>
  );
}
