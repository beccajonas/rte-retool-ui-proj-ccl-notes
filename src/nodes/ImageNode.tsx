import {
  DecoratorNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type NodeKey
} from 'lexical'
import type { JSX } from 'react'

export const $createImageNode = ({
  altText,
  height,
  maxWidth = 400,
  src,
  width
}: {
  altText: string
  height?: number
  maxWidth?: number
  src: string
  width?: number
}) => {
  return new ImageNode({ altText, height, maxWidth, src, width })
}

const convertImageElement = (domNode: Node): DOMConversionOutput | null => {
  if (domNode instanceof HTMLImageElement) {
    const { src, alt } = domNode
    const node = $createImageNode({ src, altText: alt })
    return { node }
  }
  return null
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string
  __altText: string
  __height: 'inherit' | number
  __width: 'inherit' | number
  __maxWidth: number

  constructor({
    src = '',
    altText = '',
    maxWidth = 500,
    width = 'inherit',
    height = 'inherit',
    key
  }: {
    src?: string
    altText?: string
    maxWidth?: number
    width?: 'inherit' | number
    height?: 'inherit' | number
    key?: NodeKey
  } = {}) {
    // ✅ Default empty object
    super(key)
    this.__src = src
    this.__altText = altText
    this.__width = width
    this.__height = height
    this.__maxWidth = maxWidth
  }

  static getType(): string {
    return 'image'
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode({
      src: node.__src,
      altText: node.__altText,
      width: node.__width,
      height: node.__height,
      maxWidth: node.__maxWidth,
      key: node.__key
    })
  }

  decorate(): JSX.Element {
    return (
      <img
        src={this.__src}
        alt={this.__altText}
        style={{
          width: this.__width,
          height: this.__height,
          maxWidth: this.__maxWidth
        }}
      />
    )
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span')
    return span
  }

  exportDOM(): DOMExportOutput {
    const image = document.createElement('img')
    image.setAttribute('src', this.__src)
    image.setAttribute('alt', this.__altText)

    return { element: image }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => {
        return { conversion: convertImageElement, priority: 0 }
      }
    }
  }
}
