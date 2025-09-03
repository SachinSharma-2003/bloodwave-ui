import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { bloodGroups, cities } from "@/data/mockData";
import { UserPlus, User, Mail, Phone, MapPin, Droplets, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DonorRegistration = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    city: "",
    available: true,
    lastDonated: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.bloodGroup || !formData.city) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('donors')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          blood_group: formData.bloodGroup,
          city: formData.city,
          available: formData.available,
          last_donated: formData.lastDonated || null
        }]);

      if (error) throw error;

      toast.success("Registration successful! You are now a registered donor.");
      
      // Reset form and navigate
      setFormData({
        name: "",
        email: "",
        phone: "",
        bloodGroup: "",
        city: "",
        available: true,
        lastDonated: ""
      });
      
      navigate("/");
    } catch (error) {
      console.error('Error registering donor:', error);
      toast.error("Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Become a Blood Donor</h1>
        <p className="text-muted-foreground">Join our community of life-saving heroes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="medical-gradient p-2 rounded-lg">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <span>Donor Registration</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Personal Information</span>
              </h3>
              
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground flex items-center space-x-2">
                <Droplets className="h-4 w-4" />
                <span>Medical Information</span>
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

              <div>
                <Label htmlFor="lastDonated">Last Donation Date (Optional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastDonated"
                    type="date"
                    value={formData.lastDonated}
                    onChange={(e) => handleInputChange("lastDonated", e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Help us determine your eligibility for immediate donation
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => handleInputChange("available", checked)}
                />
                <Label htmlFor="available">Available for donations</Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 medical-gradient"
              >
                {isSubmitting ? "Registering..." : "Register as Donor"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h4 className="font-medium text-foreground mb-2">🩸 Donation Requirements</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Age: 18-65 years old</li>
            <li>• Weight: Minimum 110 lbs (50 kg)</li>
            <li>• Must wait 56 days between whole blood donations</li>
            <li>• No recent tattoos or piercings (12 months)</li>
            <li>• Good overall health condition</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorRegistration;