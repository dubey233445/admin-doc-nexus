import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Lock, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DoctorLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Get approved doctors from localStorage (in real app, this would be from Supabase)
    const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    const doctor = doctors.find((doc: any) => 
      doc.username === credentials.username && 
      doc.password === credentials.password && 
      doc.status === "approved"
    );

    if (doctor) {
      localStorage.setItem("userRole", "doctor");
      localStorage.setItem("userId", doctor.id);
      localStorage.setItem("doctorName", doctor.name);
      toast({
        title: "Login Successful",
        description: `Welcome back, Dr. ${doctor.name}`,
        variant: "default",
      });
      navigate("/doctor");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials or account not approved yet.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
            <Stethoscope className="w-8 h-8 text-secondary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-secondary">Doctor Login</CardTitle>
          <CardDescription>
            Access your patient management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-secondary hover:bg-secondary-hover"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/doctor-register")}
              className="w-full"
            >
              Don't have an account? Register
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-primary"
            >
              ← Back to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorLogin;