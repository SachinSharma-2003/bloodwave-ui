import { NavLink } from "react-router-dom";
import { Heart, FileText, Plus, Users } from "lucide-react";

const Navbar = () => {
  const navItems = [
    { to: "/", icon: Users, label: "Donor Directory" },
    { to: "/requests", icon: FileText, label: "My Requests" },
    { to: "/new-request", icon: Plus, label: "New Request" },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="medical-gradient p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">LifeLink</h1>
              <p className="text-xs text-muted-foreground">Blood Donation System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button - simplified for now */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-muted">
              <Users className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;