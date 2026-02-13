import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

const publicApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

export default publicApi
