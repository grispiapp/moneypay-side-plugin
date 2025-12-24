import type { FC } from "react"
import type { MoneyPayTransaction } from "@/types/moneypay.type"
import { Badge } from "@/components/ui/badge"
import { TransactionDetailRow } from "./transaction-detail-row"

interface TransactionListItemProps {
    transaction: MoneyPayTransaction
}

export const TransactionListItem: FC<TransactionListItemProps> = ({ transaction }) => {
    return (
        <div className="p-2.5 bg-white shadow-sm border-y">
            <div className="mb-2 pb-1.5 border-b border-gray-100">
                <div className="text-xs font-semibold text-gray-900 truncate">{transaction.tarih}</div>
                <div className="text-[10px] text-gray-500 truncate">{transaction.islemTuru || "-"}</div>
            </div>

            <div className="space-y-0.5">
                <TransactionDetailRow
                    label="Mağaza"
                    value={<span className="block truncate">{transaction.magaza || "-"}</span>}
                />
                <TransactionDetailRow label="Kasa" value={transaction.kasa || "-"} />
                <TransactionDetailRow
                    label="Kasiyer"
                    value={<span className="block truncate">{transaction.kasiyer || "-"}</span>}
                />
                <TransactionDetailRow label="Belge" value={transaction.belge || "-"} />
                <TransactionDetailRow label="Tutar" value={transaction.tutar ? `${transaction.tutar.toFixed(2)} ₺` : "-"} />
                {transaction.ref && (
                    <TransactionDetailRow
                        label="Ref"
                        value={<span className="truncate block max-w-[150px]">{transaction.ref}</span>}
                    />
                )}

                <div className="pt-1.5 mt-1.5 border-t border-gray-100 space-y-0.5">
                    <TransactionDetailRow
                        label="MoneyPay"
                        value={
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                {transaction.moneypayDurum || "-"}
                            </Badge>
                        }
                    />
                    <TransactionDetailRow
                        label="Kasa"
                        value={
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                {transaction.kasaDurum || "-"}
                            </Badge>
                        }
                    />
                    <TransactionDetailRow
                        label="DW"
                        value={
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                {transaction.dwDurum || "-"}
                            </Badge>
                        }
                    />
                </div>
            </div>
        </div>
    )
}
