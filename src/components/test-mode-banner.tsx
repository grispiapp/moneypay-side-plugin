import { FC } from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const TestModeBanner: FC = () => {
    return (
        <div className="p-4 bg-amber-50 border-amber-200 border-y">
            <div className="flex gap-3 items-start">
                <ExclamationTriangleIcon className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="mb-1 text-sm font-semibold text-amber-900">
                        Test Modu Aktif
                    </h3>
                    <p className="text-sm leading-relaxed text-amber-800">
                        Bu eklenti şu anda test aşamasındadır. Gösterilen işlem bilgilerinin
                        doğruluğunu lütfen kendi sistemlerinizden kontrol ediniz.
                    </p>
                </div>
            </div>
        </div>
    );
};
