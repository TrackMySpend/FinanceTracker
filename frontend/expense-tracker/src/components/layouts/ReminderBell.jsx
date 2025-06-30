import { useEffect, useState } from 'react';
import { getDueReminders } from '../../utils/reminderApi'; // Adjust the import path as necessary
import { Link } from 'react-router-dom';

const ReminderBell = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    getDueReminders().then(res => {
      setCount(res.data.length);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  return (
    <Link to="/dashboard" style={{ position: 'relative', marginLeft: '20px' }}>
      <i className="fas fa-bell"></i>
      {count > 0 && (
        <span style={{
          position: 'absolute',
          top: '-5px',
          right: '-10px',
          background: 'red',
          color: 'white',
          borderRadius: '50%',
          padding: '2px 6px',
          fontSize: '12px'
        }}>{count}</span>
      )}
    </Link>
  );
};

export default ReminderBell;
