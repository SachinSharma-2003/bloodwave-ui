export interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  city: string;
  isAvailable: boolean;
  phone: string;
  email: string;
  lastDonation?: string;
}

export interface Pledge {
  id: string;
  donorId: string;
  donorName: string;
  requestId: string;
  units: number;
  date: string;
  status: "confirmed" | "pending";
}

export interface BloodRequest {
  id: string;
  bloodGroup: string;
  city: string;
  unitsRequired: number;
  unitsFulfilled: number;
  status: "open" | "fulfilled" | "cancelled";
  hospitalName: string;
  createdDate: string;
  urgency: "low" | "medium" | "high";
  description?: string;
}

// Mock data
export const mockDonors: Donor[] = [
  {
    id: "1",
    name: "John Smith",
    bloodGroup: "O+",
    city: "New York",
    isAvailable: true,
    phone: "+1-555-0123",
    email: "john.smith@email.com",
    lastDonation: "2024-01-15"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    bloodGroup: "A+",
    city: "Los Angeles",
    isAvailable: true,
    phone: "+1-555-0124",
    email: "sarah.j@email.com",
    lastDonation: "2024-02-20"
  },
  {
    id: "3",
    name: "Mike Davis",
    bloodGroup: "B-",
    city: "Chicago",
    isAvailable: false,
    phone: "+1-555-0125",
    email: "mike.davis@email.com",
    lastDonation: "2024-08-15"
  },
  {
    id: "4",
    name: "Emily Chen",
    bloodGroup: "AB+",
    city: "San Francisco",
    isAvailable: true,
    phone: "+1-555-0126",
    email: "emily.chen@email.com",
    lastDonation: "2024-01-30"
  },
  {
    id: "5",
    name: "David Wilson",
    bloodGroup: "O-",
    city: "Boston",
    isAvailable: true,
    phone: "+1-555-0127",
    email: "david.w@email.com",
    lastDonation: "2023-12-10"
  },
  {
    id: "6",
    name: "Lisa Rodriguez",
    bloodGroup: "A-",
    city: "Miami",
    isAvailable: false,
    phone: "+1-555-0128",
    email: "lisa.r@email.com",
    lastDonation: "2024-08-20"
  }
];

export const mockRequests: BloodRequest[] = [
  {
    id: "req-1",
    bloodGroup: "O+",
    city: "New York",
    unitsRequired: 10,
    unitsFulfilled: 6,
    status: "open",
    hospitalName: "NYC General Hospital",
    createdDate: "2024-08-20",
    urgency: "high",
    description: "Emergency surgery patient needs immediate blood transfusion"
  },
  {
    id: "req-2",
    bloodGroup: "A+",
    city: "Los Angeles",
    unitsRequired: 5,
    unitsFulfilled: 5,
    status: "fulfilled",
    hospitalName: "LA Medical Center",
    createdDate: "2024-08-18",
    urgency: "medium"
  },
  {
    id: "req-3",
    bloodGroup: "B-",
    city: "Chicago",
    unitsRequired: 8,
    unitsFulfilled: 2,
    status: "open",
    hospitalName: "Chicago University Hospital",
    createdDate: "2024-08-22",
    urgency: "medium",
    description: "Preparing for scheduled surgery"
  },
  {
    id: "req-4",
    bloodGroup: "AB+",
    city: "San Francisco",
    unitsRequired: 3,
    unitsFulfilled: 0,
    status: "cancelled",
    hospitalName: "SF Bay Medical",
    createdDate: "2024-08-15",
    urgency: "low"
  }
];

export const mockPledges: Pledge[] = [
  {
    id: "pledge-1",
    donorId: "1",
    donorName: "John Smith",
    requestId: "req-1",
    units: 2,
    date: "2024-08-21",
    status: "confirmed"
  },
  {
    id: "pledge-2",
    donorId: "2",
    donorName: "Sarah Johnson",
    requestId: "req-1",
    units: 2,
    date: "2024-08-21",
    status: "confirmed"
  },
  {
    id: "pledge-3",
    donorId: "5",
    donorName: "David Wilson",
    requestId: "req-1",
    units: 2,
    date: "2024-08-22",
    status: "pending"
  },
  {
    id: "pledge-4",
    donorId: "2",
    donorName: "Sarah Johnson",
    requestId: "req-2",
    units: 3,
    date: "2024-08-19",
    status: "confirmed"
  },
  {
    id: "pledge-5",
    donorId: "4",
    donorName: "Emily Chen",
    requestId: "req-2",
    units: 2,
    date: "2024-08-19",
    status: "confirmed"
  }
];

export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const cities = ["New York", "Los Angeles", "Chicago", "San Francisco", "Boston", "Miami", "Seattle", "Denver"];