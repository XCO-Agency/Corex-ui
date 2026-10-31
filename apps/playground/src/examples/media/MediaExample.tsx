import { useMemo, useState } from "react";
import {
  BlockStack,
  Box,
  Button,
  InlineStack,
  Media,
  Modal,
  SearchField,
  Text,
  useMedia,
} from "@xco-agency/corex-ui";

type DemoFileType = {
  id: string;
  name: string;
  type: string;
  orientation: string;
  date: string;
  fullDate: string;
  src: string;
  width: number;
  height: number;
};

const FILES: DemoFileType[] = [
  {
    id: "glazgow_navy",
    name: "glazgow_navy",
    type: "JPG",
    orientation: "Portrait",
    date: "15 Oct",
    fullDate: "15 October 2026",
    src: "https://picsum.photos/seed/glazgow-navy/480/480",
    width: 480,
    height: 480,
  },
  {
    id: "glazgow_olive",
    name: "glazgow_olive",
    type: "JPG",
    orientation: "Square",
    date: "15 Oct",
    fullDate: "15 October 2026",
    src: "https://picsum.photos/seed/glazgow-olive/480/480",
    width: 480,
    height: 480,
  },
  {
    id: "daily_sparkle",
    name: "dailysparklebeanie_navy",
    type: "JPG",
    orientation: "Portrait",
    date: "14 Oct",
    fullDate: "14 October 2026",
    src: "https://picsum.photos/seed/daily-sparkle/480/640",
    width: 480,
    height: 640,
  },
  {
    id: "rib_knit",
    name: "ribknitbeanie_purple",
    type: "JPG",
    orientation: "Square",
    date: "14 Oct",
    fullDate: "14 October 2026",
    src: "https://picsum.photos/seed/rib-knit/480/480",
    width: 480,
    height: 480,
  },
  {
    id: "gloves_black",
    name: "506019018666P_01",
    type: "PNG",
    orientation: "Landscape",
    date: "12 Oct",
    fullDate: "12 October 2026",
    src: "https://picsum.photos/seed/gloves-black/640/480",
    width: 640,
    height: 480,
  },
  {
    id: "daily_olive",
    name: "daily_olive",
    type: "JPG",
    orientation: "Square",
    date: "15 Oct",
    fullDate: "15 October 2026",
    src: "https://picsum.photos/seed/daily-olive/480/480",
    width: 480,
    height: 480,
  },
  {
    id: "freestyle",
    name: "freestyle_lime",
    type: "JPG",
    orientation: "Portrait",
    date: "11 Oct",
    fullDate: "11 October 2026",
    src: "https://picsum.photos/seed/freestyle-lime/400/520",
    width: 400,
    height: 520,
  },
  {
    id: "binding",
    name: "wax_binding",
    type: "JPG",
    orientation: "Landscape",
    date: "10 Oct",
    fullDate: "10 October 2026",
    src: "https://picsum.photos/seed/wax-binding/640/400",
    width: 640,
    height: 400,
  },
  {
    id: "untitled",
    name: "Untitled-1_copy_final",
    type: "JPG",
    orientation: "Square",
    date: "9 Oct",
    fullDate: "9 October 2026",
    src: "https://picsum.photos/seed/untitled-media/480/480",
    width: 480,
    height: 480,
  },
];

