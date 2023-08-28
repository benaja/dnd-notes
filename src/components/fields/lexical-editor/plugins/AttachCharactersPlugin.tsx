/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $getNodeByKey, $nodesOfType, NodeKey, TextNode } from "lexical";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  $createCharacterMentionNode,
  CharacterMentionNode,
} from "../nodes/MentionNode";
import { trpc } from "~/lib/trpc-client";
import { Character } from "@prisma/client";
import AppImage from "~/components/ui/AppImage";
import classNames from "classnames";

const PUNCTUATION =
  "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";
const NAME = "\\b[A-Z][^\\s" + PUNCTUATION + "]";

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const CapitalizedNameMentionsRegex = new RegExp(
  "(^|[^#])((?:" + DocumentMentionsRegex.NAME + "{" + 1 + ",})$)",
);

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ["@"].join("");

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = "[^" + TRIGGERS + PUNC + "\\s]";

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  "(?:" +
  "\\.[ |$]|" + // E.g. "r. " in "Mr. Smith"
  " |" + // E.g. " " in "Josh Duck"
  "[" +
  PUNC +
  "]|" + // E.g. "-' in "Salier-Hellendag"
  ")";

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  "(^|\\s|\\()(" +
    "[" +
    TRIGGERS +
    "]" +
    "((?:" +
    VALID_CHARS +
    VALID_JOINS +
    "){0," +
    LENGTH_LIMIT +
    "})" +
    ")$",
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  "(^|\\s|\\()(" +
    "[" +
    TRIGGERS +
    "]" +
    "((?:" +
    VALID_CHARS +
    "){0," +
    ALIAS_LENGTH_LIMIT +
    "})" +
    ")$",
);

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

function useMentionLookupService(mentionString: string | null) {
  const [results, setResults] = useState<Character[]>([]);
  const utils = trpc.useContext();

  useEffect(() => {
    if (mentionString == null) {
      setResults([]);
      return;
    }

    utils.character.search.fetch(mentionString).then((data) => {
      setResults(data);
    });
  }, [mentionString]);

  return results;
}

function checkForCapitalizedNameMentions(
  text: string,
  minMatchLength: number,
): MenuTextMatch | null {
  const match = CapitalizedNameMentionsRegex.exec(text);
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[2];
    if (matchingString != null && matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: matchingString,
      };
    }
  }
  return null;
}

function checkForAtSignMentions(
  text: string,
  minMatchLength: number,
): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  const match = checkForAtSignMentions(text, 1);
  return match === null ? checkForCapitalizedNameMentions(text, 3) : match;
}

class MentionTypeaheadOption extends MenuOption {
  character: Character;

  constructor(character: Character) {
    super(character.id);
    this.character = character;
  }
}

function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}) {
  let className = "item";
  if (isSelected) {
    className += " selected";
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={classNames(
        {
          "bg-gray-100": isSelected,
        },
        "flex items-center gap-4",
      )}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={"typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <AppImage
        src={option.character.avatar}
        alt="avatar image"
        className="h-10 w-10 rounded-full object-cover"
        width={64}
        height={64}
      />
      <span className="text">{option.character.name}</span>
    </li>
  );
}

export default function NewMentionsPlugin({
  onCharactersChanged,
}: {
  onCharactersChanged?: (characters: Character[]) => void;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const utils = trpc.useContext();
  const [characterNodes, setCharacterNodes] = useState<
    Map<NodeKey, CharacterMentionNode>
  >(new Map());

  const [queryString, setQueryString] = useState<string | null>(null);

  const results = useMentionLookupService(queryString);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  const options = useMemo(() => {
    if (results.length === 0) {
      return [
        new MentionTypeaheadOption({
          id: null,
          name: queryString,
        }),
      ];
    }
    return results
      .map((result) => new MentionTypeaheadOption(result))
      .slice(0, SUGGESTION_LIST_LENGTH_LIMIT);
  }, [results, queryString]);

  console.log("options", options);

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        const mentionNode = $createCharacterMentionNode(
          selectedOption.character,
        );
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      if (slashMatch !== null) {
        return null;
      }
      return getPossibleQueryMatch(text);
    },
    [checkForSlashTriggerMatch, editor],
  );

  useEffect(() => {
    const removeMutationListener = editor.registerMutationListener(
      CharacterMentionNode,
      (mutatedNodes) => {
        editor.update(async () => {
          const characterNodes = $nodesOfType(CharacterMentionNode);
          const characterIds = characterNodes.map(
            (node) => node.__character.id,
          );
          const characters = await utils.character.getByIds.fetch(characterIds);

          onCharactersChanged?.(characters);
        });
      },
    );

    return () => {
      removeMutationListener();
    };
  }, [editor, utils.character.getByIds, characterNodes, onCharactersChanged]);

  useEffect(() => {
    editor.update(() => {
      const nodes = $nodesOfType(CharacterMentionNode);
      setCharacterNodes(new Map(nodes.map((node) => [node.getKey(), node])));
    });
  }, [editor]);

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) =>
        anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <div className="mt-8 w-80 rounded bg-white p-4 shadow">
                <ul>
                  {options.map((option, i: number) => (
                    <MentionsTypeaheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current,
            )
          : null
      }
    />
  );
}
