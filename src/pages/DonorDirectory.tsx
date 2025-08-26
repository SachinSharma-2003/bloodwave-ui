import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import StatusChip from "@/components/StatusChip";
import { mockDonors, bloodGroups, cities } from "@/data/mockData";
import { Search, Phone, Mail, Calendar } from "lucide-react";

const DonorDirectory = () => {
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDonors = useMemo(() => {
    return mockDonors.filter((donor) => {
      const matchesBloodGroup = bloodGroupFilter === "all" || donor.bloodGroup === bloodGroupFilter;
      const matchesCity = cityFilter === "all" || donor.city === cityFilter;
      const matchesSearch = searchTerm === "" || 
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesBloodGroup && matchesCity && matchesSearch;
    });
  }, [bloodGroupFilter, cityFilter, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Donor Directory</h1>
        <p className="text-muted-foreground">Find and connect with blood donors in your area</p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search donors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Blood Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blood Groups</SelectItem>
              {bloodGroups.map((group) => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {filteredDonors.length} donors found
            </span>
          </div>
        </div>
      </div>

      {/* Donor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonors.map((donor) => (
          <Card key={donor.id} className="card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{donor.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="font-medium">
                      {donor.bloodGroup}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{donor.city}</span>
                  </div>
                </div>
                <StatusChip 
                  status={donor.isAvailable ? "available" : "unavailable"} 
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{donor.phone}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{donor.email}</span>
              </div>
              
              {donor.lastDonation && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Last donation: {new Date(donor.lastDonation).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="pt-2">
                <button
                  disabled={!donor.isAvailable}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    donor.isAvailable
                      ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {donor.isAvailable ? "Contact Donor" : "Currently Unavailable"}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDonors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🩸</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No donors found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more results</p>
        </div>
      )}
    </div>
  );
};

export default DonorDirectory;