function MediaToolbarControls({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  const { selectedCount, clearSelection } = useMedia();

  return (
    <BlockStack gap="small-100">
      <InlineStack gap="small-100" alignItems="center" wrap={false}>
        <Box inlineSize="100%" minInlineSize="0">
          <SearchField
            label="Search files"
            labelAccessibilityVisibility="exclusive"
            placeholder="Search files"
            value={query}
            onChange={onQueryChange}
          />
        </Box>
        <Button icon="sort">Sort</Button>
        <Media.ViewToggle />
        {selectedCount > 0 ? (
          <Button variant="plain" onClick={clearSelection}>
            Clear ({selectedCount})
          </Button>
        ) : null}
      </InlineStack>
      <Media.Filters>
        <Button icon="caret-down">File size</Button>
        <Button icon="caret-down">Used in</Button>
        <Button icon="caret-down">Product</Button>
      </Media.Filters>
    </BlockStack>
  );
}

function MediaDetailBody({ files }: { files: DemoFileType[] }) {
  const { detailValue } = useMedia();
  const file = files.find((item) => item.id === detailValue);
  if (!file) return null;

  return (
    <BlockStack gap="base">
      <Media.Preview src={file.src} alt={file.name} fit="contain" />
      <BlockStack gap="small-300">
        <Text fontWeight="semibold">{file.name}</Text>
        <Text color="subdued">{file.fullDate}</Text>
        <Text color="subdued">
          {file.type} · {file.width} × {file.height}
        </Text>
      </BlockStack>
    </BlockStack>
  );
}

function MediaFileItem({ file }: { file: DemoFileType }) {
  return (
    <Media.Item value={file.id} accessibilityLabel={file.name}>
      <Media.Preview src={file.src} alt={file.name} fit="contain">
        <Media.Actions>
          <Media.Trigger variant="preview" accessibilityLabel={`Preview ${file.name}`} />
        </Media.Actions>
      </Media.Preview>
      <Media.Meta
        name={file.name}
        type={file.type}
        orientation={file.orientation}
        date={file.date}
      />
    </Media.Item>
  );
}

export function MediaExample() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(["daily_olive"]);
  const [detailValue, setDetailValue] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FILES;
    return FILES.filter(
      (file) =>
        file.name.toLowerCase().includes(q) || file.type.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <BlockStack gap="large-100">
      <BlockStack gap="small-200">
        <Text heading>Media library picker</Text>
        <Text color="subdued">
          Grid/list browse, multi-select, hover preview chip, upload strip, and a
          sliding detail panel — composed inside a Modal.
        </Text>
        <InlineStack gap="small-100" alignItems="center">
          <Button onClick={() => setOpen(true)}>Select image</Button>
          <Text color="subdued">
            {selected.length === 0
              ? "Nothing selected"
              : `${selected.length} selected`}
          </Text>
        </InlineStack>
      </BlockStack>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setDetailValue(null);
        }}
        title="Select image"
        variant="large"
        primaryAction={{
          content: "Done",
          onAction: () => {
            setOpen(false);
            setDetailValue(null);
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {
              setOpen(false);
              setDetailValue(null);
            },
          },
        ]}
      >
        <Media
          multiple
          value={selected}
          onChange={setSelected}
          view={view}
          onViewChange={setView}
          detailValue={detailValue}
          onDetailChange={setDetailValue}
          contentMaxBlockSize="22rem"
          previewFit="contain"
          accessibilityLabel="Media files"
        >
          <Media.Toolbar>
            <MediaToolbarControls query={query} onQueryChange={setQuery} />
          </Media.Toolbar>

          <Media.Upload>
            <BlockStack gap="small-100" alignItems="center">
              <InlineStack gap="small-100" justifyContent="center" alignItems="center">
                <Button icon="plus">Add files</Button>
                <Button icon="wand">Generate image</Button>
              </InlineStack>
              <Text color="subdued">Drag and drop images</Text>
            </BlockStack>
          </Media.Upload>

          <Media.Body>
            {filtered.length === 0 ? (
              <Media.Empty>
                <Text color="subdued">No files match “{query}”</Text>
              </Media.Empty>
            ) : (
              <Media.Content>
                {filtered.map((file) => (
                  <MediaFileItem key={file.id} file={file} />
                ))}
              </Media.Content>
            )}

            <Media.Detail heading="Preview">
              <MediaDetailBody files={FILES} />
            </Media.Detail>
          </Media.Body>
        </Media>
      </Modal>

      <BlockStack gap="small-200">
        <Text heading>Inline gallery</Text>
        <Text color="subdued">Single-select grid without a modal shell.</Text>
        <Media
          defaultValue={["glazgow_navy"]}
          accessibilityLabel="Featured images"
          gridMinInlineSize="8rem"
          previewFit="cover"
        >
          <Media.Content>
            {FILES.slice(0, 4).map((file) => (
              <Media.Item
                key={file.id}
                value={file.id}
                accessibilityLabel={file.name}
                openDetailOnActivate={false}
              >
                <Media.Preview src={file.src} alt={file.name} />
                <Media.Meta name={file.name} type={file.type} />
              </Media.Item>
            ))}
          </Media.Content>
        </Media>
      </BlockStack>
    </BlockStack>
  );
}
