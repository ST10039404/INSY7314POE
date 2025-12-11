import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders the navbar logo', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
});