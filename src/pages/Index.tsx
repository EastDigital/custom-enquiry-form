
import React from "react";
import QuotationForm from "@/components/QuotationForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container">
        <div className="max-w-5xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-orange/70">
            Get Your Custom Quote
          </h1>
          <p className="text-center text-muted-foreground max-w-xl mx-auto">
            Select from our professional services and get an instant price quotation or have it delivered to your email.
          </p>
        </div>
        
        <div className="flex flex-col-reverse md:flex-row gap-8 max-w-6xl mx-auto">
          <div className="md:w-1/2 md:mt-10">
            <h2 className="text-2xl font-semibold mb-8">Our Services</h2>
            <div className="grid gap-6">
              <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3">Branding</h3>
                <p className="text-muted-foreground mb-4">From logo design to comprehensive website UI design, we create a consistent brand identity that resonates with your audience.</p>
                <ul className="list-disc pl-5 text-card-foreground space-y-1">
                  <li>Logo Design</li>
                  <li>Website UI Design</li>
                  <li>Brand Identity Development</li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3">Digital Campaigns</h3>
                <p className="text-muted-foreground mb-4">Establish your online presence with website/app development and effective PPC management.</p>
                <ul className="list-disc pl-5 text-card-foreground space-y-1">
                  <li>Website Development</li>
                  <li>App Development</li>
                  <li>PPC Management</li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3">3D Renderings</h3>
                <p className="text-muted-foreground mb-4">Stunning architectural renderings that bring your designs to life, perfect for presentations and marketing.</p>
                <ul className="list-disc pl-5 text-card-foreground space-y-1">
                  <li>Residential Renderings</li>
                  <li>Commercial Renderings</li>
                  <li>Custom Project Visualization</li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3">3D Walkthroughs</h3>
                <p className="text-muted-foreground mb-4">Immersive 3D walkthroughs for real estate projects that allow clients to experience spaces before they're built.</p>
                <ul className="list-disc pl-5 text-card-foreground space-y-1">
                  <li>Residential Walkthroughs</li>
                  <li>Commercial Walkthroughs</li>
                  <li>Interactive Virtual Tours</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-gradient-to-br from-primary/5 to-primary/20 p-6 rounded-lg shadow-lg border-2 border-primary/20">
              <QuotationForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
