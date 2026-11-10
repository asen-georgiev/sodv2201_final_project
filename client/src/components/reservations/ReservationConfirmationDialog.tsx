import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReservationConfirmationDialogProps {
  onClose: () => void;
}

export default function ReservationConfirmationDialog({
  onClose,
}: ReservationConfirmationDialogProps) {
  const navigate = useNavigate();

  function handleMyReservations() {
    onClose();
    navigate("/account");
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="rounded-2xl p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Your table is waiting.
          </DialogTitle>

          <DialogDescription className="rounded-lg bg-emerald-50 p-4 text-emerald-800">
            Your reservation request has been saved successfully.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-stone-600">
          Review and manage reservations from My Account.
        </p>

        <DialogFooter className="gap-2 border-0 bg-white">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>

          <Button
            type="button"
            onClick={handleMyReservations}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            My reservations
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
