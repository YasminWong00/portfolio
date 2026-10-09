export const APP_IDS = ["finder", "safari", "preview", "mail"] as const;

export type AppId = (typeof APP_IDS)[number];

export type Win = {
  open: boolean;
  minimized: boolean;
  zoomed: boolean;
  z: number;
  x: number | null;
  y: number | null;
};

export type MacState = {
  windows: Record<AppId, Win>;
  front: AppId | null;
  z: number;
  menu: string | null;
  spotlight: boolean;
  about: boolean;
  help: boolean;
  query: string;
};

export type MacAction =
  | { type: "open"; id: AppId }
  | { type: "dock"; id: AppId }
  | { type: "close"; id: AppId }
  | { type: "minimize"; id: AppId }
  | { type: "zoom"; id: AppId }
  | { type: "focus"; id: AppId }
  | { type: "move"; id: AppId; x: number; y: number }
  | { type: "desktop" }
  | { type: "menu"; id: string | null }
  | { type: "spotlight"; open: boolean }
  | { type: "query"; query: string }
  | { type: "about"; open: boolean }
  | { type: "help"; open: boolean }
  | { type: "dismiss-popups" };

function makeWindow(z: number, open: boolean): Win {
  return { open, minimized: false, zoomed: false, z, x: null, y: null };
}

export const initialMacState: MacState = {
  windows: {
    finder: makeWindow(1, false),
    safari: makeWindow(2, true),
    preview: makeWindow(1, false),
    mail: makeWindow(1, false),
  },
  front: "safari",
  z: 2,
  menu: null,
  spotlight: false,
  about: false,
  help: false,
  query: "",
};

function topmost(windows: Record<AppId, Win>): AppId | null {
  let best: AppId | null = null;
  let z = -1;
  for (const id of APP_IDS) {
    const win = windows[id];
    if (win.open && !win.minimized && win.z >= z) {
      best = id;
      z = win.z;
    }
  }
  return best;
}

function raise(state: MacState, id: AppId, patch: Partial<Win>): MacState {
  const z = state.z + 1;
  return {
    ...state,
    z,
    front: id,
    menu: null,
    spotlight: false,
    query: "",
    windows: {
      ...state.windows,
      [id]: {
        ...state.windows[id],
        ...patch,
        open: true,
        minimized: false,
        z,
      },
    },
  };
}

export function macReducer(state: MacState, action: MacAction): MacState {
  switch (action.type) {
    case "open":
      return raise(state, action.id, {});
    case "dock": {
      const win = state.windows[action.id];
      const active = state.front === action.id && win.open && !win.minimized;
      if (active) {
        const windows = {
          ...state.windows,
          [action.id]: { ...win, minimized: true },
        };
        return {
          ...state,
          windows,
          front: topmost(windows),
          menu: null,
          spotlight: false,
        };
      }
      return raise(state, action.id, {});
    }
    case "close": {
      const win = state.windows[action.id];
      const windows = {
        ...state.windows,
        [action.id]: { ...win, open: false, minimized: false, zoomed: false },
      };
      return {
        ...state,
        windows,
        front: state.front === action.id ? topmost(windows) : state.front,
        menu: null,
      };
    }
    case "minimize": {
      const win = state.windows[action.id];
      if (!win.open) return state;
      const windows = {
        ...state.windows,
        [action.id]: { ...win, minimized: true },
      };
      return {
        ...state,
        windows,
        front: state.front === action.id ? topmost(windows) : state.front,
        menu: null,
      };
    }
    case "zoom": {
      const win = state.windows[action.id];
      if (!win.open || win.minimized) return state;
      const z = state.z + 1;
      return {
        ...state,
        z,
        front: action.id,
        menu: null,
        windows: {
          ...state.windows,
          [action.id]: { ...win, zoomed: !win.zoomed, z },
        },
      };
    }
    case "focus": {
      const win = state.windows[action.id];
      if (!win.open || win.minimized) return state;
      const z = state.z + 1;
      return {
        ...state,
        z,
        front: action.id,
        windows: {
          ...state.windows,
          [action.id]: { ...win, z },
        },
      };
    }
    case "move": {
      const z = state.z + 1;
      const win = state.windows[action.id];
      return {
        ...state,
        z,
        front: action.id,
        windows: {
          ...state.windows,
          [action.id]: {
            ...win,
            open: true,
            minimized: false,
            x: action.x,
            y: action.y,
            z,
          },
        },
      };
    }
    case "desktop":
      return { ...state, front: null, menu: null };
    case "menu":
      return {
        ...state,
        menu: state.menu === action.id ? null : action.id,
        spotlight: false,
      };
    case "spotlight":
      return {
        ...state,
        spotlight: action.open,
        menu: null,
        query: action.open ? state.query : "",
      };
    case "query":
      return { ...state, query: action.query };
    case "about":
      return {
        ...state,
        about: action.open,
        help: action.open ? false : state.help,
        menu: null,
        spotlight: false,
      };
    case "help":
      return {
        ...state,
        help: action.open,
        about: action.open ? false : state.about,
        menu: null,
        spotlight: false,
      };
    case "dismiss-popups":
      return { ...state, menu: null, spotlight: false, query: "" };
    default:
      return state;
  }
}
