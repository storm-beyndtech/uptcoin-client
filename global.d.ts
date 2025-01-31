// global.d.ts
interface GTranslateSettings {
  default_language: string;
  wrapper_selector: string;
  flag_size: number;
  flag_style: string;
  alt_flags: { [key: string]: string };
}

interface Window {
  gtranslateSettings?: GTranslateSettings;
}
