import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Mail, User, Lock, Stethoscope, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";  // ✅ Supabase import

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    specialty: "",
    contact: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // ✅ Check if doctor with same username/email already exists
    const { data: existingDoctors, error: checkError } = await supabase
      .from("doctors")
      .select("*")
      .or(`username.eq.${formData.username},email.eq.${formData.email}`);

    if (checkError) {
      toast({
        title: "Error",
        description: "Failed to check existing doctors.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (existingDoctors && existingDoctors.length > 0) {
      toast({
        title: "Registration Failed",
        description: "Username or email already exists",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // ✅ Insert new doctor in Supabase with pending status
    const { error } = await supabase.from("doctors").insert([
      {
        ...formData,
        status: "pending",
        registration_date: new Date().toISOString(),
      },
    ]);

    if (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration Successful",
        description: "Your application has been submitted for admin approval.",
        variant: "default",
      });
      navigate("/doctor-login");
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-secondary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-secondary">Doctor Registration</CardTitle>
          <CardDescription>
            Join our hospital management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Dr. John Smith"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john.smith@hospital.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="drjohnsmith"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
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
                  placeholder="Enter secure password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Medical Specialty</Label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="specialty"
                  type="text"
                  placeholder="Cardiology, Neurology, etc."
                  value={formData.specialty}
                  onChange={(e) => handleInputChange("specialty", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contact"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
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
              {isLoading ? "Submitting..." : "Register"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/doctor-login")}
              className="w-full"
            >
              Already have an account? Login
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

export default DoctorRegister;
