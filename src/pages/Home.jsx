import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api';
import { Link } from 'react-router-dom';
import { FileText, Eye, Download, Search } from 'lucide-react';

const Home = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/documents`);
      setDocuments(response.data);
    } catch (err) {
      setError('Failed to fetch documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Your <span className="text-primary">Cloud</span> Vault</h1>
          <p className="text-slate-400 text-lg">Securely stored, easily accessible documents.</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2 w-fit">
          <FileText size={20} />
          Upload New
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      {documents.length === 0 ? (
        <div className="glass p-20 text-center flex flex-col items-center">
          <Search size={64} className="text-slate-600 mb-6" />
          <h3 className="text-2xl font-bold mb-2">No documents yet</h3>
          <p className="text-slate-400 mb-8 max-w-md">Upload your first document to get started with Resilient Cloud storage.</p>
          <Link to="/upload" className="text-primary hover:underline font-semibold">Start uploading now →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="glass p-6 group hover:border-primary/30 transition-all duration-300">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-1 truncate">{doc.title}</h3>
              <p className="text-slate-500 text-sm mb-6">
                Uploaded on {new Date(doc.created_at).toLocaleDateString()}
              </p>
              <div className="flex gap-3">
                <Link 
                  to={`/viewer?url=${encodeURIComponent(doc.file_url)}&title=${encodeURIComponent(doc.title)}`}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye size={16} />
                  View
                </Link>
                <a 
                  href={doc.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  <Download size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
