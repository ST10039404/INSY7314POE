import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders the navbar logo', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
});

//maybe test the input output login xyz?