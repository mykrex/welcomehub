const React = require('react');

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    entries: jest.fn(),
    forEach: jest.fn(),
    toString: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useParams: jest.fn(() => ({})),
}));

// Mock next/image component
jest.mock('next/image', () => {
  return function MockImage(props) {
    return React.createElement('img', props);
  };
});

// Mock next/link component
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }) {
    return React.createElement('a', { href, ...props }, children);
  };
});

// Mock next/head component
jest.mock('next/head', () => {
  return function MockHead({ children }) {
    return children;
  };
});