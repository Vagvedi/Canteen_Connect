import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import NavBar from './NavBar';
import { useAuthStore } from '../state/store';

describe('NavBar', () => {
  it('shows login when not authenticated', () => {
    useAuthStore.setState({ user: null, token: null });
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    expect(screen.getByText(/Login/)).toBeInTheDocument();
  });
});

