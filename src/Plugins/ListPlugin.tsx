import { IconButton } from '@chakra-ui/react'
import React from 'react'
import { ListOl, ListUl } from 'react-bootstrap-icons'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND
} from '@lexical/list'
import { Divider } from '../Components/Divider'

interface ListPluginProps {
  blockType: string
  setBlockType: (type: string) => void
}

const getSelectedBtnProps = (isSelected: boolean) =>
  isSelected
    ? {
        variant: 'solid'
      }
    : {}

export default function ListPlugin({
  blockType,
  setBlockType
}: ListPluginProps) {
  const [editor] = useLexicalComposerContext()

  return (
    <>
      <IconButton
        icon={<ListOl />}
        aria-label="Add Ordered list"
        size="xs"
        variant="ghost"
        color="#333"
        onClick={() => {
          if (blockType === 'ol') {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
            setBlockType('paragraph')
          } else {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
          }
        }}
        {...getSelectedBtnProps(blockType === 'ol')}
      />
      <Divider />
      <IconButton
        icon={<ListUl />}
        aria-label="Add Unordered List"
        size="xs"
        variant="ghost"
        onClick={() => {
          if (blockType === 'ul') {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
            setBlockType('paragraph')
          } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
          }
        }}
        {...getSelectedBtnProps(blockType === 'ul')}
      />
    </>
  )
}
