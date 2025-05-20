// __mocks__/@/lib/supabase.server.ts

export const supabase = {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
          order: jest.fn(() => ({
            limit: jest.fn().mockResolvedValue({ data: null, error: null })
          })),
          neq: jest.fn(() => ({
            select: jest.fn(() => ({
              not: jest.fn(() => ({
                ilike: jest.fn(() => ({
                  not: jest.fn(() => ({
                    in: jest.fn(() => ({
                      select: jest.fn()
                    }))
                  }))
                }))
              }))
            }))
          }))
        }))
      })),
      insert: jest.fn().mockResolvedValue({ error: null })
    }))
  };
  