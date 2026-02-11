// AUTO-GENERATED from demo/sandbox-repo — do not edit by hand.
export const SANDBOX_SNAPSHOT: Record<string, string> = {
  "README.md": "# Demo Sandbox Repo (fixture)\n\nThis is a tiny Vite + React Router style workspace used by WebSpec in:\n- Local mode (default workspace path)\n- Vercel demo mode (embedded snapshot)\n\nIt is a fixture, not part of the main app build.\n",
  "package.json": "{\n  \"name\": \"webspec-sandbox\",\n  \"private\": true,\n  \"version\": \"0.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"echo \\\"(fixture)\\\"\",\n    \"build\": \"echo \\\"(fixture)\\\"\"\n  }\n}\n",
  "src/pages/Home.tsx": "export default function Home() {\n  return (\n    <main className=\"mx-auto max-w-3xl p-6 space-y-3\">\n      <h1 className=\"text-2xl font-semibold\">Sandbox Home</h1>\n      <p className=\"opacity-80\">\n        This is a tiny demo workspace used by WebSpec to generate patches.\n      </p>\n    </main>\n  );\n}\n",
  "src/routes.tsx": "import React from \"react\";\n// @webspec:imports:start\nimport Home from \"./pages/Home\";\n// @webspec:imports:end\n\nexport type AppRoute = { path: string; element: React.ReactNode };\n\nexport const routes: AppRoute[] = [\n  // @webspec:routes:start\n  { path: \"/\", element: <Home /> },\n  // @webspec:routes:end\n];\n"
};
