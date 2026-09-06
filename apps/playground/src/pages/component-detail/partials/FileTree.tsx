import * as React from "react";
import { ChevronRight, Folder, FolderOpen, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileItemType } from "@/data/types";

export type FileTreeNodeType = {
  name: string;
  path: string;
  isFolder: boolean;
  children: FileTreeNodeType[];
  file?: FileItemType;
};

export type FileTreePropsType = {
  files: FileItemType[];
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  className?: string;
};

export function buildFileTree(files: FileItemType[]): FileTreeNodeType[] {
  const root: FileTreeNodeType[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let currentLevel = root;
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLast = i === parts.length - 1;

      if (isLast) {
        currentLevel.push({
          name: part,
          path: file.path,
          isFolder: false,
          children: [],
          file,
        });
      } else {
        let folderNode = currentLevel.find(
          (node) => node.isFolder && node.name === part,
        );
        if (!folderNode) {
          folderNode = {
            name: part,
            path: currentPath,
            isFolder: true,
            children: [],
          };
          currentLevel.push(folderNode);
        }
        currentLevel = folderNode.children;
      }
    }
  }

  // Preserve folder order, then file order
  const sortNodes = (nodes: FileTreeNodeType[]) => {
    nodes.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return 0;
    });
    for (const node of nodes) {
      if (node.isFolder) {
        sortNodes(node.children);
      }
    }
  };

  sortNodes(root);
  return root;
}

type FileTreeNodeItemPropsType = {
  node: FileTreeNodeType;
  depth: number;
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  openFolders: Record<string, boolean>;
  onToggleFolder: (path: string) => void;
  hasParentFolder?: boolean;
};

function FileTreeNodeItem({
  node,
  depth,
  activeFilePath,
  onSelectFile,
  openFolders,
  onToggleFolder,
  hasParentFolder = false,
}: FileTreeNodeItemPropsType) {
  if (node.isFolder) {
    const isOpen = openFolders[node.path] !== false; // open by default

    return (
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => onToggleFolder(node.path)}
          className="group/folder flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left font-mono text-xs transition-colors hover:bg-muted/60 cursor-pointer"
          style={{ paddingLeft: `${depth * 14 + 6}px` }}
        >
          <ChevronRight
            className={cn(
              "size-3 text-muted-foreground/60 transition-transform duration-150 shrink-0",
              isOpen && "rotate-90",
            )}
          />
          {isOpen ? (
            <FolderOpen className="size-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
          ) : (
            <Folder className="size-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
          )}
          <span className="truncate font-medium text-foreground/90 group-hover/folder:text-foreground">
            {node.name}
          </span>
        </button>

        {isOpen && (
          <div className="flex flex-col">
            {node.children.map((child) => (
              <FileTreeNodeItem
                key={child.path}
                node={child}
                depth={depth + 1}
                activeFilePath={activeFilePath}
                onSelectFile={onSelectFile}
                openFolders={openFolders}
                onToggleFolder={onToggleFolder}
                hasParentFolder={true}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isSelected = node.path === activeFilePath;

  return (
    <button
      type="button"
      onClick={() => onSelectFile(node.path)}
      className={cn(
        "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left font-mono text-xs transition-colors cursor-pointer",
        isSelected
          ? "bg-muted font-semibold text-foreground shadow-2xs"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
      style={{ paddingLeft: `${depth * 14 + (hasParentFolder ? 18 : 6)}px` }}
    >
      <FileCode className="size-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
      <span className="truncate">{node.name}</span>
    </button>
  );
}

export function FileTree({
  files,
  activeFilePath,
  onSelectFile,
  className,
}: FileTreePropsType) {
  const tree = React.useMemo(() => buildFileTree(files), [files]);

  // All folders open by default
  const [openFolders, setOpenFolders] = React.useState<Record<string, boolean>>({});

  const handleToggleFolder = (folderPath: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: prev[folderPath] === false ? true : false,
    }));
  };

  // Auto-expand parent folders of active file
  React.useEffect(() => {
    if (!activeFilePath) return;
    const parts = activeFilePath.split("/");
    if (parts.length > 1) {
      let currentPath = "";
      const newOpenState: Record<string, boolean> = {};
      for (let i = 0; i < parts.length - 1; i++) {
        currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i]!;
        newOpenState[currentPath] = true;
      }
      setOpenFolders((prev) => ({ ...prev, ...newOpenState }));
    }
  }, [activeFilePath]);

  return (
    <aside
      className={cn(
        "w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-border/70 bg-muted/20 flex flex-col",
        className,
      )}
    >
      <div className="flex h-10 shrink-0 items-center border-b border-border/70 px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Files
      </div>
      <div className="p-2 space-y-0.5 overflow-y-auto max-h-[400px]">
        {tree.map((node) => (
          <FileTreeNodeItem
            key={node.path}
            node={node}
            depth={0}
            activeFilePath={activeFilePath}
            onSelectFile={onSelectFile}
            openFolders={openFolders}
            onToggleFolder={handleToggleFolder}
          />
        ))}
      </div>
    </aside>
  );
}
