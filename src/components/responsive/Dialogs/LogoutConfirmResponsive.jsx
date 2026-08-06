"use client";

import { ProfileLogoutIcon } from "@/components/icons/profile-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrimaryButton } from "@/components/responsive/primitives/PrimaryButton";

export function LogoutConfirmResponsive({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FB7185] to-[#F43F5E]">
            <ProfileLogoutIcon className="size-8 text-white" />
          </div>
          <DialogTitle>Sign out?</DialogTitle>
          <DialogDescription>
            You will need to sign in again to access your bookings and wallet.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <PrimaryButton fullWidth onClick={onConfirm} disabled={loading}>
            {loading ? "Signing out..." : "Sign out"}
          </PrimaryButton>
          <PrimaryButton
            fullWidth
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </PrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
