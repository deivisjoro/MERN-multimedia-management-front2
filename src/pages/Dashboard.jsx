import React from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';

const Dashboard = () => {
  const user = useSelector(state => state.auth.user);

  return (
    <div>
      <main className="p-4">
        <h1 className="text-3xl text-center text-blue-800 font-bold">
          Bienvenido, {user.username} ({user.email})
        </h1>
      </main>
    </div>
  );
};

export default Dashboard;
