import { render, screen, waitFor } from '@testing-library/react';
import NoteCard from './NoteCard';

describe('NoteCard Component', () => {
  it('renders note title, content and category', async () => {
    render(<NoteCard title="Test Note" content="This is a test" category="Development" />);

    await waitFor(() => {
      expect(screen.getByText('Test Note')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('This is a test')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Development')).toBeInTheDocument();
    });
  });
});
