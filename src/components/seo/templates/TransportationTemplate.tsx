
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, MapPin, TrendingUp, Train } from "lucide-react";

interface TransportationTemplateProps {
  fromLocation: string;
  toLocation: string;
  transportType: string;
  distance: string;
  duration: string;
  price: string;
  currency: string;
  image?: string;
}

export function TransportationTemplate({
  fromLocation,
  toLocation,
  transportType,
  distance,
  duration,
  price,
  currency,
  image
}: TransportationTemplateProps) {
  return (
    <div className="transportation-template">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 px-4 mb-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-white text-3xl md:text-4xl font-bold">
              {fromLocation} to {toLocation} {transportType} Booking
            </h1>
            <Train className="h-12 w-12 text-white" />
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Distance: {distance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Duration: {duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>From {currency}{price}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From</label>
                  <div className="flex items-center gap-2 border p-3 rounded-md">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>{fromLocation}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">To</label>
                  <div className="flex items-center gap-2 border p-3 rounded-md">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>{toLocation}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <div className="flex items-center gap-2 border p-3 rounded-md">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                    <span>Select Date</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Passengers</label>
                  <div className="flex items-center gap-2 border p-3 rounded-md">
                    <span>2</span>
                    <span>Adults</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Search {transportType}s
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="prose max-w-none mb-8">
          <h2>{fromLocation} to {toLocation} {transportType} - Travel Guide</h2>
          <p>
            Plan your journey from {fromLocation} to {toLocation} with our comprehensive {transportType} booking service. 
            We offer convenient schedules, competitive prices, and a smooth booking experience for travelers.
          </p>
          
          <h3>About the {fromLocation}-{toLocation} Route</h3>
          <p>
            The {transportType} journey from {fromLocation} to {toLocation} covers approximately {distance} and takes around {duration}.
            This popular route offers travelers a comfortable and efficient way to travel between these important destinations.
          </p>
          
          <h3>Why Choose {transportType} Travel</h3>
          <ul>
            <li><strong>Convenience:</strong> Regular departures throughout the day</li>
            <li><strong>Comfort:</strong> Spacious seating with modern amenities</li>
            <li><strong>Speed:</strong> Direct routes with minimal stops</li>
            <li><strong>Value:</strong> Competitive pricing starting from {currency}{price}</li>
          </ul>
          
          <h3>Booking Information</h3>
          <p>
            Book your {fromLocation} to {toLocation} {transportType} tickets in advance to secure the best prices and preferred departure times.
            Our online booking system allows you to select your seats, add any special requirements, and receive instant confirmation.
          </p>
        </div>
        
        {image && (
          <div className="mb-8">
            <img 
              src={image} 
              alt={`${fromLocation} to ${toLocation} ${transportType}`} 
              className="rounded-md w-full h-auto object-cover"
            />
          </div>
        )}

        <div className="prose max-w-none mb-8">
          <h2>Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h4>How long does the {transportType} journey take from {fromLocation} to {toLocation}?</h4>
              <p>The journey typically takes {duration}, depending on the specific service and time of day.</p>
            </div>
            <div>
              <h4>What amenities are available on the {transportType}?</h4>
              <p>Our {transportType}s offer comfortable seating, air conditioning, onboard restrooms, and in some cases, Wi-Fi connectivity and refreshment services.</p>
            </div>
            <div>
              <h4>How much does a ticket cost?</h4>
              <p>Ticket prices start from {currency}{price}, with variations based on class, booking time, and seasonal demand.</p>
            </div>
            <div>
              <h4>Can I change or cancel my booking?</h4>
              <p>Yes, bookings can be modified or cancelled according to our flexible policy. Changes made at least 24 hours before departure typically incur minimal or no fees.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransportationTemplate;
