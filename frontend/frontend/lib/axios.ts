import axios, {
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

const refreshApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

let isRefreshing = false

type QueueItem = {
    resolve: () => void
    reject: (err: unknown) => void
}

let queue: QueueItem[] = []

const processQueue = (error?: unknown) => {
    queue.forEach(({ resolve, reject }) => {
        error ? reject(error) : resolve()
    })
    queue = []
}

const isAuthEndpoint = (url = "") =>
    url.includes("/api/auth/login") ||
    url.includes("/api/auth/refresh") ||
    url.includes("/api/auth/forgot-password") ||
    url.includes("/api/auth/reset-password")

api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest =
            error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        const status = error.response?.status
        const url = originalRequest?.url ?? ""

        // 🚫 Never refresh in these cases
        if (
            status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            isAuthEndpoint(url)
        ) {
            return Promise.reject(error)
        }

        originalRequest._retry = true

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                queue.push({
                    resolve: () => resolve(api(originalRequest)),
                    reject,
                })
            })
        }

        isRefreshing = true

        try {
            await refreshApi.post("/api/auth/refresh/")
            processQueue()
            return api(originalRequest)
        } catch (err) {
            processQueue(err)

            // ❗ only redirect for protected routes
            if (
                typeof window !== "undefined" &&
                !url.includes("/api/auth/me")
            ) {
                window.location.href = "/login"
            }

            return Promise.reject(err)
        } finally {
            isRefreshing = false
        }
    }
)

export default api
