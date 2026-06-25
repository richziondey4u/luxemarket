import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'

import { ThemeProvider }    from './context/ThemeContext.jsx'
import { AuthProvider }     from './context/AuthContext.jsx'
import { CartProvider }     from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import AppRouter            from './router/AppRouter.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime:    1000 * 60 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <AppRouter />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '12px',
                      fontFamily: 'DM Sans, sans-serif',
                    },
                    success: { iconTheme: { primary: 'var(--brand)', secondary: 'var(--bg-page)' } },
                    error:   { iconTheme: { primary: '#ef4444',      secondary: 'var(--bg-page)' } },
                  }}
                />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)