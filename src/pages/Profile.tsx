import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { User, PostWithAuthor } from "@shared/schema";

export function Profile() {
  const { toast } = useToast();
  
  // Mock current user data - in real app this would come from auth context
  const currentUser: User = {
    id: "user-1",
    username: "johnsmith",
    email: "john@example.com",
    name: "John Smith",
    bio: "Senior Developer at TechCorp passionate about AI and web development",
    avatar: null,
    createdAt: new Date("2023-01-15"),
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    bio: currentUser.bio || "",
    email: currentUser.email,
    username: currentUser.username,
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyDigest: true,
    publicProfile: true,
    showEmail: false,
  });

  // Fetch user's posts for stats
  const { data: userPosts = [] } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/users", currentUser.id, "posts"],
    enabled: !!currentUser.id,
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser.name,
      bio: currentUser.bio || "",
      email: currentUser.email,
      username: currentUser.username,
    });
    setIsEditing(false);
  };

  const totalLikes = userPosts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
  const totalComments = userPosts.reduce((sum, post) => sum + (post.commentsCount || 0), 0);
  const publishedPosts = userPosts.filter(post => post.isPublished).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Basic Information</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-2xl">
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{currentUser.name}</h3>
                  <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <i className="fas fa-camera mr-2"></i>
                    Change Avatar
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={3}
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="flex gap-3">
                  <Button onClick={handleSave} className="btn-primary">
                    <i className="fas fa-save mr-2"></i>
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about comments and likes
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Weekly Digest</h4>
                  <p className="text-sm text-muted-foreground">
                    Get a weekly summary of your post performance
                  </p>
                </div>
                <Switch
                  checked={settings.weeklyDigest}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, weeklyDigest: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Public Profile</h4>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to other users
                  </p>
                </div>
                <Switch
                  checked={settings.publicProfile}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, publicProfile: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Show Email</h4>
                  <p className="text-sm text-muted-foreground">
                    Display your email address on your public profile
                  </p>
                </div>
                <Switch
                  checked={settings.showEmail}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, showEmail: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Profile Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-lg mr-3">
                    <i className="fas fa-file-alt text-primary"></i>
                  </div>
                  <span className="text-sm">Total Posts</span>
                </div>
                <Badge variant="secondary">{userPosts.length}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                    <i className="fas fa-check-circle text-green-600 dark:text-green-400"></i>
                  </div>
                  <span className="text-sm">Published</span>
                </div>
                <Badge variant="secondary">{publishedPosts}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg mr-3">
                    <i className="fas fa-heart text-red-600 dark:text-red-400"></i>
                  </div>
                  <span className="text-sm">Total Likes</span>
                </div>
                <Badge variant="secondary">{totalLikes}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                    <i className="fas fa-comment text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <span className="text-sm">Total Comments</span>
                </div>
                <Badge variant="secondary">{totalComments}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm">Member Since</h4>
                <p className="text-muted-foreground text-sm">
                  {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Unknown date'}
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-sm">Account Type</h4>
                <div className="flex items-center mt-1">
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                    Pro Writer
                  </Badge>
                </div>
              </div>

              <Separator />

              <Button variant="outline" className="w-full">
                <i className="fas fa-crown mr-2"></i>
                Upgrade Account
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <i className="fas fa-download mr-2"></i>
                Export Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <i className="fas fa-shield-alt mr-2"></i>
                Privacy Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <i className="fas fa-question-circle mr-2"></i>
                Help & Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
