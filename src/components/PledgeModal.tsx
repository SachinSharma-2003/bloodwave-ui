import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, User, Droplets } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Request {
  id: string;
  blood_group: string;
  hospital_name: string;
  city: string;
  units_required: number;
  units_fulfilled: number;
}

interface PledgeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: Request | null;
}

const PledgeModal = ({ open, onOpenChange, request }: PledgeModalProps) => {
  const [units, setUnits] = useState("");
  const [donorName, setDonorName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!units || !donorName || !phone || !request) return;

    setIsSubmitting(true);
    
    try {
      // Create pledge in Supabase
      const { error } = await supabase
        .from('pledges')
        .insert([{
          request_id: request.id,
          units_pledged: parseInt(units),
          donor_id: '00000000-0000-0000-0000-000000000000', // Placeholder
          status: 'pledged'
        }]);

      if (error) throw error;

      toast.success(`Thank you ${donorName}! Your pledge of ${units} units has been recorded.`);

      // Reset form
      setUnits("");
      setDonorName("");
      setPhone("");
      setNotes("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating pledge:', error);
      toast.error('Failed to create pledge. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                <span className="font-medium">{request.blood_group}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {request.city}
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Need: {request.units_required - request.units_fulfilled} more units
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
                max={request.units_required - request.units_fulfilled}
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