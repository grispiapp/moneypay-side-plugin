import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FC } from "react";
import { GetPaymentDetailsRequest } from "@/types/moneypay.type";

interface FiltersProps {
	loading: boolean;
	filters: GetPaymentDetailsRequest;
	onFiltersChange: (filters: GetPaymentDetailsRequest) => void;
	onSubmit: () => void;
}

export const Filters: FC<FiltersProps> = ({
	loading,
	filters,
	onFiltersChange,
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
		<form className="space-y-2" onSubmit={handleSubmit}>
			<div className="flex gap-2 items-center">
				<div className="space-y-0.5">
					<div className="text-xs font-medium text-gray-700">Mağaza Kodu</div>
					<Input
						type="text"
						placeholder="Mağaza kodu giriniz"
						value={filters.storeNumber}
						onChange={(e) => handleInputChange("storeNumber", e.target.value)}
						className="w-full"
						disabled={loading}
						aria-label="Mağaza kodu"
					/>
				</div>

				<div className="space-y-0.5">
					<div className="text-xs font-medium text-gray-700">İşlem Numarası</div>
					<Input
						type="text"
						placeholder="İşlem numarası giriniz"
						value={filters.migrosTransactionId}
						onChange={(e) =>
							handleInputChange("migrosTransactionId", e.target.value)
						}
						className="w-full"
						disabled={loading}
						aria-label="İşlem numarası"
					/>
				</div>
			</div>

			<div className="flex gap-2 justify-between items-end">
				<div className="space-y-0.5 flex-1">
					<Input
						id="date-start"
						type="date"
						placeholder="İşlem tarihi"
						value={filters.startDate}
						onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value, endDate: e.target.value })}
						className="w-full"
						aria-label="Başlangıç tarihi"
						disabled={loading}
					/>
				</div>

				<Button type="submit" size="sm" disabled={loading}>Uygula</Button>
			</div>
		</form>
	);
};
