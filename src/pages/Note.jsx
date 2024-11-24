import { useState, useEffect } from "react";
import { FiSidebar, FiTrash2 } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import useAuth from "../hooks/useAuth";

const Note = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [note, setNote] = useState({ title: "", content: "" });
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };
  console.log(user.email);
  const handleTitleChange = (e) => {
    setNote((prevNote) => ({
      ...prevNote,
      title: e.target.value,
    }));
  };

  // Search functionality
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContentChange = (e) => {
    setNote((prevNote) => ({
      ...prevNote,
      content: e.target.value,
    }));
  };

  // Fetch notes from the backend
  const fetchNotes = async () => {
    try {
      const response = await fetch(
        "https://notenest-server.onrender.com/notes"
      );
      if (response.ok) {
        const data = await response.json();

        // Filter notes to include only those matching user.email
        const filteredNotes = data.filter((note) => note.email === user.email);

        // Update state with filtered notes
        setNotes(filteredNotes);
      } else {
        console.error("Failed to fetch notes:", response.statusText);
        alert("Failed to fetch notes.");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      alert("An error occurred while fetching notes.");
    }
  };

  // Save the note (new or update)
  const saveNote = async () => {
    if (!note.title || !note.content) {
      alert("Please fill in both the title and content.");
      return;
    }

    if (selectedNoteId) {
      updateNote();
    } else {
      try {
        // Include user.email in the note data
        const noteWithUserEmail = {
          ...note,
          email: user?.email || "default@example.com", // Default for testing
        };

        console.log(noteWithUserEmail);

        const response = await fetch(
          "https://notenest-server.onrender.com/notes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(noteWithUserEmail), // Pass note with email
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Note saved:", data);
          alert("Note saved successfully!");
          setNote({ title: "", content: "" }); // Reset form
          fetchNotes(); // Refresh the notes list
        } else {
          console.error("Failed to save note:", response.statusText);
          alert("Failed to save the note. Please try again.");
        }
      } catch (error) {
        console.error("Error while saving note:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  // Update the existing note
  const updateNote = async () => {
    try {
      const response = await fetch(
        `https://notenest-server.onrender.com/notes/${selectedNoteId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(note),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Note updated:", data);
        alert("Note updated successfully!");
        setNote({ title: "", content: "" });
        setSelectedNoteId(null);
        fetchNotes(); // Refresh the notes list
      } else {
        console.error("Failed to update note:", response.statusText);
        alert("Failed to update the note. Please try again.");
      }
    } catch (error) {
      console.error("Error while updating note:", error);
      alert("An error occurred while updating the note.");
    }
  };

  // Delete the selected note
  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(
        `https://notenest-server.onrender.com/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Note deleted");
        alert("Note deleted successfully!");
        fetchNotes(); // Refresh the notes list after deletion
      } else {
        console.error("Failed to delete note:", response.statusText);
        alert("Failed to delete the note. Please try again.");
      }
    } catch (error) {
      console.error("Error while deleting note:", error);
      alert("An error occurred while deleting the note.");
    }
  };

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  });

  // Handle clicking on a note from the sidebar
  const handleNoteClick = (selectedNote) => {
    setNote({
      title: selectedNote.title,
      content: selectedNote.content,
    });
    setSelectedNoteId(selectedNote._id); // Set the selected note ID for update
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 h-full bg-base-200 w-80 shadow-lg z-10 overflow-y-auto">
          <ul className="menu text-base-content p-4 space-y-2">
            <li className="font-bold text-lg">All Notes</li>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearchChange}
            />

            {/* Dynamic Note List */}
            {filteredNotes.map((note, index) => (
              <li
                key={index}
                className="mb-4 flex justify-between items-center"
              >
                {/* Note Preview with Delete Button */}
                <div className="flex items-center w-full">
                  <a
                    onClick={() => handleNoteClick(note)} // When a note is clicked, set it as the current note
                    className="block flex-1 cursor-pointer"
                  >
                    <h3 className="font-semibold text-white text-lg">
                      {note.title}
                    </h3>
                    <p
                      className="text-sm mt-1 text-white"
                      style={{ opacity: 0.7 }}
                    >
                      {note.content.length > 50
                        ? note.content.slice(0, 50) + "..."
                        : note.content}
                    </p>
                  </a>

                  {/* Delete Icon aligned with text */}
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="text-white ml-4"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-80" : "ml-0"
        }`}
      >
        {/* Header with Sidebar and Pencil Icons */}
        <div className="flex items-center justify-between p-2">
          {/* Sidebar Toggle Button */}
          <h1 onClick={toggleSidebar} className="text-2xl cursor-pointer">
            <FiSidebar />
          </h1>

          {/* Pencil Icon */}
          <h1 className="text-2xl cursor-pointer">
            <LuPencilLine />
          </h1>
        </div>

        {/* Note Taking Area */}
        <div className="p-4 flex-1 bg-base-100">
          {/* Title Input Area */}
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Enter note title"
            value={note.title}
            onChange={handleTitleChange}
          />

          {/* Content Area */}
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Start writing your note here..."
            value={note.content}
            onChange={handleContentChange}
          />

          {/* Conditional Button */}
          <button
            onClick={saveNote}
            className="bg-blue-500 text-white p-2 rounded"
          >
            {selectedNoteId ? "Update Note" : "Save Note"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Note;
