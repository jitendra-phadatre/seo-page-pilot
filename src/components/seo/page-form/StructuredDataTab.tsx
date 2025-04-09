
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StructuredDataEditor } from "../StructuredDataEditor";

interface StructuredDataTabProps {
  structuredData: object | null;
  handleStructuredDataChange: (data: object | null) => void;
}

export function StructuredDataTab({ 
  structuredData, 
  handleStructuredDataChange 
}: StructuredDataTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Structured Data</CardTitle>
        <CardDescription>
          Add structured data (JSON-LD) for enhanced search results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>
            Structured data helps search engines understand your content and can enable rich results.
          </AlertDescription>
        </Alert>
        
        <StructuredDataEditor 
          data={structuredData} 
          onChange={handleStructuredDataChange}
        />
        
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline">
          Preview Schema
        </Button>
        <Button type="button" variant="outline">
          Test with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
