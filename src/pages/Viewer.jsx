import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, FileText } from 'lucide-react';

const Viewer = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');
  const title = searchParams.get('title') || 'Document Viewer';

  if (!url) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="glass p-12 inline-block">
          <FileText size={48} className="text-slate-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">No Document Selected</h2>
          <Link to="/" className="btn-primary inline-block">Go Back Home</Link>
        </div>
      </div>
    );
  }

  // Use Google Docs Viewer to force inline preview
  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;

  return (
    <div className="min-h-[calc(100-80px)] flex flex-col">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h2 className="text-lg font-bold truncate max-w-xs md:max-w-md">{title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Open in new tab"
            >
              <ExternalLink size={20} />
            </a>
            <a 
              href={url} 
              download
              className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
            >
              <Download size={16} />
              Download
            </a>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 p-4 md:p-8">
        <div className="max-w-5xl mx-auto h-[85vh] glass overflow-hidden shadow-2xl">
          <iframe 
            src={viewerUrl} 
            className="w-full h-full border-none"
            title={title}
          />
        </div>
      </div>
    </div>
  );
};

export default Viewer;
