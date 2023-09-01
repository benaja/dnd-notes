/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useState } from "react";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export default function useDialog(): [
  JSX.Element | null,
  (title: string, showDialog: (onClose: () => void) => JSX.Element) => void,
] {
  const [dialogContent, setDialogContent] = useState<null | {
    closeOnClickOutside: boolean;
    content: JSX.Element;
    title: string;
  }>(null);

  const onClose = useCallback(() => {
    setDialogContent(null);
  }, []);

  const dialog = useMemo(() => {
    if (dialogContent === null) {
      return null;
    }
    const { title, content, closeOnClickOutside } = dialogContent;
    return (
      <Dialog open={true} onOpenChange={(value) => !value && onClose()}>
        {/* <DialogTrigger asChild>
          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl hover:bg-gray-200">
            +
          </button>
        </DialogTrigger> */}
        <DialogContent className="w-[800px] max-w-full">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }, [dialogContent, onClose]);

  const showDialog = useCallback(
    (
      title: string,
      getContent: (onClose: () => void) => JSX.Element,
      closeOnClickOutside = false,
    ) => {
      setDialogContent({
        closeOnClickOutside,
        content: getContent(onClose),
        title,
      });
    },
    [onClose],
  );

  return [dialog, showDialog];
}
