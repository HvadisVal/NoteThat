import React from 'react';

interface Props {
  title: string;
  content: string;
  category: string;
}

const NoteCard: React.FC<Props> = ({ title, content, category }) => {
  return (
    <div className="p-4 border rounded">
      <h3>{title}</h3>
      <p>{content}</p>
      <span>{category}</span>
    </div>
  );
};

export default NoteCard;
