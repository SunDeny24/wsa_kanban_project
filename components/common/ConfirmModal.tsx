// 공통 확인 팝업

"use client";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description?: string;

    confirmText?: string;
    cancelText?: string;

    variant?: "default" | "danger";

    isLoading?: boolean;

    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal = ({
                                 isOpen,
                                 title,
                                 description,
                                 confirmText = "확인",
                                 cancelText = "취소",
                                 variant = "default",
                                 isLoading = false,
                                 onConfirm,
                                 onCancel,
                             }: ConfirmModalProps) => {
    if (!isOpen) return null;

    const confirmButtonClass =
        variant === "danger"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-gray-900">
                    {title}
                </h2>

                {description && (
                    <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                        {description}
                    </p>
                )}

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${confirmButtonClass}`}
                    >
                        {isLoading ? "처리 중..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};