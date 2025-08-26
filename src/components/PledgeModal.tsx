import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BloodRequest } from "@/data/mockData";
import { Heart, User, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PledgeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: BloodRequest | null;
}

const PledgeModal = ({ open, onOpenChange, request }: PledgeModalProps) => {
  const [units, setUnits] = useState("");
  const [donorName, setDonorName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!units || !donorName || !phone) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Pledge Submitted Successfully!",
      description: `Thank you ${donorName}! Your pledge of ${units} units has been recorded.`,
    });

    // Reset form
    setUnits("");
    setDonorName("");
    setPhone("");
    setNotes("");
    setIsSubmitting(false);
    onOpenChange(false);
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="medical-gradient p-2 rounded-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span>Make a Pledge</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Request Info */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-primary" />
                <span className="font-medium">{request.bloodGroup}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {request.city}
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Need: {request.unitsRequired - request.unitsFulfilled} more units
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="donorName">Your Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="donorName"
                    placeholder="Enter your name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1-555-0123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="units">Units to Pledge</Label>
              <Input
                id="units"
                type="number"
                min="1"
                max={request.unitsRequired - request.unitsFulfilled}
                placeholder="Enter number of units"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 medical-gradient"
              >
                {isSubmitting ? "Submitting..." : "Submit Pledge"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PledgeModal;