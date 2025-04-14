
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSeoPage } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function TrainSeoPageForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    distance: "",
    duration: "",
    price: "",
    currency: "SAR",
    slug: "",
    title: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      slug: name === "fromLocation" || name === "toLocation" 
        ? `${formData.fromLocation.toLowerCase().replace(/\s+/g, '-')}-to-${formData.toLocation.toLowerCase().replace(/\s+/g, '-')}-train-booking`.replace(/--+/g, '-')
        : prev.slug,
      title: name === "fromLocation" || name === "toLocation"
        ? `${formData.fromLocation} to ${formData.toLocation} Train Booking`
        : prev.title
    }));
  };

  const createPageMutation = useMutation({
    mutationFn: createSeoPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seoPages"] });
      toast.success("Train SEO page created successfully");
      navigate("/seo-pages");
    },
    onError: (error) => {
      console.error("Failed to create page:", error);
      toast.error("Failed to create train SEO page");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { fromLocation, toLocation, distance, duration, price, currency } = formData;
    
    // Create content HTML
    const content = `
      <div class="transportation-template">
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 py-12 px-4 mb-8">
          <div class="container mx-auto max-w-4xl">
            <div class="flex justify-between items-center mb-6">
              <h1 class="text-white text-3xl md:text-4xl font-bold">
                ${fromLocation} to ${toLocation} Train Booking
              </h1>
            </div>
            
            <div class="flex flex-wrap items-center gap-4 text-white">
              <div class="flex items-center gap-2">
                <span>Distance: ${distance}</span>
              </div>
              <div class="flex items-center gap-2">
                <span>Duration: ${duration}</span>
              </div>
              <div class="flex items-center gap-2">
                <span>From ${currency}${price}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="container mx-auto max-w-4xl px-4">
          <div class="prose max-w-none mb-8">
            <h2>${fromLocation} to ${toLocation} Train - Travel Guide</h2>
            <p>
              Plan your journey from ${fromLocation} to ${toLocation} with our comprehensive train booking service. 
              We offer convenient schedules, competitive prices, and a smooth booking experience for travelers.
            </p>
            
            <h3>About the ${fromLocation}-${toLocation} Route</h3>
            <p>
              The train journey from ${fromLocation} to ${toLocation} covers approximately ${distance} and takes around ${duration}.
              This popular route offers travelers a comfortable and efficient way to travel between these important destinations.
            </p>
            
            <h3>Why Choose Train Travel</h3>
            <ul>
              <li><strong>Convenience:</strong> Regular departures throughout the day</li>
              <li><strong>Comfort:</strong> Spacious seating with modern amenities</li>
              <li><strong>Speed:</strong> Direct routes with minimal stops</li>
              <li><strong>Value:</strong> Competitive pricing starting from ${currency}${price}</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    // Create structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": `${fromLocation} to ${toLocation} Train Ticket`,
      "description": `Book train tickets from ${fromLocation} to ${toLocation}. Journey duration: ${duration}, distance: ${distance}.`,
      "offers": {
        "@type": "Offer",
        "priceCurrency": currency,
        "price": price,
        "availability": "https://schema.org/InStock"
      }
    };
    
    const seoPage = {
      title: `${fromLocation} to ${toLocation} Train Booking`,
      slug: `${fromLocation.toLowerCase().replace(/\s+/g, '-')}-to-${toLocation.toLowerCase().replace(/\s+/g, '-')}-train-booking`.replace(/--+/g, '-'),
      metaDescription: `Book your train from ${fromLocation} to ${toLocation}. Journey time: ${duration}, distance: ${distance}. Easy online booking with best prices guaranteed.`,
      content,
      keywords: [`${fromLocation} to ${toLocation} train`, `${toLocation} train ticket`, `book train ${fromLocation}`, `${fromLocation} ${toLocation} transport`],
      publishStatus: "published",
      structuredData
    };
    
    try {
      await createPageMutation.mutateAsync(seoPage);
    } catch (error) {
      // Error is handled in mutation
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create Train Route SEO Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromLocation">From Location</Label>
              <Input 
                id="fromLocation" 
                name="fromLocation" 
                value={formData.fromLocation} 
                onChange={handleChange} 
                placeholder="e.g. Makkah" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toLocation">To Location</Label>
              <Input 
                id="toLocation" 
                name="toLocation" 
                value={formData.toLocation} 
                onChange={handleChange} 
                placeholder="e.g. Jeddah" 
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distance">Distance</Label>
              <Input 
                id="distance" 
                name="distance" 
                value={formData.distance} 
                onChange={handleChange} 
                placeholder="e.g. 80 km" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input 
                id="duration" 
                name="duration" 
                value={formData.duration} 
                onChange={handleChange} 
                placeholder="e.g. 25-30 minutes" 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input 
                  id="currency" 
                  name="currency" 
                  value={formData.currency} 
                  onChange={handleChange} 
                  placeholder="e.g. SAR" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  placeholder="e.g. 40" 
                  type="number" 
                  required 
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slug">Generated URL Slug</Label>
            <Input 
              id="slug" 
              name="slug" 
              value={formData.slug} 
              readOnly 
              className="bg-muted" 
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated from locations - will be used in the page URL
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={createPageMutation.isPending}>
              {createPageMutation.isPending ? "Creating..." : "Create Train SEO Page"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

export default TrainSeoPageForm;
