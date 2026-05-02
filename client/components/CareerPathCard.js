'use client';

import { ArrowRight } from 'lucide-react';

export default function CareerPathCard({ title, icon: Icon, description, growth, cta = 'Explore Role' }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <Icon size={24} className="text-purple-600" />
        </div>
        <span className="text-sm font-semibold text-green-600">{growth}</span>
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-2">
        {cta}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
