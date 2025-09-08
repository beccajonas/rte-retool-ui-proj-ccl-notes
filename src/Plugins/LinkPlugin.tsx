import React, { useState } from "react"
import { Link45deg, Link } from "react-bootstrap-icons"
import { IconButton, Button } from "@chakra-ui/react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getSelection, $isRangeSelection } from "lexical"
import Modal from "../Components/Modal"

export default function LinkPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedText, setSelectedText] = useState("")

  const handleClick = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        setSelectedText(selection.getTextContent())
      } else {
        setSelectedText("")
      }
    })
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
  }

  return (
    <>
      <IconButton
        icon={<Link45deg />}
        aria-label="Toggle Link"
        size="xs"
        variant="ghost"
        color="#333"
        onClick={handleClick}
      />

      <Modal
        title="Insert Link"
        isOpen={isModalOpen}
        onClose={handleClose}
        footer={null}
      >
        <div>
          <input
            type="text"
            placeholder={selectedText || "Link Text"}
            defaultValue={selectedText}
            id="linkText"
          />
          <input type="text" placeholder="URL" id="linkURL" />
        </div>
        <Button>Apply</Button>
      </Modal>
    </>
  )
}
