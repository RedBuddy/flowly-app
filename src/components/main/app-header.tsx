import { Wallet, Bell } from "lucide-react";
import { ModeToggle } from "../theme/toggle-theme";
import { NotificationMenu } from "../modal";

export const AppHeader = () => {
  return (
    <header className="z-40 bg-background/80 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent">
              <Wallet className="w-6 h-6 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-extrabold font-playfair text-foreground">Flowly</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* <button className="relative p-3 rounded-xl hover:bg-accent transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
            </button> */}
            <NotificationMenu />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
