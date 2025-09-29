'use client';

import { useState, useEffect } from 'react';

interface NotesSectionProps {
  username: string;
}

export default function NotesSection({ username }: NotesSectionProps) {
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  
  const notesKey = `notes-${username}`;

  useEffect(() => {
    // Load existing notes 
    const savedNotes = localStorage.getItem(notesKey);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [username, notesKey]);

  const handleSave = () => {
    localStorage.setItem(notesKey, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000); 
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Notes</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add your notes about this user here..."
        className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-700 text-gray-900 placeholder-gray-700"
      />
      <div className="mt-3 flex justify-between items-center">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Save Note
        </button>
        {saved && (
          <span className="text-green-600 font-medium">Note saved!</span>
        )}
      </div>
    </div>
  );
}