import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignModal = ({ taskId, onClose, onAssign }) => {
  const [attendees, setAttendees] = useState([]);
  const [selectedAttendee, setSelectedAttendee] = useState('');

  // Fetch the list of attendees
  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/attendees');
        setAttendees(response.data.attendees);
      } catch (error) {
        console.error('Error fetching attendees:', error);
      }
    };

    fetchAttendees();
  }, []);

  const handleAssign = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/v1/assignAttendee', {
        taskid: taskId,
        userid: selectedAttendee,
      });
      onAssign(response.data.message);
      onClose();
    } catch (error) {
      console.error('Error assigning attendee:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Assign Attendee</h3>
        <select
          value={selectedAttendee}
          onChange={(e) => setSelectedAttendee(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        >
          <option value="">Select an Attendee</option>
          {attendees.map((attendee) => (
            <option key={attendee._id} value={attendee._id}>
              {attendee.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
