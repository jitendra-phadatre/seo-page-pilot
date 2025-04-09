
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSeoPages, regenerateSitemap } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileJson, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function SitemapManager() {
  const [regenerating, setRegenerating] = useState(false);
  const [sitemapSettings, setSitemapSettings] = useState({
    autoGenerate: true,
    includeImages: true,
    includeLastmod: true,
    includePriority: false
  });
  
  const { data: pages, isLoading } = useQuery({
    queryKey: ["seoPages"],
    queryFn: fetchSeoPages
  });
  
  const handleRegenerateSitemap = async () => {
    setRegenerating(true);
    try {
      await regenerateSitemap();
      setRegenerating(false);
    } catch (error) {
      console.error("Failed to regenerate sitemap:", error);
      toast.error("Failed to regenerate sitemap");
      setRegenerating(false);
    }
  };
  
  const toggleSetting = (setting: keyof typeof sitemapSettings) => {
    setSitemapSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const downloadSitemap = () => {
    // In a real application, this would download the actual sitemap.xml file
    toast.success("Sitemap download initiated");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <FileJson className="h-5 w-5 mr-2" />
          Sitemap Manager
        </CardTitle>
        <CardDescription>
          Configure and generate your website's sitemap.xml file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch 
                id="autoGenerate" 
                checked={sitemapSettings.autoGenerate}
                onCheckedChange={() => toggleSetting('autoGenerate')} 
              />
              <Label htmlFor="autoGenerate">Auto-generate on page updates</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="includeImages" 
                checked={sitemapSettings.includeImages}
                onCheckedChange={() => toggleSetting('includeImages')} 
              />
              <Label htmlFor="includeImages">Include image metadata</Label>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch 
                id="includeLastmod" 
                checked={sitemapSettings.includeLastmod}
                onCheckedChange={() => toggleSetting('includeLastmod')} 
              />
              <Label htmlFor="includeLastmod">Include lastmod timestamps</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="includePriority" 
                checked={sitemapSettings.includePriority}
                onCheckedChange={() => toggleSetting('includePriority')} 
              />
              <Label htmlFor="includePriority">Include priority values</Label>
            </div>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Include in Sitemap</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : pages && pages.length > 0 ? (
                pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">
                      {page.title}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      /{page.slug}
                    </TableCell>
                    <TableCell>
                      <Switch defaultChecked={page.publishStatus === "published"} />
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          page.publishStatus === "published" 
                            ? "bg-green-500/20 text-green-700" 
                            : "bg-amber-500/20 text-amber-700"
                        }
                      >
                        {page.publishStatus === "published" ? "Included" : "Not Included"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No pages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Last generated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={downloadSitemap}>
              <Download className="h-4 w-4 mr-2" />
              Download Sitemap
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleRegenerateSitemap}
          disabled={regenerating}
        >
          {regenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate Sitemap
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SitemapManager;
