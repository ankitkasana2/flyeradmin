"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteFlyerDialogProps {
  isOpen: boolean;
  flyerTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteFlyerDialog({
  isOpen,
  flyerTitle,
  onConfirm,
  onCancel,
}: DeleteFlyerDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent className="bg-gradient-to-b from-card to-card/95 border border-border/40 backdrop-blur-sm">
        <AlertDialogHeader className="border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/20 rounded-lg">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-foreground">
              Delete Flyer
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground mt-3 text-base">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-primary">{flyerTitle}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end pt-4">
          <AlertDialogCancel className="border-border/40 text-muted-foreground hover:text-foreground">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold shadow-lg"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
