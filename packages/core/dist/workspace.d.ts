export type FileMap = Record<string, string>;
export interface WorkspaceReader {
    rootLabel: string;
    exists(relPath: string): Promise<boolean>;
    read(relPath: string): Promise<string>;
}
export interface WorkspaceWriter extends WorkspaceReader {
    write(relPath: string, content: string): Promise<void>;
    ensureDir(relDir: string): Promise<void>;
}
export declare function fsWorkspace(rootDir: string): WorkspaceWriter;
export declare function mapWorkspace(label: string, fileMap: FileMap): WorkspaceReader;
export declare function readFileMap(reader: WorkspaceReader, relPaths: string[]): Promise<FileMap>;
//# sourceMappingURL=workspace.d.ts.map