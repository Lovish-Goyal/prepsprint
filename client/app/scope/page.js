'use client';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { TrendingUp, MapPin, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FutureScope() {
  const demandData = [
    { name: 'AI Eng', demand: 98 },
    { name: 'Cloud K8s', demand: 92 },
    { name: 'LLM RAG', demand: 95 },
    { name: 'Next.js', demand: 89 },
    { name: 'Rust Sys', demand: 85 },
    { name: 'Cybersec', demand: 84 },
    { name: 'Data Eng', demand: 88 },
    { name: 'Go Micro', demand: 90 },
    { name: 'Flutter', demand: 76 },
    { name: 'IoT Dev', demand: 70 },
    { name: 'GraphQL', demand: 78 },
    { name: 'Postgres', demand: 82 },
    { name: 'NoSQL', demand: 80 },
    { name: 'SRE Ops', demand: 87 },
    { name: 'Vector DB', demand: 93 },
    { name: 'DevOps CI', demand: 91 },
    { name: 'Zero Trust', demand: 83 },
    { name: 'Quantum', demand: 68 },
    { name: 'React Nat', demand: 74 },
    { name: 'Python AI', demand: 86 },
  ];

  const salaryData = [
    { level: 'AI Researcher', salary: 280 },
    { level: 'ML Engineer', salary: 240 },
    { level: 'SRE / Cloud Lead', salary: 220 },
    { level: 'Security Architect', salary: 210 },
    { level: 'Backend Principal', salary: 200 },
    { level: 'Senior Staff Eng', salary: 195 },
    { level: 'Full Stack Arch.', salary: 185 },
    { level: 'DevOps Engineer', salary: 165 },
    { level: 'Engineering Mgr.', salary: 175 },
    { level: 'Next.js Dev', salary: 155 },
    { level: 'Go/Rust Developer', salary: 160 },
    { level: 'DB Architect', salary: 150 },
    { level: 'Data Engineer', salary: 145 },
    { level: 'React Lead', salary: 140 },
    { level: 'iOS Native Dev', salary: 135 },
    { level: 'Android Native Dev', salary: 130 },
    { level: 'QA Automation', salary: 110 },
    { level: 'Technical Writer', salary: 95 },
    { level: 'Junior SDE', salary: 85 },
    { level: 'Entry-level Analyst', salary: 72 },
  ];

  const opportunityHubs = [
    { city: 'San Francisco, USA', score: 9.9, opportunities: 3200 },
    { city: 'New York, USA', score: 9.7, opportunities: 2850 },
    { city: 'London, UK', score: 9.5, opportunities: 2500 },
    { city: 'Seattle, USA', score: 9.4, opportunities: 2300 },
    { city: 'Tokyo, JP', score: 9.2, opportunities: 2100 },
    { city: 'Toronto, CA', score: 9.1, opportunities: 1950 },
    { city: 'Berlin, DE', score: 9.0, opportunities: 1850 },
    { city: 'Austin, USA', score: 8.9, opportunities: 1800 },
    { city: 'Singapore, SG', score: 8.8, opportunities: 1750 },
    { city: 'Bangalore, IN', score: 8.7, opportunities: 1700 },
    { city: 'Sydney, AU', score: 8.6, opportunities: 1500 },
    { city: 'Dublin, IE', score: 8.5, opportunities: 1400 },
    { city: 'Amsterdam, NL', score: 8.4, opportunities: 1350 },
    { city: 'Paris, FR', score: 8.3, opportunities: 1250 },
    { city: 'Tel Aviv, IL', score: 8.2, opportunities: 1150 },
    { city: 'Boston, USA', score: 8.1, opportunities: 1100 },
    { city: 'Munich, DE', score: 8.0, opportunities: 1050 },
    { city: 'Seoul, KR', score: 7.9, opportunities: 1000 },
    { city: 'Stockholm, SE', score: 7.8, opportunities: 950 },
    { city: 'Zurich, CH', score: 7.7, opportunities: 900 },
  ];

  const skillSaturation = [
    { skill: 'Vanilla JavaScript', status: 'Optimal Baseline', color: 'bg-green-500' },
    { skill: 'React.js', status: 'Over-saturated', color: 'bg-red-500' },
    { skill: 'Rust & WebAssembly', status: 'Emerging High', color: 'bg-blue-500' },
    { skill: 'Next.js Server Actions', status: 'Growing Demand', color: 'bg-yellow-500' },
    { skill: 'Docker Containerization', status: 'Standard Practice', color: 'bg-green-500' },
    { skill: 'Kubernetes Operators', status: 'High Scarcity', color: 'bg-blue-500' },
    { skill: 'Vector Search / RAG', status: 'High Growth', color: 'bg-blue-500' },
    { skill: 'LangChain & LlamaIndex', status: 'Highly Demanded', color: 'bg-yellow-500' },
    { skill: 'PostgreSQL Query Opt', status: 'Optimal Level', color: 'bg-green-500' },
    { skill: 'GraphQL APIs', status: 'Stable Demand', color: 'bg-green-500' },
    { skill: 'Flutter Cross-platform', status: 'Balanced Supply', color: 'bg-green-500' },
    { skill: 'Three.js / WebGL', status: 'Niche Value', color: 'bg-yellow-500' },
    { skill: 'Solidity / Web3', status: 'Slightly Saturated', color: 'bg-red-500' },
    { skill: 'Go Routines & Concur.', status: 'Optimal Growth', color: 'bg-green-500' },
    { skill: 'C++ Systems Dev', status: 'Critical Shortage', color: 'bg-blue-500' },
    { skill: 'Terraform IaC', status: 'Standardized', color: 'bg-green-500' },
    { skill: 'OpenAPI Specifications', status: 'Baseline Expectation', color: 'bg-green-500' },
    { skill: 'CI/CD YAML Actions', status: 'Slightly Saturated', color: 'bg-red-500' },
    { skill: 'Redis Caching Pattern', status: 'Stable Skillset', color: 'bg-green-500' },
    { skill: 'Kafka Stream Processing', status: 'High Growth', color: 'bg-blue-500' },
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
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="demand" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Salary Trajectory */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-8 max-h-[500px] overflow-y-auto">
              <h3 className="text-xl font-bold mb-6">Salary Trajectory</h3>
              <div className="space-y-4">
                {salaryData.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-sm">{item.level}</span>
                      <span className="text-md font-bold text-purple-600">${item.salary}K /yr</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${(item.salary / 280) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-green-600 mt-6">↗ 12% Growth projected vs 2024</p>
            </div>

            {/* Software Engineer Stats */}
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col justify-center">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[500px] overflow-y-auto">
              {opportunityHubs.map((hub, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{hub.city}</h3>
                    <span className="text-xl font-bold text-purple-600">{hub.score}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {skillSaturation.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <span className="font-semibold text-sm">{item.skill}</span>
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
