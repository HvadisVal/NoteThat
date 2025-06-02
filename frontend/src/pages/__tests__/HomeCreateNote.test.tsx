import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../Home';

// Mock localStorage
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: () => 'mock-token',
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });

  //  Mock fetch
  global.fetch = jest.fn((url: any, options: any) => {
    if (url.toString().includes('/notes') && options?.method === 'POST') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          _id: 'abc123',
          title: 'Test Note Title',
          content: 'Test Note Content',
          category: 'Test',
          color: 'bg-blue-400',
          tags: ['tag1'],
          pinned: false,
          timestamp: new Date().toISOString()
        }),
      });
    }

    if (url.toString().includes('/notes')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    }

    if (url.toString().includes('/tasks')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]), // or dummy tasks
        });
      }

    return Promise.reject(new Error('Unknown fetch call'));
  }) as jest.Mock;
});

test('creates a note using the modal', async () => {
  render(<Home />);

const newNoteBtn = await screen.findByText((content) =>
  content.includes('New Note')
);
  fireEvent.click(newNoteBtn);

  fireEvent.change(screen.getByPlaceholderText('📌 Title'), {
    target: { value: 'Test Note Title' },
  });

  fireEvent.change(screen.getByPlaceholderText('📝 Content'), {
    target: { value: 'Test Note Content' },
  });

  const selects = screen.getAllByRole('combobox');
  fireEvent.change(selects[0], { target: { value: 'Personal' } }); // existing option
  

  fireEvent.change(screen.getByPlaceholderText('🏷️ Tags (comma separated)'), {
    target: { value: 'tag1' },
  });

  fireEvent.click(screen.getByText('Save'));

  expect(await screen.findByText('Test Note Title')).toBeInTheDocument();
  expect(await screen.findByText('Test Note Content')).toBeInTheDocument();
});
