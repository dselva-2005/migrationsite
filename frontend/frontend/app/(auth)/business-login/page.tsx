"use client"

import { useState, useEffect, FormEvent } from "react"
import axios from "axios"
import { Check, ChevronsUpDown } from "lucide-react"

import api from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

/* ---------------- Types ---------------- */

type Company = {
    id: string
    name: string
}

/* ---------------- Constants ---------------- */

const NEW_COMPANY_VALUE = "NEW_COMPANY"

/* ---------------- Component ---------------- */

export default function BusinessLoginForm() {
    /* Business user */
    const [fullName, setFullName] = useState("")
    const [countryCode, setCountryCode] = useState("+91")
    const [phone, setPhone] = useState("")
    const [role, setRole] = useState<"OWNER" | "MANAGER" | "">("")

    /* Companies */
    const [companies, setCompanies] = useState<Company[]>([])
    const [companiesLoading, setCompaniesLoading] = useState(false)

    /* Company selection */
    const [selectedCompany, setSelectedCompany] = useState("")
    const isNewCompany = selectedCompany === NEW_COMPANY_VALUE
    const [companyPopoverOpen, setCompanyPopoverOpen] = useState(false)

    /* New company core */
    const [companyName, setCompanyName] = useState("")
    const [tagline, setTagline] = useState("")
    const [description, setDescription] = useState("")
    const [website, setWebsite] = useState("")

    /* Company address snapshot */
    const [addressLine1, setAddressLine1] = useState("")
    const [addressLine2, setAddressLine2] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [country, setCountry] = useState("")
    const [companyEmail, setCompanyEmail] = useState("")
    const [companyPhone, setCompanyPhone] = useState("")

    /* UI */
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    /* ---------------- Fetch Companies ---------------- */

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setCompaniesLoading(true)
                const res = await api.get("/api/company/list/")
                setCompanies(res.data)
            } catch {
                setError("Unable to load companies")
            } finally {
                setCompaniesLoading(false)
            }
        }

        fetchCompanies()
    }, [])

    /* ---------------- Validation ---------------- */

    const validate = (): boolean => {
        setError(null)

        if (!fullName.trim()) return setError("Full name is required"), false
        if (!phone.match(/^\d{7,15}$/))
            return setError("Enter a valid phone number"), false
        if (!role) return setError("Select your business role"), false
        if (!selectedCompany) return setError("Select a company"), false

        if (isNewCompany) {
            if (!companyName.trim())
                return setError("Company name is required"), false
            if (!addressLine1.trim())
                return setError("Address line 1 is required"), false
            if (!city.trim()) return setError("City is required"), false
            if (!country.trim())
                return setError("Country is required"), false
        }

        return true
    }

    /* ---------------- Submit ---------------- */

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)

        try {
            await api.post("/api/company/business-login/", {
                full_name: fullName,
                phone: `${countryCode}${phone}`,
                role,

                request_type: isNewCompany ? "NEW" : "EXISTING",
                company_id: !isNewCompany ? selectedCompany : null,

                company_name: isNewCompany ? companyName : "",
                tagline: isNewCompany ? tagline : "",
                description: isNewCompany ? description : "",
                website: isNewCompany ? website : "",

                address_line_1: isNewCompany ? addressLine1 : "",
                address_line_2: isNewCompany ? addressLine2 : "",
                city: isNewCompany ? city : "",
                state: isNewCompany ? state : "",
                postal_code: isNewCompany ? postalCode : "",
                country: isNewCompany ? country : "",
                email: isNewCompany ? companyEmail : "",
                phone_number: isNewCompany ? companyPhone : "",
            })

            setSubmitted(true)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.detail ??
                    "Failed to submit onboarding request"
                )
            } else {
                setError("Something went wrong")
            }
        } finally {
            setLoading(false)
        }
    }

    /* ---------------- UI ---------------- */

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="mx-auto w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Business Onboarding</CardTitle>
                    <CardDescription>
                        Verify your identity and associate your company
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {submitted ? (
                        <CardDescription className="text-center py-10 text-green-600">
                            🎉 Your onboarding request has been submitted
                        </CardDescription>
                    ) : (
                        <form onSubmit={onSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <Label>Full Name</Label>
                                <Input
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <Label>Mobile Number</Label>
                                <div className="flex gap-2">
                                    <Input
                                        className="w-24"
                                        value={countryCode}
                                        onChange={(e) =>
                                            setCountryCode(e.target.value)
                                        }
                                    />
                                    <Input
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <Label>Business Role</Label>
                                <Select
                                    value={role}
                                    onValueChange={(v) =>
                                        setRole(v as "OWNER" | "MANAGER")
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="OWNER">
                                            Company Owner
                                        </SelectItem>
                                        <SelectItem value="MANAGER">
                                            Company Manager
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Company selector */}
                            <div>
                                <Label>Company</Label>
                                <Popover
                                    open={companyPopoverOpen}
                                    onOpenChange={setCompanyPopoverOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {isNewCompany
                                                ? "Add new company"
                                                : companies.find(
                                                    (c) =>
                                                        c.id ===
                                                        selectedCompany
                                                )?.name ??
                                                "Select company"}
                                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="p-0">
                                        <Command>
                                            <CommandInput placeholder="Search company..." />
                                            <CommandEmpty>
                                                No company found
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {companies.map((c) => (
                                                    <CommandItem
                                                        key={c.id}
                                                        onSelect={() => {
                                                            setSelectedCompany(
                                                                c.id
                                                            )
                                                            setCompanyPopoverOpen(
                                                                false
                                                            )
                                                        }}
                                                    >
                                                        <Check
                                                            className={`mr-2 h-4 w-4 ${selectedCompany ===
                                                                    c.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                                }`}
                                                        />
                                                        {c.name}
                                                    </CommandItem>
                                                ))}
                                                <CommandItem
                                                    onSelect={() => {
                                                        setSelectedCompany(
                                                            NEW_COMPANY_VALUE
                                                        )
                                                        setCompanyPopoverOpen(
                                                            false
                                                        )
                                                    }}
                                                >
                                                    + My company is not listed
                                                </CommandItem>
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* New company fields */}
                            {isNewCompany && (
                                <>
                                    <Input
                                        placeholder="Company name"
                                        value={companyName}
                                        onChange={(e) =>
                                            setCompanyName(e.target.value)
                                        }
                                    />
                                    <Input
                                        placeholder="Tagline"
                                        value={tagline}
                                        onChange={(e) =>
                                            setTagline(e.target.value)
                                        }
                                    />
                                    <Textarea
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    />
                                    <Input
                                        placeholder="Website"
                                        value={website}
                                        onChange={(e) =>
                                            setWebsite(e.target.value)
                                        }
                                    />

                                    <CardDescription>
                                        Company Address
                                    </CardDescription>

                                    <Input
                                        placeholder="Address line 1"
                                        value={addressLine1}
                                        onChange={(e) =>
                                            setAddressLine1(e.target.value)
                                        }
                                    />
                                    <Input
                                        placeholder="Address line 2"
                                        value={addressLine2}
                                        onChange={(e) =>
                                            setAddressLine2(e.target.value)
                                        }
                                    />
                                    <Input
                                        placeholder="City"
                                        value={city}
                                        onChange={(e) =>
                                            setCity(e.target.value)
                                        }
                                    />
                                    <Input
                                        placeholder="State"
                                        value={state}
                                        onChange={(e) =>
                                            setState(e.target.value)
                                        }
                                    />
                                    <Input
                                        placeholder="Postal code"
                                        value={postalCode}
                                        onChange={(e) =>
                                            setPostalCode(e.target.value)
                                        }
                                    />
                                    <Input
                                        placeholder="Country"
                                        value={country}
                                        onChange={(e) =>
                                            setCountry(e.target.value)
                                        }
                                    />
                                    <Input
                                        placeholder="Company email"
                                        value={companyEmail}
                                        onChange={(e) =>
                                            setCompanyEmail(e.target.value)
                                        }
                                    />
                                    <Input
                                        placeholder="Company phone"
                                        value={companyPhone}
                                        onChange={(e) =>
                                            setCompanyPhone(e.target.value)
                                        }
                                    />
                                </>
                            )}

                            {error && (
                                <CardDescription className="text-red-600">
                                    {error}
                                </CardDescription>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Continue"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
