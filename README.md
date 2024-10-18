# Chat App

A simple chat app using Socket.io. Still a WIP, but it's deployed [here](https://chatappprod.onrender.com/).

## Tech Stack

- **Frontend**: React, TailwindCSS, Shadcn, AceternityUI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Auth**: JWT, Zod
- **State Management**: Zustand (Switching to RTK soon)

## Limitations
(Temp)
1. Can’t message unregistered users yet or share them link
2. No real-time notifications
3. Voice/video calls are missing
4. Group chat isn’t available
5. Not built for large scale (yet) Need to implement Kafka, Redis, microservices, load balancing, etc.
