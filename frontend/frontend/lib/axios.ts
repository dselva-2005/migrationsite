import axios from "axios"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
})

let isRefreshing = false
let queue: (() => void)[] = []

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true

            if (isRefreshing) {
                return new Promise((resolve) => {
                    queue.push(() => resolve(api(originalRequest)))
                })
            }

            isRefreshing = true

            try {
                await api.post("/api/auth/refresh/")
                queue.forEach((cb) => cb())
                queue = []
                return api(originalRequest)
            } catch {
                queue = []
                window.location.href = "/login"
                return Promise.reject(error)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default api
