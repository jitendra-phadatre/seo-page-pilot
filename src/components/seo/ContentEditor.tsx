
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  AlignCenter, 
  AlignLeft, 
  AlignRight, 
  Bold, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Plus,
  Undo,
  Redo,
  Youtube
} from "lucide-react";

export function ContentEditor() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Content</CardTitle>
        <CardDescription>
          Create and manage the content for this SEO page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border rounded-md">
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Bold className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Italic className="h-4 w-4" />
              </Button>
              <span className="w-px h-6 bg-border mx-1"></span>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Heading3 className="h-4 w-4" />
              </Button>
              <span className="w-px h-6 bg-border mx-1"></span>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <AlignRight className="h-4 w-4" />
              </Button>
              <span className="w-px h-6 bg-border mx-1"></span>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <List className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <ListOrdered className="h-4 w-4" />
              </Button>
              <span className="w-px h-6 bg-border mx-1"></span>
              <Button size="sm" variant="ghost" className="h-8 px-2">
                <LinkIcon className="h-4 w-4 mr-1" />
                <span className="text-xs">Link</span>
              </Button>
              <Button size="sm" variant="ghost" className="h-8 px-2">
                <ImageIcon className="h-4 w-4 mr-1" />
                <span className="text-xs">Image</span>
              </Button>
              <Button size="sm" variant="ghost" className="h-8 px-2">
                <Code className="h-4 w-4 mr-1" />
                <span className="text-xs">Code</span>
              </Button>
              <div className="flex-1"></div>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Undo className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="min-h-[400px] p-4">
              <div className="prose prose-sm max-w-none">
                <h1>Welcome to Our Hotels in Paris Guide</h1>
                <p>
                  Planning a trip to the City of Light? Finding the perfect hotel in Paris can make your 
                  visit truly magical. From luxury accommodations with Eiffel Tower views to charming 
                  boutique hotels in historic neighborhoods, Paris offers a diverse range of options for every 
                  traveler.
                </p>
                <h2>Top 10 Paris Hotels for 2025</h2>
                <p>
                  We've carefully selected the best hotels in Paris based on location, amenities, customer 
                  reviews, and value for money. Here are our top recommendations:
                </p>
                <ol>
                  <li>
                    <strong>Hotel Splendide Royal Paris</strong> - Luxury hotel with exceptional service
                  </li>
                  <li>
                    <strong>Hotel Le Meurice</strong> - Historic palace hotel near the Louvre
                  </li>
                  <li>
                    <strong>Relais Christine</strong> - Boutique hotel in Saint-Germain-des-Prés
                  </li>
                </ol>
                <p>
                  Each of these hotels offers a unique experience, allowing you to immerse yourself in 
                  Parisian culture and enjoy the city's renowned attractions.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Add Content Block</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto flex-col py-4">
                <Plus className="h-5 w-5 mb-1" />
                <span>Text</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <ImageIcon className="h-5 w-5 mb-1" />
                <span>Image</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <Youtube className="h-5 w-5 mb-1" />
                <span>Video</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <Code className="h-5 w-5 mb-1" />
                <span>Custom HTML</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ContentEditor;
