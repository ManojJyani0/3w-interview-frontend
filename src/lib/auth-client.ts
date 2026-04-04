import { createAuthClient } from 'better-auth/react'


export const authClient = createAuthClient({
    baseURL: 'https://threew-interview-backend.onrender.com/',
    basePath:'/api/auth/'
})
