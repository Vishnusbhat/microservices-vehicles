import React from 'react';

const UserInfo = ({ user }) => (
  <div className="mb-8">
    <p className="text-lg mb-2">
      <span className="font-bold text-blue-300">Name:</span> {user.name}
    </p>
    <p className="text-lg">
      <span className="font-bold text-blue-300">Email:</span> {user.email}
    </p>
  </div>
);

export default UserInfo;
