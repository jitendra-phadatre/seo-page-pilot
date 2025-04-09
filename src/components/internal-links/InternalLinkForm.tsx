
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSeoPages } from "@/lib/api";
import { SeoPage } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";

interface InternalLinkFormProps {
  page: SeoPage;
  onClose: () => void;
}

export function InternalLinkForm({ page, onClose }: InternalLinkFormProps) {
  const [linkDirection, setLinkDirection] = useState<"outbound" | "inbound">("outbound");
  const [targetPageId, setTargetPageId] = useState<string>("");
  const [anchorText, setAnchorText] = useState<string>("");
  
  const { data: pages } = useQuery({
    queryKey: ["seoPages"],
    queryFn: fetchSeoPages
  });
  
  const handleAddLink = () => {
    // In a real application, this would send a request to the API
    // For now, we'll just show a success message
    
    const sourcePage = linkDirection === "outbound" ? page : pages?.find(p => p.id === targetPageId);
    const destinationPage = linkDirection === "outbound" ? pages?.find(p => p.id === targetPageId) : page;
    
    if (sourcePage && destinationPage) {
      toast.success(`Added link from "${sourcePage.title}" to "${destinationPage.title}"`);
      onClose();
    } else {
      toast.error("Please select a target page");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{page.title}</CardTitle>
            <CardDescription>
              {linkDirection === "outbound" 
                ? "Add links from this page to other pages" 
                : "Add links from other pages to this page"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label>Link Direction</Label>
          <Select 
            value={linkDirection} 
            onValueChange={(value: "outbound" | "inbound") => setLinkDirection(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select link direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outbound">Outbound (from this page)</SelectItem>
              <SelectItem value="inbound">Inbound (to this page)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1 text-center font-medium">
            {linkDirection === "outbound" ? page.title : "Other Page"}
          </div>
          <div className="flex-shrink-0">
            <ArrowRight className="h-5 w-5" />
          </div>
          <div className="flex-1 text-center font-medium">
            {linkDirection === "outbound" ? "Other Page" : page.title}
          </div>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="targetPage">Target Page</Label>
          <Select 
            value={targetPageId} 
            onValueChange={setTargetPageId}
          >
            <SelectTrigger id="targetPage">
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              {pages?.filter(p => p.id !== page.id).map((targetPage) => (
                <SelectItem key={targetPage.id} value={targetPage.id}>
                  {targetPage.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="anchorText">Anchor Text</Label>
          <Input
            id="anchorText"
            placeholder="Enter anchor text for the link"
            value={anchorText}
            onChange={(e) => setAnchorText(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddLink}>Add Link</Button>
      </CardFooter>
    </Card>
  );
}

export default InternalLinkForm;
