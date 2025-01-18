"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function Home({ setUser, setGroup }) {
  const [username, setUsername] = useState("");
  const [groupCode, setGroupCode] = useState("");

  const handleCreateGroup = () => {
    if (username) {
      const newGroupCode = Math.random().toString(36).substring(7);
      setUser(username);
      setGroup(newGroupCode);
      toast.success("Group created successfully!");
    } else {
      toast.error("Please enter a username");
    }
  };

  const handleJoinGroup = () => {
    if (username && groupCode) {
      setUser(username);
      setGroup(groupCode);
      toast.success("Joined group successfully!");
    } else {
      toast.error("Please enter both username and group code");
    }
  };

  const copyGroupCode = () => {
    navigator.clipboard.writeText(groupCode);
    toast.success("Group code copied to clipboard!");
  };

  return (
    <Tabs defaultValue="create" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">Create Group</TabsTrigger>
        <TabsTrigger value="join">Join Group</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-username">Username</Label>
            <Input
              id="create-username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateGroup} className="w-full">
            Create Group
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="join">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="join-username">Username</Label>
            <Input
              id="join-username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-code">Group Code</Label>
            <div className="flex space-x-2">
              <Input
                id="group-code"
                placeholder="Enter group code"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={copyGroupCode} size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button onClick={handleJoinGroup} className="w-full">
            Join Group
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
