"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Copy, Users } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useSocket } from "@/hooks/useSocket";

export default function App() {
  const { socket, isConnected } = useSocket();
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [username, setUsername] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [timer, setTimer] = useState(5);
  const [userCount, setUserCount] = useState(1);
  const [remainingTime, setRemainingTime] = useState(null);

  // Socket event listeners
  useEffect(() => {
    if (socket) {
      socket.on('chat-message', (message) => {
        setMessages((prev) => [...prev, message]);
      });
  
      socket.on('user-count', (count) => {
        setUserCount(count);
      });

      socket.on('room-info', ({ userCount, timer }) => {
        setUserCount(userCount);
        if (timer) {
          setTimer(timer);
          setRemainingTime(timer * 60);
        }
      });
  
      return () => {
        socket.off('chat-message');
        socket.off('user-count');
        socket.off('room-info');
      };
    }
  }, [socket]);

  // Room management
  useEffect(() => {
    if (socket && group) {
      socket.emit("join-room", group);

      return () => {
        socket.emit("leave-room", group);
      };
    }
  }, [socket, group]);

  // Timer management
  useEffect(() => {
    let interval;
    if (group && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            leaveChat();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [group, remainingTime]);

  const handleJoin = () => {
    if (username && groupCode) {
      setUser(username);
      setGroup(groupCode);
      // Don't set remainingTime here - wait for room-info event
      toast.success(`Joined as ${username}`);
    } else {
      toast.error("Please enter both username and group code");
    }
  };

  const handleCreate = () => {
    if (username) {
      const newGroupCode = Math.random().toString(36).substring(7);
      // Emit create-room event with timer value
      socket.emit('create-room', {
        roomId: newGroupCode,
        timer: timer
      });
      setUser(username);
      setGroup(newGroupCode);
      setGroupCode(newGroupCode);
      setRemainingTime(timer * 60);
      toast.success(`Room created! You joined as ${username}`);
    } else {
      toast.error("Please enter a username");
    }
  };


  const copyGroupCode = () => {
    navigator.clipboard.writeText(groupCode);
    toast.success("Code copied to clipboard!");
  };

  const sendMessage = () => {
    if (inputMessage && socket) {
      const newMessage = {
        user: user,
        text: inputMessage,
        room: group,
      };
      socket.emit("chat-message", newMessage);
      setInputMessage("");
    }
  };

  const leaveChat = () => {
    if (socket && group) {
      socket.emit("leave-room", group);
    }
    setUser(null);
    setGroup(null);
    setMessages([]);
    setRemainingTime(null);
    toast.success("Left the chat");
  };

  if (!user || !group) {
    return (
      <div className="min-h-screen bg-background/95 flex items-center justify-center p-4">
        <Toaster />
        <Card className="w-full max-w-lg bg-card">
          <CardContent className="space-y-6 pt-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter">
                /terminate-d-chat
              </h1>
              <p className="text-muted-foreground">
                Spin up a quick chat channel, auto-destruct in {timer} minutes!
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Username</label>
              <Input
                placeholder="Enter a username or alias"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                This is your public display name.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Enter Chat ID</label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter room code"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  className="font-mono"
                />
                <Button size="icon" variant="outline" onClick={copyGroupCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Auto-destruct timer (2-10 minutes)
              </label>
              <Slider
                min={2}
                max={10}
                step={1}
                value={[timer]}
                onValueChange={(value) => setTimer(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Room will auto-destruct after {timer} minutes
              </p>
            </div>

            <Button className="w-full" variant="default" onClick={handleJoin}>
              Join
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button className="w-full" variant="outline" onClick={handleCreate}>
              Create a Room
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Create and share your room with your friends
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95 flex items-center justify-center p-4">
      <Toaster />
      <Card className="w-full max-w-3xl bg-card">
        <CardContent className="space-y-4 pt-6">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={leaveChat}>
              ← Leave
            </Button>
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Time left: {Math.floor(remainingTime / 60)}:
                {(remainingTime % 60).toString().padStart(2, "0")}
              </span>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">{userCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono">{group}</span>
                <Button variant="ghost" size="icon" onClick={copyGroupCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="h-[500px] border rounded-md p-4 overflow-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.user === user ? "text-right" : "text-left"
                }`}
              >
                {msg.type === "chat message" ? (
                  <div
                    className={`inline-block max-w-[80%] ${
                      msg.user === user ? "bg-primary/10" : "bg-muted"
                    } rounded-lg p-3`}
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      {msg.user}
                    </p>
                    <p>{msg.text}</p>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    {msg.user} {msg.text}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="font-mono"
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
