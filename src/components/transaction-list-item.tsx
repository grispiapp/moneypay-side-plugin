import { FC } from 'react';
import { MoneyPayTransaction } from '@/types/moneypay.type';
import { Badge } from '@/components/ui/badge';
import { TransactionDetailRow } from './transaction-detail-row';

interface TransactionListItemProps {
    transaction: MoneyPayTransaction;
}

export const TransactionListItem: FC<TransactionListItemProps> = ({ transaction }) => {
    return (
        <div className="p-4 bg-white shadow-sm border-y">
            {/* Header Row - Date/Time and Transaction Type */}
            <div className="mb-3 text-sm font-medium text-gray-900">
                <div>{transaction.tarih}</div>
                <div className="text-xs">{transaction.islemTuru || '-'}</div>
            </div>

            {/* Transaction Details - Vertical List */}
            <div>
                <TransactionDetailRow
                    label="Mağaza"
                    value={transaction.magaza || '-'}
                />
                <TransactionDetailRow
                    label="Kasa"
                    value={transaction.kasa || '-'}
                />
                <TransactionDetailRow
                    label="Kasiyer"
                    value={transaction.kasiyer || '-'}
                />
                <TransactionDetailRow
                    label="Belge"
                    value={transaction.belge || '-'}
                />
                <TransactionDetailRow
                    label="Tutar"
                    value={transaction.tutar ? `${transaction.tutar.toFixed(2)} ₺` : '-'}
                />
                {transaction.ref && (
                    <TransactionDetailRow
                        label="Ref"
                        value={transaction.ref}
                    />
                )}

                {/* Status Rows */}
                <TransactionDetailRow
                    label="MoneyPay"
                    value={<Badge variant="outline">{transaction.moneypayDurum || '-'}</Badge>}
                />
                <TransactionDetailRow
                    label="Kasa Durumu"
                    value={<Badge variant="outline">{transaction.kasaDurum || '-'}</Badge>}
                />
                <TransactionDetailRow
                    label="DW Durumu"
                    value={<Badge variant="outline">{transaction.dwDurum || '-'}</Badge>}
                />
            </div>
        </div>
    );
};

