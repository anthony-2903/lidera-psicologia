/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      alt?: string;
      loading?: "auto" | "lazy" | "eager";
      reveal?: "auto" | "interaction" | "manual";
      "camera-controls"?: boolean;
      "auto-rotate"?: boolean;
      "auto-rotate-delay"?: string;
      "disable-zoom"?: boolean;
      "interaction-prompt"?: "auto" | "when-focused" | "none";
      "rotation-per-second"?: string;
      "camera-orbit"?: string;
      "camera-target"?: string;
      "field-of-view"?: string;
      "shadow-intensity"?: string;
      exposure?: string;
    };
  }
}
