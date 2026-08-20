"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { QuotationCreateRequest } from "@/features/quotation/types";

interface QuotationFormProps {
    register: UseFormRegister<QuotationCreateRequest>;
    errors: FieldErrors<QuotationCreateRequest>;
    onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
    isPending: boolean;
    onCancel: () => void;
}

const inputClassName =
    "w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black";

// 선택 입력의 빈 문자열은 요청 body에서 제외합니다.
const optionalValue = (value: string) => (value === "" ? undefined : value);

export const QuotationForm = ({
    register,
    errors,
    onSubmit,
    isPending,
    onCancel,
}: QuotationFormProps) => {
    const fieldClassName = (hasError: boolean) =>
        `${inputClassName} ${
            hasError
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : ""
        }`;

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
            <div>
                <label
                    htmlFor="quotation-amount"
                    className="mb-1.5 block text-sm font-medium text-gray-700">
                    견적 금액 <span className="text-red-500">*</span>
                </label>
                <input
                    id="quotation-amount"
                    type="number"
                    min={0}
                    step="any"
                    inputMode="decimal"
                    placeholder="0"
                    aria-invalid={!!errors.amount}
                    className={`${fieldClassName(!!errors.amount)} h-10`}
                    {...register("amount", {
                        required: "견적 금액은 필수입니다.",
                        valueAsNumber: true,
                        min: {
                            value: 0,
                            message: "견적 금액은 0 이상이어야 합니다.",
                        },
                        validate: (value) =>
                            Number.isFinite(value) ||
                            "올바른 견적 금액을 입력해주세요.",
                    })}
                />
                {errors.amount?.message && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.amount.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="quotation-description"
                    className="mb-1.5 block text-sm font-medium text-gray-700">
                    설명
                </label>
                <textarea
                    id="quotation-description"
                    rows={5}
                    maxLength={2048}
                    placeholder="견적에 대한 설명을 입력해주세요."
                    aria-invalid={!!errors.description}
                    className={`${fieldClassName(
                        !!errors.description
                    )} resize-y py-2.5`}
                    {...register("description", {
                        maxLength: {
                            value: 2048,
                            message: "설명은 2048자 이하로 입력해주세요.",
                        },
                        setValueAs: optionalValue,
                    })}
                />
                {errors.description?.message && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="quotation-issued-at"
                        className="mb-1.5 block text-sm font-medium text-gray-700">
                        발행일
                    </label>
                    <input
                        id="quotation-issued-at"
                        type="date"
                        aria-invalid={!!errors.issuedAt}
                        className={`${fieldClassName(!!errors.issuedAt)} h-10`}
                        {...register("issuedAt", {
                            setValueAs: optionalValue,
                        })}
                    />
                    {errors.issuedAt?.message && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.issuedAt.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="quotation-valid-until"
                        className="mb-1.5 block text-sm font-medium text-gray-700">
                        유효기간
                    </label>
                    <input
                        id="quotation-valid-until"
                        type="date"
                        aria-invalid={!!errors.validUntil}
                        className={`${fieldClassName(
                            !!errors.validUntil
                        )} h-10`}
                        {...register("validUntil", {
                            setValueAs: optionalValue,
                        })}
                    />
                    {errors.validUntil?.message && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.validUntil.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                    className="h-10 rounded-md border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                    취소
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="h-10 rounded-md bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50">
                    {isPending ? "생성 중..." : "생성하기"}
                </button>
            </div>
        </form>
    );
};
