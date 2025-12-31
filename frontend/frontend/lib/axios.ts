import axios, {
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined")
}

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

const refreshApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

let isRefreshing = false

let queue: {
    resolve: () => void
    reject: (err: unknown) => void
}[] = []

const processQueue = (error?: unknown) => {
    queue.forEach(({ resolve, reject }) => {
        if (error) reject(error)
        else resolve()
    })
    queue = []
}

api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as
            | (InternalAxiosRequestConfig & { _retry?: boolean })
            | undefined

        const status = error.response?.status
        const url = originalRequest?.url ?? ""

        // ⛔ never retry refresh itself
        if (
            status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            url.includes("/api/auth/refresh")
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

            // 🔑 ONLY redirect if this was NOT /me
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
