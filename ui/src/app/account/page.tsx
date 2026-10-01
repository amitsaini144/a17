import type { Metadata } from "next"
import AccountOverview from "@/components/account/AccountOverview"

export const metadata: Metadata = { title: "Account - A17" }

export default function AccountPage() {
    return <AccountOverview />
}
