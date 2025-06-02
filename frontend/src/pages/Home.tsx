import React, { useEffect, useState } from 'react';
import { fetchNotes, createNote, updateNote } from '../services/api';
import TaskBoard from '../components/TaskBoard';

const Home: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null); 
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: '',
    color: '',
    tags: '',
    pinned: false,
  });

  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const getNotes = async () => {
      if (!token) {
        setError('No token found. Please login.');
        return;
      }

      try {
        const data = await fetchNotes(token);
        if (Array.isArray(data)) {
          setNotes(data);
          setError(null);
        } else {
          setError('Failed to fetch notes.');
        }
      } catch {
        setError('Error fetching notes.');
      }
    };

    getNotes();
  }, [token]);

  return (
    <main className="container mx-auto px-6 py-8 text-white">
      <header className="backdrop-blur-md bg-opacity-30 bg-gray-800 border-b border-blue-500/30 mb-6 rounded-xl">
  <div className="px-6 py-4 flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <i className="fas fa-cube text-3xl text-blue-400 animate-pulse"></i>
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
      NoteThat
      </h1>
    </div>
    <div className="relative">
      <input
        type="text"
        placeholder="Search notes..."
        className="bg-gray-800/50 border border-blue-500/30 rounded-full px-6 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <i className="fas fa-search absolute right-4 top-3 text-blue-400"></i>
    </div>
    <div className="flex items-center space-x-4">
      {token && (
        <>
          <button className="!rounded-button relative p-2 hover:bg-blue-500/20 rounded-full">
            <i className="fas fa-bell text-blue-400"></i>
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <button
            className="!rounded-button w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
          >
            <i className="fas fa-user"></i>
          </button>
        </>
      )}
    </div>
  </div>
</header>

<h1 className="text-3xl font-bold text-blue-300 mb-6 flex items-center gap-3">
  <i className="fas fa-book-open text-blue-400 animate-pulse"></i> Your Notes
</h1>

{!token ? (
  <p className="text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-400/30">
    No token found. Please{' '}
    <a href="/login" className="underline text-blue-400 hover:text-blue-200 transition-colors">
      login
    </a>
    .
  </p>
) : (
  <>
    {error && <p className="text-red-400 mb-4">{error}</p>}

    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <input
        type="text"
        placeholder="🔍 Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/2 px-4 py-2 bg-gray-800 text-white border border-blue-500/20 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder:text-gray-400"
      />

      <button
        onClick={() => setShowCreateModal(true)}
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition-transform hover:scale-105"
      >
        <i className="fas fa-plus mr-2"></i> New Note
      </button>
    </div>

    {(() => {
      const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const pinnedNotes = filteredNotes.filter(note => note.pinned);
      const unpinnedNotes = filteredNotes.filter(note => !note.pinned);

      return (
        <>
          {pinnedNotes.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-yellow-300 mb-2">📌 Pinned</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {pinnedNotes.map(note => (
                  <div
                    key={note._id}
                    className="group bg-white/5 backdrop-blur-md p-5 rounded-xl border border-yellow-400/30 hover:border-yellow-400 transition duration-300 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-blue-300">{note.title}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full ${note.color} bg-opacity-20`}>
                        {note.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-3">{note.content}</p>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{new Date(note.timestamp).toLocaleDateString()}</span>
                      <button
                        className="text-yellow-300 hover:text-yellow-100 transition"
                        onClick={async () => {
                          const updated = await updateNote(note._id, { pinned: false }, token!);
                          setNotes(prev => prev.map(n => (n._id === updated._id ? updated : n)));
                        }}
                      >
                        📌 Unpin
                      </button>
                      
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {pinnedNotes.length > 0 && unpinnedNotes.length > 0 && (
            <hr className="border-blue-500/20 my-6" />
          )}

          {unpinnedNotes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unpinnedNotes.map(note => (
                <div
                  key={note._id}
                  className="group bg-white/5 backdrop-blur-md p-5 rounded-xl border border-blue-500/30 hover:border-blue-400 transition duration-300 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-blue-300">{note.title}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full ${note.color} bg-opacity-20`}>
                      {note.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-3">{note.content}</p>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{new Date(note.timestamp).toLocaleDateString()}</span>
                    <button
                      className="text-yellow-300 hover:text-yellow-100 transition"
                      onClick={async () => {
                        const updated = await updateNote(note._id, { pinned: true }, token!);
                        setNotes(prev => prev.map(n => (n._id === updated._id ? updated : n)));
                      }}
                    >
                      📍 Pin
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      );
    })()}
  </>
)}

{/* Create Note Modal */}
{showCreateModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-blue-500/30 p-6 w-full max-w-md text-white shadow-2xl space-y-5">
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-300 flex items-center gap-2">
          <i className="fas fa-pen"></i> Create New Note
        </h2>
        <button
          onClick={() => setShowCreateModal(false)}
          className="text-gray-400 hover:text-white transition"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <input
        type="text"
        placeholder="📌 Title"
        className="w-full p-3 bg-gray-700/70 border border-blue-500/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
        value={newNote.title}
        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
      />

      <textarea
        placeholder="📝 Content"
        className="w-full p-3 bg-gray-700/70 border border-blue-500/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 h-28 resize-none"
        value={newNote.content}
        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
      />

<select
  className="w-full p-2 rounded bg-gray-700 text-white"
  value={newNote.category}
  onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
>
  <option value="">Select category</option>
  <option value="Development">Development</option>
  <option value="Research">Research</option>
  <option value="Science">Science</option>
  <option value="Meeting">Meeting</option>
  <option value="Personal">Personal</option>
</select>

<select
  className="w-full p-2 rounded bg-gray-700 text-white"
  value={newNote.color}
  onChange={(e) => setNewNote({ ...newNote, color: e.target.value })}
>
  <option value="">Select color</option>
  <option value="bg-blue-400">Blue</option>
  <option value="bg-purple-400">Purple</option>
  <option value="bg-cyan-400">Cyan</option>
  <option value="bg-green-400">Green</option>
  <option value="bg-pink-400">Pink</option>
</select>


      <input
        type="text"
        placeholder="🏷️ Tags (comma separated)"
        className="w-full p-3 bg-gray-700/70 border border-blue-500/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
        value={newNote.tags}
        onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
      />

      <label className="flex items-center space-x-3 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={newNote.pinned}
          onChange={(e) => setNewNote({ ...newNote, pinned: e.target.checked })}
          className="w-5 h-5 text-blue-500 focus:ring-blue-400 border-gray-600 rounded"
        />
        <span>📌 Pin this note</span>
      </label>

      <div className="flex justify-end gap-4 pt-2">
        <button
          onClick={() => setShowCreateModal(false)}
          className="text-gray-400 hover:text-white transition"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            const payload = {
              ...newNote,
              tags: newNote.tags.split(',').map(tag => tag.trim()),
              collaborators: [],
            };
            const created = await createNote(payload, token!);
            setNotes(prev => [...prev, created]);
            setShowCreateModal(false);
            setNewNote({ title: '', content: '', category: '', color: '', tags: '', pinned: false });
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

<div className="mt-12">
{token && <TaskBoard />}
</div>


    </main>
  );
};

export default Home;
