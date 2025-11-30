import React from 'react';
import { ResourceLink } from '../types';
import { ExternalLink, BarChart2, FileText, Globe } from 'lucide-react';

interface ResourceListProps {
  resources: ResourceLink[];
  title: string;
}

const ResourceList: React.FC<ResourceListProps> = ({ resources, title }) => {
  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Chart': return <BarChart2 className="w-4 h-4 text-purple-400" />;
      case 'Official': return <FileText className="w-4 h-4 text-blue-400" />;
      default: return <Globe className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 h-full">
      <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">{title}</h3>
      <div className="space-y-4">
        {resources.map((res, idx) => (
          <a 
            key={idx} 
            href={res.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block p-4 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-blue-500 transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 mb-1">
                {getIcon(res.category)}
                <span className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                  {res.name}
                </span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{res.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ResourceList;