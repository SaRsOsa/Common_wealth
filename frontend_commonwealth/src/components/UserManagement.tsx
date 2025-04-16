import React from "react";
import { Users, UserPlus, Search, MoreVertical } from "lucide-react";
export function UserManagement() {
  const users = [{
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active"
  }, {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Analyst",
    status: "Active"
  }, {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Decision Maker",
    status: "Inactive"
  }];
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          User Management
        </h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 font-medium text-gray-900">Name</th>
                  <th className="pb-3 font-medium text-gray-900">Email</th>
                  <th className="pb-3 font-medium text-gray-900">Role</th>
                  <th className="pb-3 font-medium text-gray-900">Status</th>
                  <th className="pb-3 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(user => <tr key={user.id}>
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="ml-3 font-medium text-gray-900">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600">{user.email}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
}