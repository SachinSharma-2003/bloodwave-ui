import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bloodGroups, cities } from "@/data/mockData";
import { Plus, Building, MapPin, Droplets, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NewRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    bloodGroup: "",
    city: "",
    unitsRequired: "",
    urgency: "",
    hospitalName: "",
    description: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bloodGroup || !formData.city || !formData.unitsRequired || !formData.urgency || !formData.hospitalName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Request Created Successfully!",
      description: `Your request for ${formData.unitsRequired} units of ${formData.bloodGroup} blood has been created.`,
    });

    // Reset form and navigate
    setFormData({
      bloodGroup: "",
      city: "",
      unitsRequired: "",
      urgency: "",
      hospitalName: "",
      description: ""
    });
    
    setIsSubmitting(false);
    navigate("/requests");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Create New Blood Request</h1>
        <p className="text-muted-foreground">Submit a new request to find blood donors in your area</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="medical-gradient p-2 rounded-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <span>Request Details</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hospital Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>Hospital Information</span>
              </h3>
              
              <div>
                <Label htmlFor="hospitalName">Hospital Name *</Label>
                <Input
                  id="hospitalName"
                  placeholder="Enter hospital name"
                  value={formData.hospitalName}
                  onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{city}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Blood Request Details */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground flex items-center space-x-2">
                <Droplets className="h-4 w-4" />
                <span>Blood Request Details</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bloodGroup">Blood Group *</Label>
                  <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange("bloodGroup", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span>{group}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="unitsRequired">Units Required *</Label>
                  <Input
                    id="unitsRequired"
                    type="number"
                    min="1"
                    max="50"
                    placeholder="Enter number of units"
                    value={formData.unitsRequired}
                    onChange={(e) => handleInputChange("unitsRequired", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        <span>Low Priority</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span>Medium Priority</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <span>High Priority (Emergency)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Additional Information (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter any additional details about the request..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Provide context like patient condition, surgery details, or any special requirements
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/requests")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 medical-gradient"
              >
                {isSubmitting ? "Creating Request..." : "Create Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h4 className="font-medium text-foreground mb-2">💡 Request Tips</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Be specific about urgency levels to help donors prioritize</li>
            <li>• Include relevant medical details in the description</li>
            <li>• Monitor your request regularly for new pledges</li>
            <li>• Contact donors promptly once they pledge</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewRequest;