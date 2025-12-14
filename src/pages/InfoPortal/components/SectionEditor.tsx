import { Box, Typography, TextField, Button, IconButton, useTheme } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import {
  RichTextEditor,
  type RichTextEditorRef,
  MenuButtonAddTable,
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonCode,
  MenuButtonCodeBlock,
  MenuButtonEditLink,
  MenuButtonHighlightColor,
  MenuButtonHorizontalRule,
  MenuButtonImageUpload,
  MenuButtonIndent,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonRemoveFormatting,
  MenuButtonStrikethrough,
  MenuButtonSubscript,
  MenuButtonSuperscript,
  MenuButtonTaskList,
  MenuButtonTextColor,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuButtonUnindent,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuSelectTextAlign,
  isTouchDevice,
} from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import FontFamily from "@tiptap/extension-font-family";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import type { Editor } from "@tiptap/react";
import type { SectionResponse } from "../../../store/types/InfoPortal/SectionResponse";

interface SectionEditorProps {
  sections: SectionResponse[];
  onSave: (sections: Array<{ title: string; content: string; order: number }>) => void;
  loading?: boolean;
}

interface EditableSection {
  id?: string;
  title: string;
  content: string;
  order: number;
  isEditing: boolean;
  isNew?: boolean;
}

const SectionEditor = ({ sections, onSave, loading = false }: SectionEditorProps) => {
  const [editableSections, setEditableSections] = useState<EditableSection[]>(() => {
    return sections.map((section, index) => {
      // Convert plain text to HTML if needed (for backward compatibility)
      let content = section.content || "";
      if (content && !content.startsWith("<")) {
        // Plain text - convert to HTML paragraphs
        content = content.split("\n").map((line) => `<p>${line || "<br>"}</p>`).join("");
      }
      return {
        id: section.id,
        title: section.title,
        content,
        order: section.order || index + 1,
        isEditing: false,
        isNew: false,
      };
    });
  });

  const handleAddSection = () => {
    const newSection: EditableSection = {
      title: "",
      content: "",
      order: editableSections.length + 1,
      isEditing: true,
      isNew: true,
    };
    setEditableSections([...editableSections, newSection]);
  };

  const handleEditSection = (index: number) => {
    const updated = [...editableSections];
    updated[index] = { ...updated[index], isEditing: true };
    setEditableSections(updated);
  };

  const handleCancelEdit = (index: number) => {
    const section = editableSections[index];
    if (section.isNew) {
      // Remove new section if canceling
      setEditableSections(editableSections.filter((_, i) => i !== index));
    } else {
      // Reset to original values
      const original = sections.find((s) => s.id === section.id);
      if (original) {
        const updated = [...editableSections];
        // Convert plain text to HTML if needed
        let content = original.content || "";
        if (content && !content.startsWith("<")) {
          content = content.split("\n").map((line) => `<p>${line || "<br>"}</p>`).join("");
        }
        updated[index] = {
          id: original.id,
          title: original.title,
          content,
          order: original.order || index + 1,
          isEditing: false,
          isNew: false,
        };
        setEditableSections(updated);
      }
    }
  };

  const handleSaveSection = (index: number, content?: string) => {
    const section = editableSections[index];
    // Use provided content or fallback to section content
    const finalContent = content || section.content;
    // Check if content has actual text (not just HTML tags)
    const textContent = finalContent.replace(/<[^>]*>/g, "").trim();
    if (!section.title.trim() || !textContent) {
      return;
    }

    const updated = [...editableSections];
    // Update content if provided
    if (content) {
      updated[index] = { ...updated[index], content, isEditing: false, isNew: false };
    } else {
      updated[index] = { ...updated[index], isEditing: false, isNew: false };
    }
    setEditableSections(updated);

    // Save all sections with updated content
    const sectionsToSave = updated.map((s) => ({
      ...(s.id && { id: s.id }),
      title: s.title,
      content: s.content,
      order: s.order,
    }));
    onSave(sectionsToSave);
  };

  const handleDeleteSection = (index: number) => {
    const updated = editableSections.filter((_, i) => i !== index);
    // Reorder remaining sections
    const reordered = updated.map((s, i) => ({
      ...s,
      order: i + 1,
    }));
    setEditableSections(reordered);

    // Save updated sections
    const sectionsToSave = reordered.map((s) => ({
      ...(s.id && { id: s.id }),
      title: s.title,
      content: s.content,
      order: s.order,
    }));
    onSave(sectionsToSave);
  };

  const handleFieldChange = (index: number, field: "title" | "content", value: string) => {
    const updated = [...editableSections];
    updated[index] = { ...updated[index], [field]: value };
    setEditableSections(updated);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            lineHeight: 1.44,
            color: "#0A1629",
          }}
        >
          Sections
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddSection}
          disabled={loading}
          sx={{
            borderRadius: "14px",
            padding: "8px 16px",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 600,
            boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
          }}
        >
          Add Section
        </Button>
      </Box>

      {/* Sections List */}
      {editableSections.length === 0 ? (
        <Box
          sx={{
            padding: "40px",
            textAlign: "center",
            border: "1px dashed #D8E0F0",
            borderRadius: "14px",
            backgroundColor: "#F9FAFB",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              color: "#91929E",
            }}
          >
            No sections yet. Click "Add Section" to create your first section.
          </Typography>
        </Box>
      ) : (
        editableSections.map((section, index) => (
          <Box
            key={section.id || `new-${index}`}
            sx={(theme) => ({
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "14px",
              padding: "24px",
              backgroundColor: theme.palette.background.paper,
            })}
          >
            {section.isEditing ? (
              // Edit Mode
              <SectionEditForm
                section={section}
                index={index}
                onFieldChange={handleFieldChange}
                onSave={handleSaveSection}
                onCancel={() => handleCancelEdit(index)}
                loading={loading}
              />
            ) : (
              // View Mode
              <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 700,
                      lineHeight: 1.44,
                      color: "#0A1629",
                      flex: 1,
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Box sx={{ display: "flex", gap: "8px" }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditSection(index)}
                      disabled={loading}
                      sx={{
                        color: "#3F8CFF",
                        "&:hover": {
                          backgroundColor: "rgba(63, 140, 255, 0.08)",
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteSection(index)}
                      disabled={loading}
                      sx={{
                        color: "#FF3B30",
                        "&:hover": {
                          backgroundColor: "rgba(255, 59, 48, 0.08)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Box
                  sx={{
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: "#0A1629",
                    opacity: 0.7,
                    "& p": {
                      margin: 0,
                      marginBottom: "8px",
                      "&:last-child": {
                        marginBottom: 0,
                      },
                    },
                    "& ul, & ol": {
                      paddingLeft: "24px",
                      marginBottom: "8px",
                    },
                    "& h1, & h2, & h3, & h4, & h5, & h6": {
                      marginTop: "16px",
                      marginBottom: "8px",
                      fontWeight: 700,
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </Box>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

// Menu controls component for the rich text editor
const EditorMenuControls = () => {
  const theme = useTheme();
  return (
    <MenuControlsContainer>
      <MenuSelectHeading />

      <MenuDivider />

      <MenuButtonBold />

      <MenuButtonItalic />

      <MenuButtonUnderline />

      <MenuButtonStrikethrough />

      <MenuButtonSubscript />

      <MenuButtonSuperscript />

      <MenuDivider />

      <MenuButtonTextColor
        defaultTextColor={theme.palette.text.primary}
        swatchColors={[
          { value: "#000000", label: "Black" },
          { value: "#ffffff", label: "White" },
          { value: "#888888", label: "Grey" },
          { value: "#ff0000", label: "Red" },
          { value: "#ff9900", label: "Orange" },
          { value: "#ffff00", label: "Yellow" },
          { value: "#00d000", label: "Green" },
          { value: "#0000ff", label: "Blue" },
        ]}
      />

      <MenuButtonHighlightColor
        swatchColors={[
          { value: "#595959", label: "Dark grey" },
          { value: "#dddddd", label: "Light grey" },
          { value: "#ffa6a6", label: "Light red" },
          { value: "#ffd699", label: "Light orange" },
          { value: "#ffff00", label: "Yellow" },
          { value: "#99cc99", label: "Light green" },
          { value: "#90c6ff", label: "Light blue" },
          { value: "#8085e9", label: "Light purple" },
        ]}
      />

      <MenuDivider />

      <MenuButtonEditLink />

      <MenuDivider />

      <MenuSelectTextAlign />

      <MenuDivider />

      <MenuButtonOrderedList />

      <MenuButtonBulletedList />

      <MenuButtonTaskList />

      {isTouchDevice() && (
        <>
          <MenuButtonIndent />

          <MenuButtonUnindent />
        </>
      )}

      <MenuDivider />

      <MenuButtonBlockquote />

      <MenuDivider />

      <MenuButtonCode />

      <MenuButtonCodeBlock />

      <MenuDivider />

      <MenuButtonImageUpload
        onUploadFiles={(files) =>
          files.map((file) => ({
            src: URL.createObjectURL(file),
            alt: file.name,
          }))
        }
      />

      <MenuDivider />

      <MenuButtonHorizontalRule />

      <MenuButtonAddTable />

      <MenuDivider />

      <MenuButtonRemoveFormatting />

      <MenuDivider />

      <MenuButtonUndo />
      <MenuButtonRedo />
    </MenuControlsContainer>
  );
};

// Separate component for editing section with RichTextEditor
interface SectionEditFormProps {
  section: EditableSection;
  index: number;
  onFieldChange: (index: number, field: "title" | "content", value: string) => void;
  onSave: (index: number, content?: string) => void;
  onCancel: () => void;
  loading: boolean;
}

const SectionEditForm = ({
  section,
  index,
  onFieldChange,
  onSave,
  onCancel,
  loading,
}: SectionEditFormProps) => {
  const editorRef = useRef<RichTextEditorRef>(null);
  // Initialize with section content, convert plain text to HTML if needed
  const getInitialContent = () => {
    let content = section.content || "";
    if (content && !content.startsWith("<")) {
      // Plain text - convert to HTML paragraphs
      content = content.split("\n").map((line) => `<p>${line || "<br>"}</p>`).join("");
    }
    return content || "<p></p>";
  };
  const [editorContent, setEditorContent] = useState(getInitialContent());

  // Update editor content when entering edit mode or content changes
  useEffect(() => {
    if (section.isEditing) {
      const initialContent = getInitialContent();
      setEditorContent(initialContent);
      // Update editor content if ref is available
      const editor = editorRef.current?.editor;
      if (editor && !editor.isDestroyed) {
        editor.commands.setContent(initialContent);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.isEditing, section.content]);

  const handleContentChange = ({ editor }: { editor: Editor }) => {
    if (editor && !editor.isDestroyed) {
      const htmlContent = editor.getHTML();
      setEditorContent(htmlContent);
      onFieldChange(index, "content", htmlContent);
    }
  };

  const handleSave = () => {
    const editor = editorRef.current?.editor;
    if (editor && !editor.isDestroyed) {
      const htmlContent = editor.getHTML();
      // Update content in state
      onFieldChange(index, "content", htmlContent);
      // Pass content directly to save to avoid stale state issues
      onSave(index, htmlContent);
    } else {
      onSave(index, section.content);
    }
  };

  // Check if content is valid (not just empty HTML tags)
  const isContentValid = () => {
    const editor = editorRef.current?.editor;
    if (editor && !editor.isDestroyed) {
      const htmlContent = editor.getHTML();
      // Remove HTML tags and check if there's actual text content
      const textContent = htmlContent.replace(/<[^>]*>/g, "").trim();
      return textContent.length > 0;
    }
    return (section.content || "").replace(/<[^>]*>/g, "").trim().length > 0;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField
        fullWidth
        label="Section Title"
        value={section.title}
        onChange={(e) => onFieldChange(index, "title", e.target.value)}
        placeholder="Enter section title..."
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
          },
        }}
      />
      <Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#0A1629",
            marginBottom: "8px",
          }}
        >
          Section Content
        </Typography>
        <Box
          sx={(theme) => ({
            border: `1px solid ${theme.palette.grey[300]}`,
            borderRadius: "14px",
            backgroundColor: theme.palette.background.paper,
            minHeight: "300px",
            overflow: "hidden",
          })}
        >
          <RichTextEditor
            key={`editor-${section.id || index}-${section.isEditing}`}
            ref={editorRef}
            extensions={[
              StarterKit,
              Subscript,
              Superscript,
              TextStyle,
              Color,
              FontFamily,
              Highlight.configure({ multicolor: true }),
              TextAlign.configure({
                types: ["heading", "paragraph"],
              }),
              TaskList,
              TaskItem.configure({
                nested: true,
              }),
              Image,
              Table.configure({
                resizable: true,
              }),
              TableRow,
              TableHeader,
              TableCell,
            ]}
            content={editorContent}
            onUpdate={handleContentChange}
            renderControls={() => <EditorMenuControls />}
            sx={{
              "& .MuiTiptap-Root": {
                border: "none",
                borderRadius: "14px",
              },
              "& .MuiTiptap-MenuBar": {
                borderBottom: "1px solid #E4E6E8",
                padding: "8px 12px",
              },
              "& .MuiTiptap-RichTextContent": {
                minHeight: "250px",
                padding: "16px",
              },
              "& .ProseMirror": {
                outline: "none",
                minHeight: "250px",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                "& p": {
                  margin: 0,
                  marginBottom: "8px",
                  whiteSpace: "pre-wrap",
                  "&:last-child": {
                    marginBottom: 0,
                  },
                },
                "& p.is-editor-empty:first-child::before": {
                  content: "attr(data-placeholder)",
                  float: "left",
                  color: "#adb5bd",
                  pointerEvents: "none",
                  height: 0,
                },
              },
              "& .ProseMirror p, & .ProseMirror span, & .ProseMirror div": {
                whiteSpace: "pre-wrap",
              },
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={onCancel}
          disabled={loading}
          sx={{
            borderRadius: "14px",
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={loading || !section.title.trim() || !isContentValid()}
          sx={{
            borderRadius: "14px",
            textTransform: "none",
            boxShadow: "0px 6px 12px 0px rgba(63, 140, 255, 0.26)",
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default SectionEditor;

