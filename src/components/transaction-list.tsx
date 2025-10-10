import { FC } from 'react';
import { MoneyPayTransaction } from '@/types/moneypay.type';
import { TransactionListItem } from './transaction-list-item';

interface TransactionListProps {
    transactions: MoneyPayTransaction[];
}

export const TransactionList: FC<TransactionListProps> = ({ transactions }) => {
    if (transactions.length === 0) {
        return (
            <div className="py-8 text-center text-gray-500">
                <p>Henüz işlem bulunmamaktadır</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {transactions.map((transaction, index) => (
                <TransactionListItem
                    key={transaction.ref || `transaction-${index}`}
                    transaction={transaction}
                />
            ))}
        </div>
    );
};
