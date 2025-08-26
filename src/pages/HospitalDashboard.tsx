import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusChip from "@/components/StatusChip";
import ProgressBar from "@/components/ProgressBar";
import { mockRequests } from "@/data/mockData";
import { Plus, Calendar, MapPin, AlertTriangle, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const HospitalDashboard = () => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  const stats = {
    totalRequests: mockRequests.length,
    openRequests: mockRequests.filter(r => r.status === "open").length,
    fulfilledRequests: mockRequests.filter(r => r.status === "fulfilled").length,
    totalUnitsNeeded: mockRequests
      .filter(r => r.status === "open")
      .reduce((sum, r) => sum + (r.unitsRequired - r.unitsFulfilled), 0)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Hospital Dashboard</h1>
          <p className="text-muted-foreground">Manage your blood requests and track donations</p>
        </div>
        <Link to="/new-request">
          <Button className="medical-gradient">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.openRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fulfilled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{stats.fulfilledRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Units Needed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{stats.totalUnitsNeeded}</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {mockRequests.map((request) => (
          <Card key={request.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="font-medium text-lg px-3 py-1">
                      {request.bloodGroup}
                    </Badge>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{request.city}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(request.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <StatusChip status={request.status} />
                    <div className={`flex items-center space-x-1 text-sm ${getUrgencyColor(request.urgency)}`}>
                      <AlertTriangle className="h-4 w-4" />
                      <span className="capitalize">{request.urgency} Priority</span>
                    </div>
                  </div>
                </div>

                <Link to={`/request/${request.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-1">{request.hospitalName}</h4>
                {request.description && (
                  <p className="text-sm text-muted-foreground">{request.description}</p>
                )}
              </div>

              <ProgressBar 
                current={request.unitsFulfilled} 
                total={request.unitsRequired}
                className="max-w-md"
              />

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Required: {request.unitsRequired} units</span>
                <span>Fulfilled: {request.unitsFulfilled} units</span>
                <span>Remaining: {request.unitsRequired - request.unitsFulfilled} units</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No requests yet</h3>
          <p className="text-muted-foreground mb-4">Create your first blood request to get started</p>
          <Link to="/new-request">
            <Button className="medical-gradient">
              <Plus className="h-4 w-4 mr-2" />
              Create New Request
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HospitalDashboard;