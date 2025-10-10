import { observer } from "mobx-react-lite";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
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
import { TestModeBanner } from "@/components/test-mode-banner";
import { GetPaymentDetailsRequest, MoneyPayTransaction } from "@/types/moneypay.type";
import { getPaymentDetails } from "@/api/moneypay.api";
import { isApiError } from "@/types/api.type";

export const HomeScreen = observer(() => {
    const { bundle, loading } = useGrispi();
    const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
    const [transactions, setTransactions] = useState<MoneyPayTransaction[]>([]);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Initialize with last 90 days
    const getDefaultFilters = (): GetPaymentDetailsRequest => {
        const today = new Date();
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(today.getDate() - 90);

        return {
            startDate: ninetyDaysAgo.toISOString().split("T")[0],
            endDate: today.toISOString().split("T")[0],
            transactionType: "0",
            storeNumber: "",
            laneNumber: "",
            transactionNumber: "",
        };
    };

    const [filters, setFilters] = useState<GetPaymentDetailsRequest>(getDefaultFilters());

    // Fetch transactions when filters change
    const fetchTransactions = useCallback(async (filters: GetPaymentDetailsRequest) => {
        if (!bundle?.context.token) return

        // Önceki isteği iptal et
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Yeni AbortController oluştur
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setIsLoadingTransactions(true);
        setError(null);

        try {
            const response = await getPaymentDetails(filters, abortController.signal);

            // İstek iptal edildiyse, state'i güncelleme
            if (abortController.signal.aborted) {
                return;
            }

            if (isApiError(response)) {
                setError(response.data.error.description);
                setTransactions([]);
            } else {
                console.log({ response })
                setTransactions(response.data);
            }
        } catch (err) {
            // İstek iptal edildiyse, hatayı gösterme
            if (err instanceof Error && err.name === 'AbortError') {
                return;
            }

            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
            setTransactions([]);
        } finally {
            // İstek iptal edildiyse, loading state'ini güncelleme
            if (!abortController.signal.aborted) {
                setIsLoadingTransactions(false);
            }
        }
    }, [bundle?.context.token]);

    // Fetch transactions on mount and when filters change
    useEffect(() => {
        fetchTransactions(filters);

        // Cleanup: component unmount olduğunda veya filters değiştiğinde önceki isteği iptal et
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

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
                    {/* Test Mode Banner */}
                    <TestModeBanner />

                    {/* Filters Section */}
                    <div className="bg-white shadow-sm">
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-gray-800 text-md">
                                    Filtreler
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                                    className="w-8 h-8"
                                >
                                    {isFiltersExpanded ? (
                                        <ChevronUpIcon className="w-4 h-4" />
                                    ) : (
                                        <ChevronDownIcon className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="p-4">
                            <Filters
                                filters={filters}
                                onFiltersChange={setFilters}
                                showOnlyDateRange={!isFiltersExpanded}
                                onSubmit={() => fetchTransactions(filters)}
                            />
                        </div>
                    </div>

                    <div className="my-3">
                        {/* Loading State */}
                        {isLoadingTransactions && (
                            <div className="flex justify-center items-center py-8">
                                <div className="text-sm text-gray-500">Yükleniyor...</div>
                            </div>
                        )}

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
