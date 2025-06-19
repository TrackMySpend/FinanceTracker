import React, { useState } from 'react';
import { LuImage, LuX } from 'react-icons/lu';
import EmojiPicker from 'emoji-picker-react';

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='flex flex-col md:flex-row items-start gap-5 mb-6'>
      <div
        className='flex items-center gap-4 cursor-pointer'
        onClick={() => setIsOpen(true)}
      >
        <div className='w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-primary rounded-2xl'>
          {icon ? icon : <LuImage size={24} />}
        </div>
        <p className='ml-2'>{icon ? 'Change icon' : 'Pick icon'}</p>
      </div>

      {isOpen && (
        <div className='relative'>
          <button
            className='w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-2 -right-2 cursor-pointer'
            onClick={() => setIsOpen(false)}
          >
            <LuX size={18} />
          </button>
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              onSelect(emojiData.emoji);
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
