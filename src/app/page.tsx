import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import ChatRoom from './components/ChatRoom';
import 'firebase/app';

const HomePage: NextPage = () => {
  return (
    <div >
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Video chat app with WebRTC and Firebase" />
      </Head>
      <main >
        <div className="text-center">
          <h1 className="text-4xl font-bold " >Q´hubo Chat</h1>
        </div>
        <div >
          <ChatRoom />
        </div>

      </main>
    </div>
  );
};

export default HomePage;