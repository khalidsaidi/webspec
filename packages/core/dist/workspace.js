import fs from "node:fs";
import path from "node:path";
function safeJoin(root, relPath) {
    const resolved = path.resolve(root, relPath);
    const rootResolved = path.resolve(root);
    if (!resolved.startsWith(rootResolved + path.sep) && resolved !== rootResolved) {
        throw new Error(`Path traversal denied: ${relPath}`);
    }
    return resolved;
}
export function fsWorkspace(rootDir) {
    return {
        rootLabel: rootDir,
        async exists(relPath) {
            const p = safeJoin(rootDir, relPath);
            return fs.existsSync(p);
        },
        async read(relPath) {
            const p = safeJoin(rootDir, relPath);
            return fs.readFileSync(p, "utf8");
        },
        async ensureDir(relDir) {
            const p = safeJoin(rootDir, relDir);
            fs.mkdirSync(p, { recursive: true });
        },
        async write(relPath, content) {
            const p = safeJoin(rootDir, relPath);
            fs.mkdirSync(path.dirname(p), { recursive: true });
            fs.writeFileSync(p, content, "utf8");
        },
    };
}
export function mapWorkspace(label, fileMap) {
    return {
        rootLabel: label,
        async exists(relPath) {
            return Object.prototype.hasOwnProperty.call(fileMap, relPath);
        },
        async read(relPath) {
            const v = fileMap[relPath];
            if (v === undefined)
                throw new Error(`File not found in virtual workspace: ${relPath}`);
            return v;
        },
    };
}
export async function readFileMap(reader, relPaths) {
    const unique = Array.from(new Set(relPaths));
    const out = {};
    for (const p of unique) {
        if (await reader.exists(p))
            out[p] = await reader.read(p);
    }
    return out;
}
//# sourceMappingURL=workspace.js.map