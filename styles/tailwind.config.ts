// styles/tailwind.config.ts
import { Options } from "$fresh/plugins/twind.ts";
import presetAutoprefix from "twind-preset-autoprefix";
import presetTailwind from "twind-preset-tailwind";

export default {
  // Tailwind의 기본 설정을 불러오는 프리셋
  presets: [presetTailwind(), presetAutoprefix()],
  theme: {
    extend: {
      colors: {
        lessernavy: "#2c3e50",
        mint: "#98f5e1",
        champagne: "#f7e8b6",
        lightgold: "#f5deb3",
        burgundy: "#7f1d1d",
        sky: "#cfe8fc",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
} as unknown as Options;