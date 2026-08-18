/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PARTICIPATE_FORM_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
