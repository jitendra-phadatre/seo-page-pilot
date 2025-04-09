
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SeoPage, Template } from "@/lib/mock-data";

interface TemplateStatusFormProps {
  formData: Partial<SeoPage>;
  templates: Template[];
  handleSelectChange: (name: string, value: string) => void;
}

export function TemplateStatusForm({ 
  formData, 
  templates, 
  handleSelectChange 
}: TemplateStatusFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template & Status</CardTitle>
        <CardDescription>
          Select a template and set publication status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="template">Page Template</Label>
          <Select 
            value={formData.templateId || "none"} 
            onValueChange={(value) => handleSelectChange("templateId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Template (Custom Page)</SelectItem>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Templates provide pre-defined layouts and dynamic fields
          </p>
        </div>

        <div className="space-y-2">
          <Label>Publication Status</Label>
          <RadioGroup 
            defaultValue={formData.publishStatus || "draft"}
            onValueChange={(value) => handleSelectChange("publishStatus", value)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="draft" id="draft" />
              <Label htmlFor="draft" className="font-normal">Draft</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="published" id="published" />
              <Label htmlFor="published" className="font-normal">Published</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="archived" id="archived" />
              <Label htmlFor="archived" className="font-normal">Archived</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
