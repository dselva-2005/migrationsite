export type ContactOfficeItem = {
    id: number
    country: string
    image: {
        url: string
        alt?: string
    }
    phone: {
        label: string
        href: string
    }
    email: {
        label: string
        href: string
    }
    address: string
}

export type ContactOfficesContent = {
    header: {
        eyebrow: string
        title: string
    }
    offices: ContactOfficeItem[]
    map: {
        url: string // 👈 normal Google Maps URL
    }
}
