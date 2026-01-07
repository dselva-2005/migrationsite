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

const isMeEndpoint = (url = "") =>
    url.includes("/api/auth/me")

api.interceptors.response.use(
    response => response,

    async (error: AxiosError) => {
        const originalRequest =
            error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        const status = error.response?.status
        const url = originalRequest?.url ?? ""

        if (status === 401 && isMeEndpoint(url)) {
            return Promise.resolve({ data: null })
        }

        if (status === 401 && url.includes("/api/auth/refresh")) {
            if (typeof window !== "undefined") {
                window.location.href = "/login"
            }
            return Promise.resolve({ data: null })
        }

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

            if (
                typeof window !== "undefined" &&
                !isMeEndpoint(url)
            ) {
                window.location.href = "/login"
            }

            return Promise.resolve({ data: null })
        } finally {
            isRefreshing = false
        }
    }
)

export default api
