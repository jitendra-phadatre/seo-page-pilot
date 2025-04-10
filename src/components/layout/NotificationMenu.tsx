
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Page Published",
    message: "Your page 'Hotels in Paris' has been published successfully.",
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: "2",
    title: "Analytics Report",
    message: "Weekly analytics report is ready for review.",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: false,
  },
  {
    id: "3",
    title: "System Update",
    message: "The system will undergo maintenance on Sunday, 10 PM UTC.",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    read: true,
  },
];

export function NotificationMenu() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // In a real app, this would be fetched from an API
  useEffect(() => {
    // Set up real-time notifications (when integrated with Supabase)
    const setupNotificationSubscription = async () => {
      try {
        // This is a placeholder for real-time notification setup
        // In a real app, you'd subscribe to a realtime channel
        const channel = supabase.channel('notification-changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'notifications' },
            (payload) => {
              console.log('Notification change received:', payload);
              // You would update the notifications state here
            }
          )
          .subscribe();
          
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error setting up notification subscription:', error);
      }
    };
    
    setupNotificationSubscription();
  }, []);
  
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-auto py-1"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notifications.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={`cursor-pointer ${notification.read ? '' : 'bg-muted/50'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{notification.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationMenu;
