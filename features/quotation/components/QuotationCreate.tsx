"use client";

import { useEffect } from "react";
import { ErrorModal } from "@/components/common/ErrorModal";
import { QuotationForm } from "@/features/quotation/components/QuotationForm";
import type {
    Quotation,
    QuotationCreateRequest,
} from "@/features/quotation/types";
import { useCreateEntityForm } from "@/lib/hooks/useQueryForm";

interface QuotationCreateProps {
    projectId: string;
    open: boolean;
    onClose: () => void;
}

export const QuotationCreate = ({
    projectId,
    open,
    onClose,
}: QuotationCreateProps) => {
    const quotationsEndpoint = `/projects/${projectId}/quotations`;
    const {
        register,
        onSubmit,
        formState,
        isPending,
        errorResponse,
        clearErrorResponse,
        reset,
    } = useCreateEntityForm<QuotationCreateRequest, Quotation>(
        quotationsEndpoint,
        {
            formOptions: {
                defaultValues: {
                    description: "",
                    issuedAt: "",
                    validUntil: "",
                },
            },
            mutationOptions: {
                // 공통 생성 훅이 견적 목록 캐시를 갱신하므로 모달만 닫습니다.
                onSuccessCallback: () => {
                    reset();
                    onClose();
                },
            },
        }
    );

    useEffect(() => {
        if (!open) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isPending && !errorResponse) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [open, isPending, errorResponse, onClose]);

    if (!open) return null;

    const closeModal = () => {
        if (isPending) return;
        clearErrorResponse();
        reset();
        onClose();
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quotation-create-title"
            className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
            <button
                type="button"
                aria-label="견적 생성 모달 닫기"
                onClick={closeModal}
                className="absolute inset-0 h-full w-full bg-black/40"
            />

            <section className="relative my-auto w-full max-w-2xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
                    <div>
                        <h1
                            id="quotation-create-title"
                            className="text-xl font-bold text-gray-900">
                            견적 생성
                        </h1>
                        <p className="mt-1 text-xs text-gray-500">
                            새 리비전은 작성 중 상태로 생성됩니다.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={closeModal}
                        disabled={isPending}
                        aria-label="견적 생성 모달 닫기"
                        className="rounded-md p-1.5 text-xl leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">
                        ×
                    </button>
                </header>

                <div className="p-5 sm:p-6">
                    <QuotationForm
                        register={register}
                        errors={formState.errors}
                        onSubmit={onSubmit}
                        isPending={isPending}
                        onCancel={closeModal}
                    />
                </div>
            </section>

            <ErrorModal
                open={!!errorResponse}
                message={errorResponse?.message}
                status={errorResponse?.status}
                onClose={clearErrorResponse}
            />
        </div>
    );
};
