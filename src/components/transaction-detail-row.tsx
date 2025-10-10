import { FC, ReactNode } from "react";

interface TransactionDetailRowProps {
    label: string;
    value: ReactNode;
}

export const TransactionDetailRow: FC<TransactionDetailRowProps> = ({
    label,
    value,
}) => {
    return (
        <div className="flex justify-between items-center py-1">
            <span className="text-sm text-gray-500">{label}:</span>
            <div className="text-sm font-medium">{value}</div>
        </div>
    );
};

