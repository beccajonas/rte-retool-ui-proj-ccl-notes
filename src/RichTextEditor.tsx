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

const urlRegExp = new RegExp(
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/
)

export function validateUrl(url: string): boolean {
  return url === "https://" || urlRegExp.test(url)
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
        <LexicalComposer initialConfig={initialConfig}>
          <ToolBarPlugin />
          <div
            className={css({
              position: "relative",
              height: "135px",
              border: "1px solid black",
              borderRadius: "4px",
              overflow: "hidden"
            })}
          >
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={css({
                    height: "100%",
                    fontSize: 12,
                    padding: 8,
                    overflowY: "auto",
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
          {/* Uncomment if you want live updates */}
          {/* <CustomOnChangePlugin value={value} onChange={onChange} /> */}
          <SaveHtmlPlugin setNote={setNote} />
        </LexicalComposer>
      </div>
    )
  }
)
