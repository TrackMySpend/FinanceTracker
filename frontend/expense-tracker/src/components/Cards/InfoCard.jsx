import React from 'react';

const InfoCard = ({ icon, label, value, color = 'bg-primary' }) => {
  return (
    <div className="flex gap-6 bg-base-100 p-6 rounded-2xl shadow-md border border-base-300">
      <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
        {icon}
      </div>

      <div>
        <h6 className="text-sm text-base-content/70 mb-1">{label}</h6>
        <span className="text-[22px] text-base-content">₹{value}</span>
      </div>
    </div>
  );
};

export default InfoCard;
