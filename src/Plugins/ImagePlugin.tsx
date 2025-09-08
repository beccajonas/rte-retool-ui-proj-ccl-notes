import { Button, IconButton } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { ImageFill } from 'react-bootstrap-icons'
import Modal from '../Components/Modal'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createImageNode } from '../nodes/ImageNode'
import { $insertNodes } from 'lexical'

export default function ImagePlugin() {
  const [isOpen, setIsOpen] = useState(false)
  const [url, setURL] = useState('')
  const [file, setFile] = useState<File>()
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [editor] = useLexicalComposerContext()

  const onAddImage = () => {
    let src = ''
    if (url) src = url
    if (file) src = URL.createObjectURL(file)

    editor.update(() => {
      const node = $createImageNode({ src, altText: '' })
      $insertNodes([node])
    })
    setFile(undefined)
    setURL('')
    setIsOpen(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile)
    }
  }

  return (
    <div>
      <IconButton
        icon={<ImageFill />}
        aria-label="Add Image"
        size="xs"
        variant="ghost"
        onClick={() => setIsOpen(true)}
      />
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const selectedFile = e.target.files?.[0]
          if (selectedFile) {
            setFile(selectedFile)
          }
          e.target.value = ''
        }}
      />
      {isOpen && (
        <Modal
          title="Add Image"
          onClose={() => setIsOpen(false)}
          footer={
            <Button
              variant="ghost"
              isDisabled={!url && !file}
              onClick={onAddImage}
            >
              Add Image
            </Button>
          }
          isOpen={isOpen}
        >
          <div
            style={{
              position: 'relative'
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsDragging(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsDragging(false)
            }}
            onDrop={handleDrop}
          >
            {/* Main drop area */}
            <div
              style={{
                border: '2px dashed #ccc',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => inputRef?.current?.click()}
            >
              {file
                ? `Selected: ${file.name}`
                : 'Drag and drop an image here, or click to select'}
            </div>

            {/* Drag overlay */}
            {isDragging && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  borderRadius: '8px',
                  pointerEvents: 'none'
                }}
              >
                Drop image here
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
