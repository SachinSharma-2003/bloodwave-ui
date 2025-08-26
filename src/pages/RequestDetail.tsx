import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusChip from "@/components/StatusChip";
import ProgressBar from "@/components/ProgressBar";
import PledgeModal from "@/components/PledgeModal";
import { mockRequests, mockPledges } from "@/data/mockData";
import { ArrowLeft, Calendar, MapPin, AlertTriangle, Heart, Phone, User } from "lucide-react";

const RequestDetail = () => {
  const { id } = useParams();
  const [pledgeModalOpen, setPledgeModalOpen] = useState(false);
  
  const request = mockRequests.find(r => r.id === id);
  const pledges = mockPledges.filter(p => p.requestId === id);

  if (!request) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-2">Request Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested blood request could not be found.</p>
          <Link to="/requests">
            <Button variant="outline">Back to Requests</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/requests" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Requests
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Blood Request Details</h1>
            <p className="text-muted-foreground">Request ID: {request.id}</p>
          </div>
          {request.status === "open" && (
            <Button 
              onClick={() => setPledgeModalOpen(true)}
              className="medical-gradient"
            >
              <Heart className="h-4 w-4 mr-2" />
              Pledge Now
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Request Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                    <div className="mt-1">
                      <Badge variant="outline" className="font-medium text-lg px-3 py-1">
                        {request.bloodGroup}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Hospital</label>
                    <p className="mt-1 font-medium text-foreground">{request.hospitalName}</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{request.city}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      <StatusChip status={request.status} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Priority</label>
                    <div className={`mt-1 flex items-center space-x-1 ${getUrgencyColor(request.urgency)}`}>
                      <AlertTriangle className="h-4 w-4" />
                      <span className="capitalize font-medium">{request.urgency}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      Created: {new Date(request.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {request.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1 text-foreground">{request.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Fulfillment Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressBar 
                current={request.unitsFulfilled} 
                total={request.unitsRequired}
              />
            </CardContent>
          </Card>

          {/* Pledges */}
          <Card>
            <CardHeader>
              <CardTitle>Pledges ({pledges.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {pledges.length > 0 ? (
                <div className="space-y-4">
                  {pledges.map((pledge) => (
                    <div key={pledge.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="medical-gradient p-2 rounded-lg">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{pledge.donorName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(pledge.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{pledge.units} units</p>
                        <StatusChip 
                          status={pledge.status === "confirmed" ? "available" : "pending"} 
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pledges yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Be the first to pledge for this request</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{request.unitsRequired}</div>
                <p className="text-sm text-muted-foreground">Units Required</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-success">{request.unitsFulfilled}</div>
                <p className="text-sm text-muted-foreground">Units Pledged</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-warning">
                  {request.unitsRequired - request.unitsFulfilled}
                </div>
                <p className="text-sm text-muted-foreground">Units Remaining</p>
              </div>
            </CardContent>
          </Card>

          {request.status === "open" && (
            <Card>
              <CardHeader>
                <CardTitle>Help Save Lives</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Your donation can make a difference. Every unit counts towards saving lives.
                </p>
                <Button 
                  onClick={() => setPledgeModalOpen(true)}
                  className="w-full medical-gradient"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Make a Pledge
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <PledgeModal 
        open={pledgeModalOpen}
        onOpenChange={setPledgeModalOpen}
        request={request}
      />
    </div>
  );
};

export default RequestDetail;