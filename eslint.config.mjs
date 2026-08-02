import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // The 3D layer is imperative by design. React Three Fiber's entire model is
  // mutating live three.js objects — camera.position, scene.environment,
  // material uniforms — from inside useFrame and useEffect, every frame.
  // react-hooks/immutability correctly forbids that for ordinary React values
  // and is simply the wrong rule here; obeying it would mean reallocating
  // scene objects 60 times a second.
  {
    files: ["src/three/**/*.{ts,tsx}", "src/systems/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
