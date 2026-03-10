// lib/serverApi.ts
import axios from 'axios'

// Don't validate at module level, do it in the function
export const getServerApi = () => {
    const API_INTERNAL_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL
    
    if (!API_INTERNAL_URL) {
        throw new Error('API_INTERNAL_URL or NEXT_PUBLIC_API_BASE_URL must be defined')
    }

    return axios.create({
        baseURL: API_INTERNAL_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}