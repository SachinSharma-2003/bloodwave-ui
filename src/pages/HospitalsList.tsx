import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Building, MapPin, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  created_at: string;
}

const HospitalsList = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHospitals();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('hospitals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hospitals'
        },
        () => fetchHospitals()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setHospitals(data || []);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast.error('Failed to load hospitals');
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Hospitals Directory</h1>
        <p className="text-muted-foreground">Find participating hospitals and medical facilities</p>
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl border border-border p-6 mb-8 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hospitals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {filteredHospitals.length} hospitals found
          </span>
        </div>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hospital) => (
          <Card key={hospital.id} className="card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-3">
                <div className="medical-gradient p-3 rounded-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{hospital.name}</CardTitle>
                  <div className="flex items-center space-x-1 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{hospital.city}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{hospital.address}</p>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{hospital.phone}</span>
              </div>
              
              <div className="pt-2">
                <Badge variant="outline" className="text-xs">
                  Registered: {new Date(hospital.created_at).toLocaleDateString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHospitals.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏥</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No hospitals found</h3>
          <p className="text-muted-foreground">Try adjusting your search to see more results</p>
        </div>
      )}
    </div>
  );
};

export default HospitalsList;