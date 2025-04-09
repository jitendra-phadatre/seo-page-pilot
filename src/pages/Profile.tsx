
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().max(160, "Bio must be 160 characters or less").optional(),
});

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "John Doe",
      email: "john@example.com",
      jobTitle: "SEO Specialist",
      company: "PagePilot Inc.",
      bio: "SEO professional with 5+ years of experience in technical SEO and content optimization.",
    },
  });

  const handleSubmit = (data: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Profile data:", data);
      toast.success("Profile updated successfully");
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <DashboardLayout>
      <div className="content-area">
        <div className="mb-6">
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">
            Manage your account information and preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>SEO Specialist</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center space-x-2">
                <Badge>Admin</Badge>
                <Badge variant="outline">Team</Badge>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Member since March 2023
              </p>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pages Created</span>
                  <span className="font-medium">42</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Login</span>
                  <span className="font-medium">Today, 11:32 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Profile Edit Form */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form 
                  id="profile-form" 
                  onSubmit={form.handleSubmit(handleSubmit)} 
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Write a short bio about yourself"
                            className="resize-none"
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Write a short bio about yourself (max 160 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                form="profile-form"
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
