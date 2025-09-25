import React, { useMemo } from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { HeadingNode } from "@lexical/rich-text"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import ToolBarPlugin from "./Plugins/ToolbarPlugin"
import { css } from "@emotion/css"
import { Box } from "@chakra-ui/react"
import CustomOnChangePlugin from "./Plugins/CustomOnChangePlugin"
import { ListNode, ListItemNode } from "@lexical/list"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { theme } from "./theme"
import { ImageNode } from "./nodes/ImageNode"
import SaveHtmlPlugin from "./Plugins/SaveHTMLPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { LinkNode } from "@lexical/link"
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  name: string
  setNote: (newValue: string) => void
}

export function validateUrl(url: string): boolean {
  if (!url) return false
  if (url === "https://") return true
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return /^www\./i.test(url)
  }
}

export const RichTextEditor: React.FC<RichTextEditorProps> = React.memo(
  function RichTextEditor({ value, onChange, placeholder, name, setNote }) {
    const initialConfig = useMemo(
      () => ({
        namespace: name,
        theme,
        onError: () => {},
        nodes: [
          HeadingNode,
          CodeHighlightNode,
          CodeNode,
          ListNode,
          ListItemNode,
          ImageNode,
          LinkNode
        ]
      }),
      [name]
    )

    return (
      <div className="editor-container">
        {/* 
        EDITOR SCROLL BEHAVIOR CONFIGURATION:
        - Editor starts at minHeight (135px) and grows with content
        - Stops growing at maxHeight (300px) and becomes scrollable
        - To change behavior: modify minHeight, maxHeight, and overflow properties below
      */}
        <LexicalComposer initialConfig={initialConfig}>
          <ToolBarPlugin setNote={setNote} />
          <div
            className={css({
              position: "relative",
              minHeight: "135px", // Minimum height - editor starts at this size
              maxHeight: "300px", // Maximum height - editor stops growing at this size
              border: "1px solid black",
              borderRadius: "4px",
              overflow: "auto" // Allows scrolling when content exceeds maxHeight
            })}
          >
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={css({
                    minHeight: "100%", // Allows content to grow beyond container height
                    fontSize: 12,
                    padding: 8,
                    overflowY: "auto", // Enables vertical scrolling when needed
                    outline: "none"
                  })}
                />
              }
              placeholder={
                <Box
                  className={css({
                    position: "absolute",
                    pointerEvents: "none",
                    color: "#999",
                    top: 8,
                    left: 8,
                    fontSize: 12
                  })}
                >
                  {placeholder}
                </Box>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <AutoFocusPlugin />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin validateUrl={validateUrl} />
          <ClickableLinkPlugin />
          <CustomOnChangePlugin value={value} onChange={onChange} />
          <SaveHtmlPlugin setNote={setNote} />
        </LexicalComposer>
      </div>
    )
  }
)
