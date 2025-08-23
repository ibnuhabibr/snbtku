import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const OfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Show initial toast if offline
    if (!navigator.onLine) {
      toast({
        title: "Kamu sedang offline",
        description: "Beberapa fitur mungkin tidak tersedia",
        variant: "destructive",
      });
    }

    // Function to handle online status changes
    const handleOnlineStatusChange = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (online) {
        toast({
          title: "Kembali online",
          description: "Koneksi internet kamu telah dipulihkan",
          variant: "default",
        });
      } else {
        toast({
          title: "Kamu sedang offline",
          description: "Beberapa fitur mungkin tidak tersedia",
          variant: "destructive",
        });
      }
    };

    // Add event listeners for online/offline events
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  // Only render the status indicator if offline
  if (isOnline) return null;

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg py-2 px-3",
      "bg-destructive text-destructive-foreground shadow-lg"
    )}>
      <WifiOff size={16} />
      <span className="text-sm font-medium">Offline</span>
    </div>
  );
};

export default OfflineStatus;
