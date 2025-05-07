import { http } from 'msw'

export const handlers = [
  http.post('http://mock-api.local/api/dashboard/auth/login', ({ request }) => {
    console.log('MSW intercepted login request!')

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          token: 'mock-token-12345',
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com'
          }
        }
      })
    )
  }),
  // 다른 API 엔드포인트도 필요하다면 여기에 추가
]