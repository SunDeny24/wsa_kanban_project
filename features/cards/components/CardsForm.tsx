"use client";

import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { type CardCreateRequest } from "@/features/cards/types";
import { priorityLabel, supportTypeLabel } from "@/features/cards/constants";

interface CardsFormProps {
    register: UseFormRegister<CardCreateRequest>;
    errors: FieldErrors<CardCreateRequest>;
    onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
    isPending: boolean;
    onCancel: () => void;
    submitLabel?: string;
    pendingLabel?: string;
}

const inputClassName =
    "w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black";

// 선택 입력의 빈 문자열은 요청 body에서 undefined로 처리합니다.
const optionalValue = (value: string) => (value === "" ? undefined : value);

export const CardsForm = ({
    register,
    errors,
    onSubmit,
    isPending,
    onCancel,
    submitLabel = "생성하기",
    pendingLabel = "생성 중...",
}: CardsFormProps) => {
    // 에러 있는 경우 폼필드 스타일 수정
    const fieldClassName = (hasError: boolean) =>
        `${inputClassName} ${hasError ? "border-red-400 focus:border-red-500 focus:ring-red-500" : ""}`;

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
            {/* 제목 */}
            <div>
                <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-gray-700">
                    제목 <span className="text-red-500">*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    maxLength={200}
                    placeholder={"제목을 입력해주세요."}
                    aria-invalid={!!errors.title}
                    className={`${fieldClassName(!!errors.title)} h-10`}
                    {...register("title", {
                        required: "제목은 필수입니다.",
                        maxLength: {
                            value: 200,
                            message: "제목은 200자 이하로 입력해주세요.",
                        },
                    })}
                />
                {errors.title?.message && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* 상세 설명 */}
            <div>
                <label
                    htmlFor="description"
                    className="mb-1.5 block text-sm font-medium text-gray-700">
                    상세 설명
                </label>
                <textarea
                    id="description"
                    rows={5}
                    maxLength={4096}
                    placeholder={
                        "상세 설명을 입력해주세요. 최대 4096자까지 입력 가능합니다."
                    }
                    aria-invalid={!!errors.description}
                    className={`${fieldClassName(!!errors.description)} resize-y py-2.5`}
                    {...register("description", {
                        maxLength: {
                            value: 4096,
                            message: "설명은 4096자 이하로 입력해주세요.",
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

            <div className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-3">
                {/* 우선순위 */}
                <div>
                    <label
                        htmlFor="priority"
                        className="mb-1.5 block text-sm font-medium text-gray-700">
                        우선순위
                    </label>
                    <select
                        id="priority"
                        aria-invalid={!!errors.priorityType}
                        className={`${fieldClassName(!!errors.priorityType)} h-10`}
                        {...register("priorityType", {
                            setValueAs: optionalValue,
                        })}>
                        <option value="">선택</option>
                        <option value="LOW">{priorityLabel["LOW"]}</option>
                        <option value="MEDIUM">
                            {priorityLabel["MEDIUM"]}
                        </option>
                        <option value="HIGH">{priorityLabel["HIGH"]}</option>
                        <option value="URGENT">
                            {priorityLabel["URGENT"]}
                        </option>
                    </select>
                    {errors.priorityType?.message && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.priorityType.message}
                        </p>
                    )}
                </div>

                {/* 지원유형 */}
                <div>
                    <label
                        htmlFor="supportType"
                        className="mb-1.5 block text-sm font-medium text-gray-700">
                        지원유형
                    </label>
                    <select
                        id="supportType"
                        aria-invalid={!!errors.supportType}
                        className={`${fieldClassName(!!errors.supportType)} h-10`}
                        {...register("supportType", {
                            setValueAs: optionalValue,
                        })}>
                        <option value="">선택</option>
                        <option value="REMOTE">
                            {supportTypeLabel["REMOTE"]}
                        </option>
                        <option value="ONSITE">
                            {supportTypeLabel["ONSITE"]}
                        </option>
                        <option value="PHONE">
                            {supportTypeLabel["PHONE"]}
                        </option>
                        <option value="NONE">{supportTypeLabel["NONE"]}</option>
                    </select>
                    {errors.supportType?.message && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.supportType.message}
                        </p>
                    )}
                </div>

                {/* 이슈 발생일시 - 미입력시 서버에서 현재일시로 채움 */}
                <div>
                    <label
                        htmlFor="occurredAt"
                        className="mb-1.5 block text-sm font-medium text-gray-700">
                        이슈 발생일시
                    </label>
                    <input
                        id="occurredAt"
                        type="datetime-local"
                        className={`${fieldClassName(!!errors.occurredAt)} h-10`}
                        {...register("occurredAt", {
                            setValueAs: optionalValue,
                        })}
                    />
                    {errors.occurredAt?.message && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.occurredAt.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-2">
                {/* 요청자 */}
                <div>
                    <label
                        htmlFor="name"
                        className="mb-1.5 block text-sm font-medium text-gray-700">
                        요청자
                    </label>
                    <input
                        id="name"
                        type="text"
                        placeholder={"요청자 이름을 입력해주세요."}
                        aria-invalid={!!errors.assigner}
                        className={`${fieldClassName(!!errors.assigner)} h-10`}
                        {...register("assigner")}
                    />
                    {errors.assigner?.message && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.assigner.message}
                        </p>
                    )}
                </div>

                {/* 담당자 */}
                <div>
                    <label
                        htmlFor="name"
                        className="mb-1.5 block text-sm font-medium text-gray-700">
                        담당자
                    </label>
                    <input
                        id="name"
                        type="text"
                        placeholder={"담당자 이름을 입력해주세요."}
                        aria-invalid={!!errors.assignee}
                        className={`${fieldClassName(!!errors.assignee)} h-10`}
                        {...register("assignee")}
                    />
                    {errors.assignee?.message && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.assignee.message}
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
                    {isPending ? pendingLabel : submitLabel}
                </button>
            </div>
        </form>
    );
};
