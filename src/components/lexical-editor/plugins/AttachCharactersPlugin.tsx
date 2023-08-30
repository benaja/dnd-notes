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

import { $createMentionNode, MentionNode } from "../nodes/MentionNode";
import { trpc } from "~/lib/trpc-client";
import classNames from "classnames";
import { CampaignContext } from "~/pages/app/[campaign]";
import useMentions, { AttachToProps } from "~/lib/hooks/useMentions";
import { PageType } from "~/jsonTypes";
import { PagePreview } from "~/lib/pages";

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
  page: { id: string | null; title: string };

  constructor(page: { id: string | null; title: string }) {
    super(page.id || "create");
    this.page = page;
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
      {!option.page.id && <span>Create:</span>}
      {/* <AppImage
        src={option.page.avatar}
        alt="avatar image"
        className="h-10 w-10 rounded-full object-cover"
        width={64}
        height={64}
      /> */}
      <span className="text">{option.page.title}</span>
    </li>
  );
}

export default function NewMentionsPlugin({
  attachTo,
  onMentionsChanged,
}: {
  attachTo?: AttachToProps;
  onMentionsChanged?: (pages: PagePreview[]) => void;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const utils = trpc.useContext();
  // const [mentionNodes, setMentionNodes] = useState<Map<NodeKey, MentionNode>>(
  //   new Map(),
  // );
  const createPage = trpc.page.create.useMutation({
    onSuccess() {
      utils.campaign.getById.invalidate();
    },
  });
  const campaign = React.useContext(CampaignContext);

  const [queryString, setQueryString] = useState<string | null>(null);
  const { data: results } = trpc.page.filter.useQuery({
    title: queryString,
    campaignId: campaign?.id || "",
  });

  queryString;
  console.log("search result", queryString, results);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  const { onMentionsChange } = useMentions(attachTo ?? {});

  const options = useMemo(() => {
    if (!results) return [];
    if (results.length === 0) {
      return [
        new MentionTypeaheadOption({
          id: "create",
          title: queryString || "Create new page",
        }),
      ];
    }
    return results
      .map((result) => new MentionTypeaheadOption(result))
      .slice(0, SUGGESTION_LIST_LENGTH_LIMIT);
  }, [results, queryString]);

  const onSelectOption = useCallback(
    async (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      let page = selectedOption.page;
      if (!page.id && campaign) {
        page = await createPage.mutateAsync({
          title: selectedOption.page.title,
          campaignId: campaign.id,
          type: PageType.NPC,
          fields: {},
        });
      }

      editor.update(async () => {
        if (!page.id) return;
        const mentionNode = $createMentionNode({
          id: page.id,
          title: page.title,
        });
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        closeMenu();
      });
    },
    [editor, campaign, createPage],
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
      MentionNode,
      (mutatedNodes) => {
        editor.update(async () => {
          const mentionNodes = $nodesOfType(MentionNode);
          const mentionIds = mentionNodes.map((node) => node.__page.id);
          const pages = await utils.page.filter.fetch({
            id: mentionIds,
            campaignId: campaign?.id || "",
          });

          console.log("mentioned pages", pages, mentionNodes);

          onMentionsChanged?.(pages);
          onMentionsChange(pages);
        });
      },
    );

    return () => {
      removeMutationListener();
    };
  }, [editor, onMentionsChanged, onMentionsChange]);

  // useEffect(() => {
  //   editor.update(() => {
  //     const nodes = $nodesOfType(MentionNode);
  //     setMentionNodes(new Map(nodes.map((node) => [node.getKey(), node])));
  //   });
  // }, [editor]);

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      anchorClassName="z-50"
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) =>
        anchorElementRef.current && options.length
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
