
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { users } from "@/lib/data";
import { MessageSquare, Rss } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-headline mb-2">Community Hub</h1>
          <p className="text-muted-foreground max-w-2xl">
            Connect with other farmers and equipment owners in the TechnoTrac network.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rss />
                Community Feed
              </CardTitle>
              <CardDescription>
                Updates and posts from the community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <p>Community feed feature coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                Find other members near you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                      <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.displayName}</p>
                      <p className="text-sm text-muted-foreground">{user.location}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" /> Connect
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
