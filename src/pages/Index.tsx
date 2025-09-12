import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User, Shield, Upload, FileText, Stethoscope, Award } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 to-secondary">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              OralVis Healthcare
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced dental screening technology that enables patients to upload dental images 
              for professional analysis and receive comprehensive oral health reports.
            </p>
          </div>
          
          <div className="flex gap-4 justify-center mb-16">
            <Link to="/register">
              <Button className="btn-medical px-8 py-4 text-lg">
                <User className="w-5 h-5 mr-2" />
                Patient Portal
              </Button>
            </Link>
            <Link to="/login">
              <Button className="btn-medical-outline px-8 py-4 text-lg">
                <Shield className="w-5 h-5 mr-2" />
                Healthcare Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How OralVis Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple, secure, and professional dental screening in three steps
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="medical-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Upload Images</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Patients securely upload clear photos of upper, front, and lower teeth 
                  through our HIPAA-compliant platform.
                </p>
              </CardContent>
            </Card>

            <Card className="medical-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Professional Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Licensed dental professionals review and annotate images, identifying 
                  areas of concern with color-coded markers.
                </p>
              </CardContent>
            </Card>

            <Card className="medical-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Detailed Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive PDF reports with annotated images, findings, and 
                  personalized treatment recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Professional Dental Care, Accessible Anywhere
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Expert Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Licensed dental professionals review every submission
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                HIPAA-compliant platform with end-to-end encryption
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Detailed Reports</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive findings with treatment recommendations
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Easy to Use</h3>
              <p className="text-sm text-muted-foreground">
                Simple upload process, no technical expertise required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of patients who trust OralVis for their dental health screening needs.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button className="btn-medical px-8 py-4 text-lg">
                Create Patient Account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="px-8 py-4 text-lg">
                Healthcare Provider Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
