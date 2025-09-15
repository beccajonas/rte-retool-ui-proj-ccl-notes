import { Box, ButtonGroup, Flex, IconButton, Select } from "@chakra-ui/react"
import {
  LOW_PRIORIRTY,
  RICH_TEXT_OPTIONS,
  RichTextAction
} from "../Constants/index"
import { Divider } from "../Components/Divider"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
  $isRangeSelection
} from "lexical"
import { useState, useEffect } from "react"
import { mergeRegister, $getNearestNodeOfType } from "@lexical/utils"
import { css } from "@chakra-ui/react"
import ListPlugin from "./ListPlugin"
import { $isListNode, ListNode } from "@lexical/list"
import CodeBlockPlugin from "./CodeBlockPlugin"
import ImagePlugin from "./ImagePlugin"
import LinkPlugin from "./LinkPlugin"

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [disableMap, setDisableMap] = useState<{ [id: string]: boolean }>({
    [RichTextAction.Undo]: true,
    [RichTextAction.Redo]: true
  })
  const [selectionMap, setSelectionMap] = useState<{ [id: string]: boolean }>(
    {}
  )
  const [blockType, setBlockType] = useState("paragraph")

  const updateToolbar = () => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      const newSelectionMap = {
        [RichTextAction.Bold]: selection.hasFormat("bold"),
        [RichTextAction.Italics]: selection.hasFormat("italic"),
        [RichTextAction.Underline]: selection.hasFormat("underline"),
        [RichTextAction.Strikethrough]: selection.hasFormat("strikethrough"),
        [RichTextAction.Superscript]: selection.hasFormat("superscript"),
        [RichTextAction.Subscript]: selection.hasFormat("subscript"),
        [RichTextAction.Highlight]: selection.hasFormat("highlight"),
        [RichTextAction.Code]: selection.hasFormat("code")
      }
      setSelectionMap(newSelectionMap)

      const anchorNode = selection.anchor.getNode()
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()
      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)

      if (!elementDOM) return

      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode)
        const type = parentList ? parentList.getTag() : element.getTag()
        console.log("Setting block type to:", type)
        setBlockType(type)
        console.log("Block type set to:", blockType)
      } else {
        setBlockType("paragraph")
      }
    }
  }

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (payLoad) => {
          updateToolbar()
          return false
        },
        LOW_PRIORIRTY
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payLoad) => {
          setDisableMap((prevDisableMap) => ({
            ...prevDisableMap,
            undo: !payLoad
          }))
          return false // Disable undo command
        },
        LOW_PRIORIRTY
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payLoad) => {
          setDisableMap((prevDisableMap) => ({
            ...prevDisableMap,
            redo: !payLoad
          }))
          return false // Disable redo command
        },
        LOW_PRIORIRTY
      )
    )
  }, [])

  const onAction = (id: RichTextAction) => {
    console.log("Action triggered:", id)
    switch (id) {
      case RichTextAction.Bold: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        break
      }
      case RichTextAction.Italics: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
        break
      }
      case RichTextAction.Underline: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        break
      }
      case RichTextAction.Strikethrough: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        break
      }
      case RichTextAction.Superscript: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")
        break
      }
      case RichTextAction.Subscript: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")
        break
      }
      case RichTextAction.Highlight: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight")
        break
      }
      case RichTextAction.Code: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")
        break
      }
      case RichTextAction.LeftAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
        break
      }
      case RichTextAction.RightAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
        break
      }
      case RichTextAction.CenterAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
        break
      }
      case RichTextAction.JustifyAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
        break
      }
      case RichTextAction.Undo: {
        editor.dispatchCommand(UNDO_COMMAND, undefined)
        break
      }
      case RichTextAction.Redo: {
        editor.dispatchCommand(REDO_COMMAND, undefined)
        break
      }
    }
  }

  const getSelectedBtnProps = (isSelected: boolean) =>
    isSelected
      ? {
          variant: "solid"
        }
      : {}

  return (
    <Box>
      <ButtonGroup size="xs" isAttached variant="ghost" color="#444">
        {RICH_TEXT_OPTIONS.map((option, index) => {
          const { id, label, icon, fontSize } = option
          if (id === RichTextAction.Divider) {
            return <Divider key={`divider-${index}`} />
          }
          return (
            <IconButton
              key={id}
              aria-label={label as string}
              icon={icon}
              fontSize={fontSize}
              onClick={() => onAction(id)}
              isDisabled={disableMap[id]}
              {...getSelectedBtnProps(selectionMap[id])}
            />
          )
        })}

        {/* Add your plugins inline in the same ButtonGroup */}
        <Divider />
        <ListPlugin blockType={blockType} setBlockType={setBlockType} />
        <Divider />
        <CodeBlockPlugin />
        <Divider />
        <ImagePlugin />
        {/* <Divider /> */}
        {/* <LinkPlugin /> */}
      </ButtonGroup>
    </Box>
  )
}
