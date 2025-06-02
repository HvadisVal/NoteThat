// src/pages/__tests__/Home.test.tsx

import { render, screen } from '@testing-library/react';
import Home from '../Home';
import userEvent from '@testing-library/user-event';

//  Mock localStorage before each test to simulate a logged-in user
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
});

//  Test: clicking "+ New Note" should open the modal
test('opens modal when clicking + New Note', async () => {
  render(<Home />);

  //  Wait for the "+ New Note" button to show up
  const newNoteBtn = await screen.findByText(/New Note/i);
  expect(newNoteBtn).toBeInTheDocument(); // Confirm it's in the DOM

  //  Simulate a user clicking the button
  await userEvent.click(newNoteBtn);

  //  Check that the modal appears with "Create New Note" text
  expect(await screen.findByText(/Create New Note/i)).toBeInTheDocument();
});

