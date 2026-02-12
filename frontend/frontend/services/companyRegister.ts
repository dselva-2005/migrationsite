import api from "@/lib/axios"

export interface RegisterBusinessPayload {
    company_name: string
    website: string
    email: string
    phone_number: string
    message: string
}

export const registerBusiness = async (
    payload: RegisterBusinessPayload
) => {
    const response = await api.post(
        "/api/company/suggest-company/",
        payload
    )

    return response.data
}
