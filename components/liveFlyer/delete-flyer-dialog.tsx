"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteFlyerDialogProps {
  isOpen: boolean
  flyerTitle: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteFlyerDialog({ isOpen, flyerTitle, onConfirm, onCancel }: DeleteFlyerDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Flyer</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{flyerTitle}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
