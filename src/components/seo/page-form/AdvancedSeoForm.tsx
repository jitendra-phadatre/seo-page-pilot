
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SeoPage } from "@/lib/mock-data";

interface AdvancedSeoFormProps {
  formData: Partial<SeoPage>;
  handleSelectChange: (name: string, value: string) => void;
}

export function AdvancedSeoForm({ formData, handleSelectChange }: AdvancedSeoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced SEO Settings</CardTitle>
        <CardDescription>
          Configure advanced SEO options for this page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="robotsDirective">Robots Directive</Label>
          <Select 
            value={formData.robotsDirective || "index,follow"} 
            onValueChange={(value) => handleSelectChange("robotsDirective", value)}
          >
            <SelectTrigger id="robotsDirective">
              <SelectValue placeholder="Select robots directive" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="index,follow">index,follow (Default)</SelectItem>
              <SelectItem value="noindex,follow">noindex,follow</SelectItem>
              <SelectItem value="index,nofollow">index,nofollow</SelectItem>
              <SelectItem value="noindex,nofollow">noindex,nofollow</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Controls how search engines crawl and index this page
          </p>
        </div>
        
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>More options coming soon</AlertTitle>
          <AlertDescription>
            Additional advanced options will be available in future updates.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
