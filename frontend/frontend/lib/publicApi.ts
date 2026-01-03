import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined")
}

const publicApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

export default publicApi
