import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FC } from "react";
import { GetPaymentDetailsRequest } from "@/types/moneypay.type";

interface FiltersProps {
	filters: GetPaymentDetailsRequest;
	onFiltersChange: (filters: GetPaymentDetailsRequest) => void;
	showOnlyDateRange?: boolean;
	onSubmit: () => void;
}

export const Filters: FC<FiltersProps> = ({
	filters,
	onFiltersChange,
	showOnlyDateRange = false,
	onSubmit,
}) => {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit();
	};

	const handleInputChange = (
		field: keyof GetPaymentDetailsRequest,
		value: string,
	) => onFiltersChange({ ...filters, [field]: value });

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			{/* Date Range Filter */}
			<div className="space-y-2">
				<div className="text-sm font-medium text-gray-700">Tarih Aralığı</div>
				<div className="flex gap-2">
					<div className="flex-1">
						<Input
							id="date-start"
							type="date"
							placeholder="Başlangıç"
							value={filters.startDate}
							onChange={(e) => handleInputChange("startDate", e.target.value)}
							className="w-full"
							aria-label="Başlangıç tarihi"
						/>
					</div>
					<div className="flex-1">
						<Input
							id="date-end"
							type="date"
							placeholder="Bitiş"
							value={filters.endDate}
							onChange={(e) => handleInputChange("endDate", e.target.value)}
							className="w-full"
							aria-label="Bitiş tarihi"
						/>
					</div>
				</div>
			</div>

			{/* Store Code Filter */}
			{!showOnlyDateRange && (
				<div className="space-y-2">
					<div className="text-sm font-medium text-gray-700">Mağaza Kodu</div>
					<Input
						type="text"
						placeholder="Mağaza kodu giriniz"
						value={filters.storeNumber}
						onChange={(e) => handleInputChange("storeNumber", e.target.value)}
						className="w-full"
					/>
				</div>
			)}

			{/* Cash Register Number Filter */}
			{!showOnlyDateRange && (
				<div className="space-y-2">
					<div className="text-sm font-medium text-gray-700">Kasa Numarası</div>
					<Input
						type="text"
						placeholder="Kasa numarası giriniz"
						value={filters.laneNumber}
						onChange={(e) =>
							handleInputChange("laneNumber", e.target.value)
						}
						className="w-full"
					/>
				</div>
			)}

			{/* Transaction Number Filter */}
			{!showOnlyDateRange && (
				<div className="space-y-2">
					<div className="text-sm font-medium text-gray-700">İşlem Numarası</div>
					<Input
						type="text"
						placeholder="İşlem numarası giriniz"
						value={filters.transactionNumber}
						onChange={(e) =>
							handleInputChange("transactionNumber", e.target.value)
						}
						className="w-full"
					/>
				</div>
			)}

			{/* Filter Actions */}
			{!showOnlyDateRange && (
				<div className="flex gap-2 pt-2">
					<Button
						variant="outline"
						className="flex-1"
						onClick={() => {
							const today = new Date();
							const ninetyDaysAgo = new Date();
							ninetyDaysAgo.setDate(today.getDate() - 90);

							onFiltersChange({
								...filters,
								startDate: ninetyDaysAgo.toISOString().split("T")[0],
								endDate: today.toISOString().split("T")[0],
							});
						}}
					>
						Temizle
					</Button>
					<Button
						className="flex-1"
						type="submit"
					>
						Uygula
					</Button>
				</div>
			)}
		</form>
	);
};
