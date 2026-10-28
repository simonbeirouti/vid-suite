// Rspack/webpack's directory import, used by Root.tsx to find projects.
interface ImportMeta {
  webpackContext(
    request: string,
    options?: {
      recursive?: boolean;
      regExp?: RegExp;
      mode?: "sync" | "eager" | "weak" | "lazy" | "lazy-once";
    },
  ): {
    keys(): string[];
    (id: string): unknown;
  };
}
