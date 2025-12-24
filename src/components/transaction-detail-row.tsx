import type { FC, ReactNode } from "react"

interface TransactionDetailRowProps {
    label: string
    value: ReactNode
}

export const TransactionDetailRow: FC<TransactionDetailRowProps> = ({ label, value }) => {
    return (
        <div className="flex justify-between items-start gap-2 py-0.5">
            <span className="text-xs text-gray-500 shrink-0">{label}:</span>
            <div className="min-w-0 text-xs font-medium text-right break-words">{value}</div>
        </div>
    )
}
