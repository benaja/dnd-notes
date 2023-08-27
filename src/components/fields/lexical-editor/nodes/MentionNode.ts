/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Character } from "@prisma/client";
import type { Spread } from "lexical";

import {
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedTextNode,
  $applyNodeReplacement,
  TextNode,
} from "lexical";

type CharacterMention = {
  id: string;
  name: string;
};

export type SerializedCharacterMentionNode = Spread<
  {
    character: CharacterMention;
  },
  SerializedTextNode
>;

function convertCharacterMentionElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const textContent = domNode.textContent;

  if (textContent !== null) {
    const node = $createCharacterMentionNode({
      id: domNode.getAttribute("data-mention-id") ?? "",
      name: domNode.getAttribute("data-mention-name") ?? "",
    });
    return {
      node,
    };
  }

  return null;
}

const mentionStyle = "background-color: rgba(24, 119, 232, 0.2)";
export class CharacterMentionNode extends TextNode {
  __character: CharacterMention;

  static getType(): string {
    return "mention";
  }

  static clone(node: CharacterMentionNode): CharacterMentionNode {
    return new CharacterMentionNode(node.__character, node.__key);
  }
  static importJSON(
    serializedNode: SerializedCharacterMentionNode,
  ): CharacterMentionNode {
    const node = $createCharacterMentionNode(serializedNode.character);
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(character: CharacterMention, key?: NodeKey) {
    super(character.name, key);
    this.__character = character;
  }

  exportJSON(): SerializedCharacterMentionNode {
    return {
      ...super.exportJSON(),
      character: this.__character,
      type: "mention",
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cssText = mentionStyle;
    dom.className = "mention";
    dom.setAttribute("data-mention-id", this.__character.id);
    dom.setAttribute("data-mention-name", this.__character.name);
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-mention", "true");
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-mention")) {
          return null;
        }
        return {
          conversion: convertCharacterMentionElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createCharacterMentionNode(
  character: CharacterMention,
): CharacterMentionNode {
  const mentionNode = new CharacterMentionNode(character);
  mentionNode.setMode("segmented").toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}

export function $isCharacterMentionNode(
  node: LexicalNode | null | undefined,
): node is CharacterMentionNode {
  return node instanceof CharacterMentionNode;
}
