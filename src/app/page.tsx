import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import ChatRoom from './components/ChatRoom';
import 'firebase/app';

const HomePage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Video Chat App</title>
        <meta name="description" content="Video chat app with WebRTC and Firebase" />
      </Head>
      <main>
        <h1>Video Chat App</h1>
        <ChatRoom />
      </main>
    </div>
  );
};

export default HomePage;