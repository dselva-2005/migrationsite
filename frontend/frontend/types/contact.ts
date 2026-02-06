export type ContactListItem = {
    label: string
    value: string
    href?: string
}

export type ContactQuickContactItem =
    | {
        id: string
        title: string
        icon: {
            url: string
            alt?: string
        }
        content_type: "text"
        content: string
    }
    | {
        id: string
        title: string
        icon: {
            url: string
            alt?: string
        }
        content_type: "list"
        content: ContactListItem[]
    }

export type ContactQuickContactContent = {
    left: {
        section_title: string
        heading: string
        description: string
        items: ContactQuickContactItem[]
    }
    right: {
        section_title: string
        heading: string
        description: string
        form: {
            endpoint: string
            method: "POST" | "GET"
            submit_label: string
            fields: {
                name: string
                label: string
                type: string
                required?: boolean
                max_length?: number
            }[]
        }
    }
}
