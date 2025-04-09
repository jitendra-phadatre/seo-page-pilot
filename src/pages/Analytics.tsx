
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="content-area">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle mb-6">
          Track and analyze your SEO performance metrics
        </p>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Google Search Console Integration</CardTitle>
            <CardDescription>
              Connect your Google Search Console account to view detailed analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Connect Google Search Console</h3>
              <p className="text-muted-foreground mb-4">
                Link your Google Search Console account to access search analytics data
              </p>
              <button className="bg-[#4285F4] text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-[#3367d6] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" className="mr-2">
                  <path d="M12.545 12.151L12.542 12.147L12.551 12.156L12.545 12.151Z"></path>
                  <path d="M11.9999 4.99998C13.6999 4.99998 15.1999 5.69998 16.2999 6.69998L19.5999 3.39998C17.4999 1.49998 14.8999 0.199982 11.9999 0.199982C7.49994 0.199982 3.59994 2.99998 1.59994 6.99998L5.29994 9.89998C6.29994 7.09998 8.89994 4.99998 11.9999 4.99998Z" fill="#EA4335"></path>
                  <path d="M23.49 12.27C23.49 11.48 23.41 10.73 23.27 9.99998H11.99V14.51H18.47C18.22 15.99 17.4 17.25 16.12 18.08L19.74 20.94C21.94 18.89 23.49 15.84 23.49 12.27Z" fill="#4285F4"></path>
                  <path d="M5.29994 14.1C5.06994 13.44 4.93994 12.73 4.93994 12C4.93994 11.28 5.06994 10.58 5.28994 9.92998L1.58994 7.02998C0.889941 8.53998 0.499941 10.22 0.499941 12C0.499941 13.78 0.889941 15.46 1.58994 16.97L5.29994 14.1Z" fill="#FBBC05"></path>
                  <path d="M12.0001 23.8C15.0001 23.8 17.5801 22.79 19.7401 20.94L16.1201 18.08C15.0401 18.81 13.6401 19.25 12.0001 19.25C8.90005 19.25 6.30005 17.15 5.30005 14.35L1.60005 17.25C3.60005 21.25 7.50005 23.8 12.0001 23.8Z" fill="#34A853"></path>
                </svg>
                Connect with Google
              </button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Analytics Features Coming Soon</CardTitle>
            <CardDescription>
              Upcoming features for the analytics dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Keyword performance tracking</li>
              <li>Page-level analytics with traffic sources</li>
              <li>Ranking position history for key terms</li>
              <li>Competitor analysis</li>
              <li>Custom reporting and exports</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
