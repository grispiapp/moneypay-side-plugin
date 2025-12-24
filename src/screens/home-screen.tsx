import { observer } from "mobx-react-lite";
import { useState, useCallback, useRef } from "react";

import {
    Screen,
    ScreenContent,
    ScreenHeader,
    ScreenTitle,
} from "@/components/ui/screen";
import { useGrispi } from "@/contexts/grispi-context";
import { LoadingScreen } from "./loading-screen";
import { Filters } from "@/components/filters";
import { TransactionList } from "@/components/transaction-list";
import { GetPaymentDetailsRequest, MoneyPayTransaction } from "@/types/moneypay.type";
import { getPaymentDetails } from "@/api/moneypay.api";
import { isApiError } from "@/types/api.type";
import { LoadingWrapper } from "@/components/loading-wrapper";

export const HomeScreen = observer(() => {
    const { bundle, loading } = useGrispi();
    const [transactions, setTransactions] = useState<MoneyPayTransaction[]>([]);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Initialize with last 90 days
    const getDefaultFilters = (): GetPaymentDetailsRequest => {
        const today = new Date().toISOString().split("T")[0];

        return {
            startDate: today,
            endDate: today,
            transactionType: "0",
            storeNumber: "",
            laneNumber: "",
            transactionNumber: "",
        };
    };

    const [filters, setFilters] = useState<GetPaymentDetailsRequest>(getDefaultFilters());

    // Fetch transactions when filters change
    const fetchTransactions = useCallback(async () => {
        if (!bundle?.context.token) return

        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new AbortController
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setIsLoadingTransactions(true);
        setError(null);

        if (!filters.storeNumber || !filters.transactionNumber) {
            setError("Mağaza kodu ve işlem numarası gereklidir.");
            setTransactions([]);
            setIsLoadingTransactions(false);
            return;
        }

        const payload: GetPaymentDetailsRequest = {
            ...filters,
            transactionNumber: filters.transactionNumber ? `${filters.storeNumber}m${filters.transactionNumber}` : undefined
        }

        try {
            const response = await getPaymentDetails(payload, abortController.signal);

            // If request was cancelled, don't update state
            if (abortController.signal.aborted) {
                return;
            }

            if (isApiError(response)) {
                const errorMessage = typeof response.data.error === 'string'
                    ? response.data.error
                    : response.data.error.description;

                setError(errorMessage);
                setTransactions([]);
            } else {
                setTransactions(response.data);
            }
        } catch (err) {
            // If request was cancelled, don't show error
            if (err instanceof Error && err.name === 'AbortError') {
                return;
            }

            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
            setTransactions([]);
        } finally {
            // If request was cancelled, don't update loading state
            if (!abortController.signal.aborted) {
                setIsLoadingTransactions(false);
            }
        }
    }, [bundle?.context.token, filters]);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Screen>
            <ScreenHeader>
                <ScreenTitle>MoneyPay Mutabakat Ekranı</ScreenTitle>
            </ScreenHeader>
            <ScreenContent>
                <div className="flex flex-col">
                    {/* Filters Section */}
                    <div className="p-3 space-y-2 bg-white shadow-sm">
                        <Filters
                            loading={isLoadingTransactions}
                            filters={filters}
                            onFiltersChange={setFilters}
                            onSubmit={fetchTransactions}
                        />
                    </div>

                    <div className="my-3">
                        {/* Loading State */}
                        {isLoadingTransactions && <LoadingWrapper />}

                        {/* Error State */}
                        {error && !isLoadingTransactions && (
                            <div className="p-4 m-4 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex gap-2 items-start">
                                    <div className="text-sm text-red-600">
                                        <strong>Hata:</strong> {error}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transactions List */}
                        {!isLoadingTransactions && !error && (
                            <TransactionList transactions={transactions} />
                        )}
                    </div>
                </div>
            </ScreenContent>
        </Screen>
    );
});
