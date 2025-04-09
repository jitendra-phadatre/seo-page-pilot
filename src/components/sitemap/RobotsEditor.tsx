
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Robot, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function RobotsEditor() {
  const [robotsContent, setRobotsContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    // In a real application, this would fetch the robots.txt content from the server
    // For now, we'll use the mock content from public/robots.txt
    const fetchRobotsContent = async () => {
      try {
        const response = await fetch("/robots.txt");
        const text = await response.text();
        setRobotsContent(text);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch robots.txt:", error);
        // Fallback content
        setRobotsContent(
`User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /
`
        );
        setIsLoading(false);
      }
    };
    
    fetchRobotsContent();
  }, []);
  
  const handleSave = async () => {
    setIsSaving(true);
    // In a real application, this would save the robots.txt content to the server
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("robots.txt saved successfully");
    setIsSaving(false);
  };
  
  const resetToDefault = () => {
    if (window.confirm("Reset robots.txt to default configuration? This will discard all changes.")) {
      setRobotsContent(
`User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /
`
      );
      toast.info("robots.txt reset to default");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Robot className="h-5 w-5 mr-2" />
          Robots.txt Editor
        </CardTitle>
        <CardDescription>
          Configure how search engines crawl your website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="h-64 w-full bg-muted animate-pulse rounded"></div>
        ) : (
          <Textarea
            value={robotsContent}
            onChange={(e) => setRobotsContent(e.target.value)}
            className="font-mono text-sm h-64"
          />
        )}
        
        <div className="bg-muted p-4 rounded-md">
          <h3 className="text-sm font-medium mb-2">Common robots.txt directives:</h3>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li><code className="bg-muted-foreground/20 px-1 py-0.5 rounded">User-agent: [bot name]</code> - Specify which crawler the rules apply to</li>
            <li><code className="bg-muted-foreground/20 px-1 py-0.5 rounded">Allow: [path]</code> - Allow crawling of specified path</li>
            <li><code className="bg-muted-foreground/20 px-1 py-0.5 rounded">Disallow: [path]</code> - Prevent crawling of specified path</li>
            <li><code className="bg-muted-foreground/20 px-1 py-0.5 rounded">Sitemap: [url]</code> - Specify sitemap location</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetToDefault}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RobotsEditor;
