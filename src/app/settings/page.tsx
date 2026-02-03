import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { users } from '@/lib/data';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/settings/theme-toggle';

export default function SettingsPage() {
  const currentUser = users[0];

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset>
        <Header user={currentUser} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8">
          <section>
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h2 className="text-3xl font-bold tracking-tight text-foreground font-headline">
                Settings
              </h2>
            </div>
          </section>

          <section className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Theme</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a theme for your dashboard.
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </SidebarInset>
    </div>
  );
}
