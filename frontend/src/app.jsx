import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const contentRef = useRef(null); // 👈 for focusing textarea

  const fetchNotes = async () => {
    const res = await axios.get('http://localhost:5000/notes');
    setNotes(res.data);
  };

  const addNote = async () => {
    if (!title || !content) return alert("Please enter title and content.");
    const res = await axios.post('http://localhost:5000/notes', { title, content });
    setNotes([...notes, res.data]);
    setTitle('');
    setContent('');
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:5000/notes/${id}`);
    setNotes(notes.filter(note => note._id !== id));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="container">
      <h1>📝 My Notes</h1>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();          // Prevent submitting or newline
            contentRef.current?.focus(); // 👈 Move focus to content textarea
          }
        }}
        placeholder="Title"
      />

      <textarea
        ref={contentRef} // 👈 This allows focusing from title input
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Content"
        rows="3"
      />

      <button onClick={addNote}>Add Note</button>

      <ul>
        {notes.map(note => (
          <li key={note._id} className="note">
            <strong>{note.title}</strong>: {note.content}
            <button className="delete-btn" onClick={() => deleteNote(note._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
