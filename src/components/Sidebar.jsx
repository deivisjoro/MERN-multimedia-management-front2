import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ categories }) => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen fixed">
      <ul className="space-y-2 p-4">
        {categories.map(category => (
          <li key={category._id} className="p-2 hover:bg-gray-700 rounded-md">
            <Link to={`/contents-by-category/${category._id}`} className="block">
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
