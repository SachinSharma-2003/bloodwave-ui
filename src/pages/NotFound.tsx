import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="medical-gradient p-4 rounded-full w-16 h-16 mx-auto mb-6">
            <Heart className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-xl font-semibold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link to="/">
            <Button className="medical-gradient">
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
