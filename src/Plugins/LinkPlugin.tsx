import React, { useEffect, useState } from "react"
import { Link45deg, Link } from "react-bootstrap-icons"
import {
  IconButton,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton
} from "@chakra-ui/react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  $isRangeSelection,
  $createTextNode,
  $insertNodes,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW
} from "lexical"
import {
  TOGGLE_LINK_COMMAND,
  $createLinkNode,
  $isLinkNode
} from "@lexical/link"
import { mergeRegister } from "@lexical/utils"
// Replaced Modal with Chakra Popover anchored to the toolbar icon

export default function LinkPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [linkText, setLinkText] = useState("")
  const [linkURL, setLinkURL] = useState("")
  const [isInLink, setIsInLink] = useState(false)

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            let node = selection.anchor.getNode()
            let foundLink = false
            while (node) {
              if ($isLinkNode(node)) {
                foundLink = true
                break
              }
              const parent = node.getParent()
              if (!parent) break
              node = parent
            }
            setIsInLink(foundLink)
          } else {
            setIsInLink(false)
          }
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            let node = selection.anchor.getNode()
            let foundLink = false
            while (node) {
              if ($isLinkNode(node)) {
                foundLink = true
                break
              }
              const parent = node.getParent()
              if (!parent) break
              node = parent
            }
            setIsInLink(foundLink)
          } else {
            setIsInLink(false)
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor])

  const handleClick = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode()
        let node = anchorNode
        let linkNode: any | null = null
        while (node) {
          if ($isLinkNode(node)) {
            linkNode = node
            break
          }
          const parent = node.getParent()
          if (!parent) break
          node = parent
        }
        const text = selection.getTextContent()
        setSelectedText(text)
        if (linkNode) {
          setIsInLink(true)
          try {
            const currentUrl = linkNode.getURL?.() ?? ""
            setLinkURL(currentUrl)
          } catch {}
          const existingText = linkNode.getTextContent?.() ?? text
          setLinkText(existingText)
        } else {
          setIsInLink(false)
          setLinkText(text)
          setLinkURL("")
        }
      } else {
        setSelectedText("")
        setLinkText("")
        setLinkURL("")
        setIsInLink(false)
      }
    })
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
  }

  const normalizeUrl = (url: string) => {
    if (!url) return ""
    const hasProtocol = /^(https?:\/\/|mailto:)/i.test(url)
    return hasProtocol ? url : `https://${url}`
  }

  const handleApply = () => {
    const url = normalizeUrl(linkURL.trim())
    if (!url) {
      setModalOpen(false)
      return
    }

    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        // If caret is inside an existing link, update it
        const anchorNode = selection.anchor.getNode()
        let node = anchorNode
        let existingLink: any | null = null
        while (node) {
          if ($isLinkNode(node)) {
            existingLink = node
            break
          }
          const parent = node.getParent()
          if (!parent) break
          node = parent
        }

        if (existingLink) {
          // For existing links, use TOGGLE_LINK_COMMAND to update
          // First remove the existing link
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)

          // Then create a new link with updated URL and text
          const textContent = (
            linkText ||
            existingLink.getTextContent?.() ||
            url
          ).trim()
          if (textContent) {
            const newLinkNode = $createLinkNode(url)
            newLinkNode.append($createTextNode(textContent))
            $insertNodes([newLinkNode])
          }
          return
        }

        // No existing link selected, wrap or insert
        if (selection.getTextContent().length > 0) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
        } else {
          const textContent = (linkText || url).trim()
          if (!textContent) return
          const linkNode = $createLinkNode(url)
          linkNode.append($createTextNode(textContent))
          $insertNodes([linkNode])
        }
      }
    })

    setModalOpen(false)
    setLinkText("")
    setLinkURL("")
  }

  return (
    <Popover
      isOpen={isModalOpen}
      onClose={handleClose}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <IconButton
          icon={<Link45deg />}
          aria-label="Toggle Link"
          size="xs"
          variant={isInLink ? "solid" : "ghost"}
          color="#333"
          onClick={handleClick}
        />
      </PopoverTrigger>
      <PopoverContent width="200px">
        <PopoverArrow />
        <PopoverCloseButton onClick={handleClose} />
        <PopoverHeader fontSize="xs" py={2}>
          Insert Link
        </PopoverHeader>
        <PopoverBody py={2}>
          <div style={{ display: "grid", gap: 4 }}>
            <input
              type="text"
              placeholder={selectedText || "Link Text"}
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              id="linkText"
              style={{
                fontSize: 11,
                padding: 4,
                border: "1px solid #ddd",
                borderRadius: 3
              }}
            />
            <input
              type="text"
              placeholder="URL"
              value={linkURL}
              onChange={(e) => setLinkURL(e.target.value)}
              id="linkURL"
              style={{
                fontSize: 11,
                padding: 4,
                border: "1px solid #ddd",
                borderRadius: 3
              }}
            />
            <div>
              <Button size="xs" onClick={handleApply}>
                Apply
              </Button>
              {isInLink ? (
                <Button
                  size="xs"
                  ml={2}
                  variant="outline"
                  onClick={() => {
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
                    setModalOpen(false)
                  }}
                >
                  Unlink
                </Button>
              ) : null}
            </div>
          </div>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
