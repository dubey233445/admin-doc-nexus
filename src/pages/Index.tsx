import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Shield, 
  Users, 
  Stethoscope, 
  UserPlus, 
  LogIn, 
  Activity,
  Clock,
  Award,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Patient Management",
      description: "Comprehensive patient record system with secure data storage and easy access"
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-secondary" />,
      title: "Doctor Dashboard",
      description: "Dedicated interface for healthcare professionals to manage their patients"
    },
    {
      icon: <Shield className="w-8 h-8 text-success" />,
      title: "Secure & Compliant",
      description: "HIPAA-compliant system ensuring patient data privacy and security"
    },
    {
      icon: <Activity className="w-8 h-8 text-warning" />,
      title: "Real-time Updates",
      description: "Instant synchronization of patient data across all authorized personnel"
    }
  ];

  const stats = [
    { number: "0", label: "Patients Managed", icon: <Users className="w-6 h-6" /> },
    { number: "0", label: "Healthcare Professionals", icon: <Stethoscope className="w-6 h-6" /> },
    { number: "0", label: "System Availability", icon: <Clock className="w-6 h-6" /> },
    { number: "0", label: "Data Security", icon: <Shield className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center pulse-heartbeat">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">MediCare Plus</h1>
                <p className="text-sm text-muted-foreground">Advanced Hospital Management</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Trusted Healthcare Management System</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
                Modern Healthcare
                <br />
                Management
              </h1>
              
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Streamline your hospital operations with our comprehensive management system. 
                Secure patient records, efficient doctor workflows, and seamless administrative control.
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                onClick={() => navigate("/doctor-register")}
                className="bg-secondary hover:bg-secondary-hover text-secondary-foreground px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <UserPlus className="w-5 h-5 mr-3" />
                Register as Doctor
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/doctor-login")}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <LogIn className="w-5 h-5 mr-3" />
                Doctor Login
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-2 text-primary">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-primary">Why Choose MediCare Plus?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides cutting-edge tools for modern healthcare management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-4">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-primary">About Our System</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-semibold mb-4 text-secondary">Empowering Healthcare Professionals</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  MediCare Plus is designed specifically for modern healthcare facilities. Our system provides 
                  doctors with intuitive tools to manage patient records, track treatments, and maintain 
                  comprehensive medical histories.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm">Secure patient data management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm">Administrative oversight and control</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm">Real-time collaboration tools</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Card className="border-none shadow-xl">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-8 h-8 text-primary" />
                      </div>
                      <h4 className="text-xl font-semibold mb-2">System Requirements</h4>
                      <p className="text-muted-foreground text-sm mb-4">
                        Doctors must register and receive admin approval before accessing the system.
                      </p>
                      <div className="text-sm text-left space-y-2">
                        <div>✓ Medical license verification</div>
                        <div>✓ Administrative review process</div>
                        <div>✓ Secure credential management</div>
                        <div>✓ Role-based access control</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4 text-primary">Get In Touch</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Need help getting started? Our support team is here to assist you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-none shadow-lg">
                <CardContent className="p-6">
                  <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  <p className="text-sm text-muted-foreground">24/7 Support</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-none shadow-lg">
                <CardContent className="p-6">
                  <Mail className="w-8 h-8 text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">support@medicareplus.com</p>
                  <p className="text-sm text-muted-foreground">Quick Response</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-none shadow-lg">
                <CardContent className="p-6">
                  <MapPin className="w-8 h-8 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Office</h3>
                  <p className="text-muted-foreground">123 Healthcare Ave</p>
                  <p className="text-sm text-muted-foreground">Medical District</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Admin Login */}
      <footer className="bg-primary/5 border-t py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">MediCare Plus</h3>
                <p className="text-sm text-muted-foreground">© 2024 All rights reserved</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground mb-3">System Administration</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin-login")}
                className="text-muted-foreground hover:text-primary"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
