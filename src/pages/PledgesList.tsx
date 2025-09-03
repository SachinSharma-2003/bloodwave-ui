import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusChip from "@/components/StatusChip";
import { Search, Calendar, User, Droplets, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Pledge {
  id: string;
  units_pledged: number;
  status: string;
  created_at: string;
  donor_name: string;
  donor_phone: string;
  request_blood_group: string;
  request_hospital_name: string;
  request_city: string;
}

const PledgesList = () => {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchPledges();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('pledges-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pledges'
        },
        () => fetchPledges()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPledges = async () => {
    try {
      const { data, error } = await supabase
        .from('pledges_with_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPledges(data || []);
    } catch (error) {
      console.error('Error fetching pledges:', error);
      toast.error('Failed to load pledges');
    } finally {
      setLoading(false);
    }
  };

  const filteredPledges = pledges.filter(pledge => {
    const matchesStatus = statusFilter === "all" || pledge.status === statusFilter;
    const matchesSearch = searchTerm === "" || 
      pledge.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pledge.request_hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pledge.request_blood_group.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusChipStatus = (status: string) => {
    switch (status) {
      case 'confirmed': return 'available' as const;
      case 'completed': return 'fulfilled' as const;
      case 'cancelled': return 'cancelled' as const;
      default: return 'pending' as const;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading pledges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Pledges Directory</h1>
        <p className="text-muted-foreground">Track all blood donation pledges and their status</p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pledges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pledged">Pledged</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {filteredPledges.length} pledges found
            </span>
          </div>
        </div>
      </div>

      {/* Pledges List */}
      <div className="space-y-4">
        {filteredPledges.map((pledge) => (
          <Card key={pledge.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="medical-gradient p-2 rounded-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{pledge.donor_name}</h3>
                      <p className="text-sm text-muted-foreground">{pledge.donor_phone}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusChip status={getStatusChipStatus(pledge.status)} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(pledge.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Blood Group</p>
                    <Badge variant="outline" className="font-medium">
                      {pledge.request_blood_group}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Hospital</p>
                    <p className="text-sm text-muted-foreground">{pledge.request_hospital_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Units Pledged</p>
                    <p className="text-lg font-semibold text-primary">{pledge.units_pledged}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Location: {pledge.request_city}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPledges.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤝</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No pledges found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more results</p>
        </div>
      )}
    </div>
  );
};

export default PledgesList;