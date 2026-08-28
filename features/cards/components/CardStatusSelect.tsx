// 카드 상태값 변경

import { CardStatus } from "@/features/cards/types";
import { useEffect, useRef, useState } from "react";
import { useCardStatus } from "@/features/cards/hooks/useCardStatus";
import { cardStatusLabel, statusStyle } from "@/features/cards/constants";
import {
    AlertCircle,
    Check,
    CheckCircle2,
    ChevronDown,
    LoaderCircle,
} from "lucide-react";
import { cardStatusList } from "@/features/cards/types";

interface CardStatusSelectProps {
    cardId: string;
    projectId: string;
    status: CardStatus;
}
type SaveState = "idle" | "saved" | "error";

export const CardStatusSelect = ({
    cardId,
    projectId,
    status,
}: CardStatusSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [saveState, setSaveState] = useState<SaveState>("idle"); // status 저장 상태

    const statusClassName = statusStyle[status];

    const { mutate: changeStatus, isPending } = useCardStatus(projectId);

    // 저장 결과 문구를 잠깐 보여준 후
    // 다시 "변경 즉시 저장" 상태로 복귀
    const menuRef = useRef<HTMLDivElement>(null);
    const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const showFeedback = (state: SaveState) => {
        if (feedbackTimerRef.current) {
            clearTimeout(feedbackTimerRef.current);
        }

        setSaveState(state);

        if (state !== "idle") {
            feedbackTimerRef.current = setTimeout(() => {
                setSaveState("idle");
            }, 1800);
        }
    };

    const handleChangeStatus = (nextStatus: CardStatus) => {
        // 현재 상태와 같으면 요청하지 않음
        if (nextStatus === status) {
            setIsOpen(false);
            return;
        }

        // 선택 즉시 드롭다운 닫기
        setIsOpen(false);
        setSaveState("idle");

        changeStatus(
            {
                id: cardId,
                data: {
                    status: nextStatus,
                },
            },
            {
                onSuccess: () => {
                    showFeedback("saved");
                },
                onError: () => {
                    showFeedback("error");
                },
            }
        );
    };

    // 드롭다운 열렸을 때, 드롭다운 바깥 클릭 시 닫기
    useEffect(() => {
        if (!isOpen) return;

        // 드롭다운 바깥 클릭 시 닫기
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        // ESC 키 눌러 닫기
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };
        // 이벤트 리스너 등록
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        // 이벤트 리스너 해제
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    // 컴포넌트 언마운트 시, feedbackTimer 해제 -
    useEffect(() => {
        return () => {
            if (feedbackTimerRef.current) {
                clearTimeout(feedbackTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-2">
            {/* 상태 드롭다운 */}
            <div ref={menuRef} className="relative inline-block">
                <button
                    type="button"
                    disabled={isPending}
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    className={`
                        inline-flex items-center gap-1.5
                        rounded-full border
                        px-3 py-1.5
                        text-xs font-semibold
                        transition
                        ${statusClassName.background}
                        ${statusClassName.title}
                        ${statusClassName.border}
                        ${
                            isPending
                                ? "cursor-not-allowed opacity-60"
                                : "cursor-pointer"
                        }
                    `}>
                    {cardStatusLabel[status]}

                    <ChevronDown
                        className={`
                            h-3.5 w-3.5 transition-transform
                            ${isOpen ? "rotate-180" : ""}
                        `}
                    />
                </button>

                {/* 상태 목록 */}
                {isOpen && !isPending && (
                    <div
                        role="listbox"
                        className="
                            absolute left-0 z-50 mt-2
                            w-36 overflow-hidden
                            rounded-xl border border-gray-200
                            bg-white py-1
                            shadow-lg
                            sm:left-auto sm:left-0
                        ">
                        {cardStatusList.map((item) => (
                            <button
                                key={item}
                                type="button"
                                role="option"
                                aria-selected={status === item}
                                onClick={() => handleChangeStatus(item)}
                                className="
                                    flex w-full items-center justify-between
                                    px-3 py-2
                                    text-left text-sm text-gray-700
                                    transition hover:bg-gray-50
                                ">
                                <span>{cardStatusLabel[item]}</span>

                                {status === item && (
                                    <Check className="h-4 w-4 text-blue-600" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 자동 저장 상태 안내 */}
            <div
                className={`
                    flex min-h-5 items-center gap-1
                    text-[11px]
                    ${
                        saveState === "error"
                            ? "text-red-500"
                            : saveState === "saved"
                              ? "text-green-600"
                              : "text-gray-400"
                    }
                `}>
                {isPending ? (
                    <>
                        <LoaderCircle className="h-3 w-3 animate-spin" />
                        <span>저장 중...</span>
                    </>
                ) : saveState === "saved" ? (
                    <>
                        <CheckCircle2 className="h-3 w-3" />
                        <span>저장됨</span>
                    </>
                ) : saveState === "error" ? (
                    <>
                        <AlertCircle className="h-3 w-3" />
                        <span>저장 실패</span>
                    </>
                ) : (
                    <>
                        <CheckCircle2 className="h-3 w-3" />
                        <span>변경 즉시 저장</span>
                    </>
                )}
            </div>
        </div>
    );
};
