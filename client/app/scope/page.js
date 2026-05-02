'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { TrendingUp, MapPin, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function FutureScope() {
  const demandData = [
    { name: 'AI', demand: 85 },
    { name: 'Cybersecurity', demand: 78 },
    { name: 'Web Dev', demand: 72 },
    { name: 'Data Science', demand: 88 },
    { name: 'Cloud', demand: 82 },
  ];

  const salaryData = [
    { level: 'Entry', salary: 72 },
    { level: 'Mid', salary: 115 },
    { level: 'Senior', salary: 185 },
  ];

  const opportunityHubs = [
    { city: 'San Francisco, USA', score: 9.8, opportunities: 2400 },
    { city: 'London, UK', score: 9.2, opportunities: 1980 },
    { city: 'Berlin, DE', score: 8.7, opportunities: 1500 },
    { city: 'Singapore, SG', score: 8.5, opportunities: 1200 },
  ];

  const skillSaturation = [
    { skill: 'React.js', status: 'Over-saturated', color: 'bg-red-500' },
    { skill: 'Rust', status: 'Emerging High', color: 'bg-yellow-500' },
    { skill: 'TensorFlow', status: 'Optimal Growth', color: 'bg-green-500' },
  ];

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Future Scope Analysis</h1>
            <p className="text-gray-600">
              Market intelligence for your career path. Understand demand, opportunities, and growth trajectories.
            </p>
            <button className="mt-4 btn-primary">Export Report</button>
          </div>

          {/* Industry Demand Projections */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-purple-600" />
              Industry Demand Projections (2026)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="demand" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Salary Trajectory */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold mb-6">Salary Trajectory</h3>
              <div className="space-y-4">
                {salaryData.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{item.level} Level</span>
                      <span className="text-lg font-bold text-purple-600">${item.salary}K /yr</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
                        style={{ width: `${(item.salary / 185) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-green-600 mt-6">↗ 12% Growth projected vs 2024</p>
            </div>

            {/* Software Engineer Stats */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold mb-6">Software Engineer - Global Average</h3>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">82%</p>
                    <p className="text-sm text-purple-200">Stability Index</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Low rate of automation in the next 10 years for Creative Engineering roles.
                </p>
                <button className="btn-primary">Ready to pivot your strategy?</button>
              </div>
            </div>
          </div>

          {/* Global Opportunity Hubs */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-purple-600" />
              Global Opportunity Hubs
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {opportunityHubs.map((hub, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{hub.city}</h3>
                    <span className="text-2xl font-bold text-purple-600">{hub.score}</span>
                  </div>
                  <p className="text-sm text-gray-600">{hub.opportunities.toLocaleString()} Opportunities</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Saturation */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="text-purple-600" />
              Skill Saturation & Stability Index
            </h2>
            <div className="space-y-4">
              {skillSaturation.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <span className="font-semibold">{item.skill}</span>
                  <div className="flex items-center gap-3">
                    <div className={`w-16 h-2 ${item.color} rounded-full`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
