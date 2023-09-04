/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useState } from "react";
import * as React from "react";
import { Button } from "~/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export default function useConfirmDialog(): [
  JSX.Element | null,
  (title: string, onConfirm: () => void) => void,
] {
  const [dialogContent, setDialogContent] = useState<null | {
    closeOnClickOutside: boolean;
    onConfirm: () => void;
    title: string;
  }>(null);

  const onClose = useCallback(() => {
    setDialogContent(null);
  }, []);

  const dialog = useMemo(() => {
    if (dialogContent === null) {
      return null;
    }
    const { title, onConfirm } = dialogContent;
    return (
      <Dialog open={true} onOpenChange={(value) => !value && onClose()}>
        <DialogContent className="w-[400px] max-w-full" disableCloseIcon>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant={"secondary"} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }, [dialogContent, onClose]);

  const showDialog = useCallback(
    (title: string, onConfirm: () => void, closeOnClickOutside = false) => {
      setDialogContent({
        closeOnClickOutside,
        title,
        onConfirm,
      });
    },
    [],
  );

  return [dialog, showDialog];
}
