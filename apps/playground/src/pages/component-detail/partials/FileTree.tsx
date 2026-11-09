import * as React from "react";
import {
  BlockStack,
  Box,
  Clickable,
  Icon,
  InlineStack,
  Text,
} from "@xco-agency/corex-ui";
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
        let folderNode = currentLevel.find((node) => node.isFolder && node.name === part);
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

  const sortNodes = (nodes: FileTreeNodeType[]) => {
    nodes.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return 0;
    });
    for (const node of nodes) {
      if (node.isFolder) sortNodes(node.children);
    }
  };

  sortNodes(root);
  return root;
}

function FileTreeNodeItem({
  node,
  activeFilePath,
  onSelectFile,
  openFolders,
  onToggleFolder,
}: {
  node: FileTreeNodeType;
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  openFolders: Record<string, boolean>;
  onToggleFolder: (path: string) => void;
}) {
  if (node.isFolder) {
    const isOpen = openFolders[node.path] !== false;
    return (
      <BlockStack gap="none">
        <Clickable
          inlineSize="fill"
          paddingInline="small-200"
          paddingBlock="small-300"
          onClick={() => onToggleFolder(node.path)}
        >
          <InlineStack alignItems="center" gap="small-300">
            <Icon source={isOpen ? "chevron-down" : "chevron-right"} />
            <Icon source="folder" tone="info" />
            <Text variant="small" fontWeight="medium" lineClamp={1}>
              {node.name}
            </Text>
          </InlineStack>
        </Clickable>
        {isOpen && (
          <Box paddingInlineStart="small">
            <BlockStack gap="none">
              {node.children.map((child) => (
                <FileTreeNodeItem
                  key={child.path}
                  node={child}
                  activeFilePath={activeFilePath}
                  onSelectFile={onSelectFile}
                  openFolders={openFolders}
                  onToggleFolder={onToggleFolder}
                />
              ))}
            </BlockStack>
          </Box>
        )}
      </BlockStack>
    );
  }

  const isSelected = node.path === activeFilePath;
  return (
    <Clickable
      inlineSize="fill"
      paddingInline="small-200"
      paddingBlock="small-300"
      background={isSelected ? "strong" : undefined}
      borderRadius="base"
      onClick={() => onSelectFile(node.path)}
    >
      <InlineStack alignItems="center" gap="small-300">
        <Icon source="file" />
        <Text
          variant="small"
          fontWeight={isSelected ? "semibold" : "regular"}
          color={isSelected ? "base" : "subdued"}
          lineClamp={1}
        >
          {node.name}
        </Text>
      </InlineStack>
    </Clickable>
  );
}

export function FileTree({ files, activeFilePath, onSelectFile, className }: FileTreePropsType) {
  const tree = React.useMemo(() => buildFileTree(files), [files]);
  const [openFolders, setOpenFolders] = React.useState<Record<string, boolean>>({});

  const handleToggleFolder = (folderPath: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: prev[folderPath] === false ? true : false,
    }));
  };

  React.useEffect(() => {
    if (!activeFilePath) return;
    const parts = activeFilePath.split("/");
    if (parts.length <= 1) return;
    let currentPath = "";
    const nextOpen: Record<string, boolean> = {};
    for (let i = 0; i < parts.length - 1; i++) {
      currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i]!;
      nextOpen[currentPath] = true;
    }
    setOpenFolders((prev) => ({ ...prev, ...nextOpen }));
  }, [activeFilePath]);

  return (
    <Box className={className} background="subdued" inlineSize="240px" padding="small-200">
      <BlockStack gap="small-200">
        <Text variant="small" color="subdued" fontWeight="semibold">
          Files
        </Text>
        <BlockStack gap="none">
          {tree.map((node) => (
            <FileTreeNodeItem
              key={node.path}
              node={node}
              activeFilePath={activeFilePath}
              onSelectFile={onSelectFile}
              openFolders={openFolders}
              onToggleFolder={handleToggleFolder}
            />
          ))}
        </BlockStack>
      </BlockStack>
    </Box>
  );
}
