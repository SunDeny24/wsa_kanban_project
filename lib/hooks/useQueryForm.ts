/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react";
import {
    useForm,
    UseFormProps,
    FieldValues,
    type Path,
    type PathValue,
} from "react-hook-form";
import { type AxiosInstance } from "axios";
import { useEntityQuery, useEntityListQuery, useCreateEntity, useUpdateEntity, usePatchEntity } from "./useEntity";
import { getErrorResponse } from "@/lib/api/error";
import { type ErrorResponse } from "@/types/api";

// ============================================
// CREATE Form (새로 만들기)
// ============================================
export function useCreateEntityForm<
    TData extends FieldValues = FieldValues,
    TResponse = TData,
>(
    endpoint: string,
    options?: {
        formOptions?: UseFormProps<TData>; //입력 폼 옵션
        mutationOptions?: { // 생성 mutation 옵션
            onSuccessCallback?: (data: TResponse) => void;
        };
        axiosInstance?: AxiosInstance; // axios 인스턴스 옵션
    },
) {
    const form = useForm<TData>(options?.formOptions);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
    const mutation = useCreateEntity<TData, TResponse>(
        endpoint,
        options?.mutationOptions,
        options?.axiosInstance,
    );

    const onSubmit = form.handleSubmit((data: TData) => {
        // 재요청 전에는 이전 서버 오류만 지우고 사용자가 입력한 값은 유지합니다.
        setErrorResponse(null);
        form.clearErrors();
        mutation.mutate(data);
    });

    useEffect(() => {
        if (!mutation.error) return;

        const nextError = getErrorResponse(mutation.error);
        const fieldErrors = nextError.fieldErrors;

        if (fieldErrors && Object.keys(fieldErrors).length > 0) {
            // 백엔드 @Valid 오류를 같은 이름의 React Hook Form 필드에 연결합니다.
            Object.entries(fieldErrors).forEach(([field, message]) => {
                form.setError(field as Path<TData>, {
                    type: "server",
                    message,
                });
            });
            setErrorResponse(null);
            return;
        }

        setErrorResponse(nextError);
    }, [mutation.error, form]);

    return {
        // Form 메서드들
        register: form.register,
        watch: form.watch,
        reset: form.reset,
        getValues: form.getValues,
        setValue: form.setValue,
        control: form.control,
        formState: form.formState,
        handleSubmit: form.handleSubmit,

        // Mutation 관련
        onSubmit,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        errorResponse,
        clearErrorResponse: () => setErrorResponse(null),

        // 원본 객체 (필요시 직접 접근)
        form,
        mutation,
    };
}

// ============================================
// UPDATE Form (수정하기) - useQuery + useForm 결합
// ============================================
export function useUpdateEntityForm<
    TData extends FieldValues = FieldValues,
    TResponse = TData,
    TQueryData = TData,
>(
    endpoint: string,
    id: string,
    options?: {
        formOptions?: UseFormProps<TData>;
        mutationOptions?: {
            onSuccessCallback?: (data: TResponse) => void;
        };
        queryOptions?: {
            enabled?: boolean;
        };
        mapQueryData?: (data: TQueryData) => TData;
        axiosInstance?: AxiosInstance;
    },
) {
    // 1. Query로 기존 데이터 가져오기 (GET)
    const query = useEntityQuery<TQueryData>(endpoint, id, options?.queryOptions, options?.axiosInstance);

    // 2. useForm 초기화
    const form = useForm<TData>(options?.formOptions);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
    const mapQueryData = options?.mapQueryData;

    // 3. 데이터 로드되면 form에 자동으로 채우기
    useEffect(() => {
        if (query.data) {
            const formData = mapQueryData
                ? mapQueryData(query.data)
                : query.data as unknown as TData;
            form.reset(formData);
        }
    }, [query.data, form, mapQueryData]);

    // 4. Update mutation (PATCH)
    const mutation = useUpdateEntity<TData, TResponse>(
        endpoint,
        options?.mutationOptions,
        options?.axiosInstance,
    );

    // 5. Submit handler
    const onSubmit = form.handleSubmit((data) => {
        setErrorResponse(null);
        form.clearErrors();
        mutation.mutate({ id, data });
    });

    useEffect(() => {
        if (!mutation.error) return;

        const nextError = getErrorResponse(mutation.error);
        const fieldErrors = nextError.fieldErrors;

        if (fieldErrors && Object.keys(fieldErrors).length > 0) {
            Object.entries(fieldErrors).forEach(([field, message]) => {
                form.setError(field as Path<TData>, {
                    type: "server",
                    message,
                });
            });
            setErrorResponse(null);
            return;
        }

        setErrorResponse(nextError);
    }, [mutation.error, form]);

    return {
        // Query 관련 (데이터 로딩 상태)
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        queryError: query.error,
        data: query.data,

        // Form 메서드들
        register: form.register,
        watch: form.watch,
        reset: form.reset,
        getValues: form.getValues,
        setValue: form.setValue,
        control: form.control,
        formState: form.formState,
        handleSubmit: form.handleSubmit,

        // Mutation 관련 (저장 상태)
        onSubmit,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        errorResponse,
        clearErrorResponse: () => setErrorResponse(null),

        // 원본 객체 (필요시 직접 접근)
        query,
        form,
        mutation,
    };
}

// ============================================
// LIST Form (목록 + 검색/필터 + 페이지네이션) - useQuery + useForm 결합
// ============================================
export function useListEntityForm<
    TData,
    TFilterData extends FieldValues = FieldValues,
>(
    endpoint: string,
    options?: {
        formOptions?: UseFormProps<TFilterData>;
        queryOptions?: {
            enabled?: boolean;
        };
        pagination?: {
            page?: number;
            size?: number;
        };

    },
) {
    // 1. 검색/필터 폼
    const form = useForm<TFilterData>(options?.formOptions);

    // 2. api 요청에 사용될 필터 데이터를 상태로 관리
    const [appliedFilters, setAppliedFilters] =
        useState<TFilterData>(
            (options?.formOptions?.defaultValues ?? {}) as TFilterData,
        );
    // 3. 페이지네이션 상태관리 - API page는 0 부터 시작
    const [page, setPage] = useState(
        options?.pagination?.page ?? 0,
    );

    // 4. 목록 조회
    const query = useEntityListQuery<TData>(
        endpoint,
        {
            ...appliedFilters,
            page,
        },
        options?.queryOptions,
    );

    // 5. 검색 - 새로운 검색조건 적용시 첫페이지부터 조회
    const onSearch = form.handleSubmit((data) => {
        setPage(0);
        setAppliedFilters(data);
    });

    // 6. 검색조건 초기화 핸들러
    const onReset = () => {
        const defaultValues =
            (options?.formOptions?.defaultValues ?? {}) as TFilterData;

        form.reset(defaultValues);

        setPage(0);
        setAppliedFilters(defaultValues);
    };

    // 7. 특정 검색 조건 변경 - 필터 변경시 첫 페이지부터 조회
    const setFilter = <K extends Path<TFilterData>>(
        key: K,
        value: PathValue<TFilterData, K>,
    ) => {
        form.setValue(key, value);

        const nextFilters = {
            ...form.getValues(),
            [key]: value,
        } as TFilterData;

        setPage(0);
        setAppliedFilters(nextFilters);
    };

    // 8. 페이지 변경
    const onPageChange = (nextPage: number) => {
        setPage(nextPage);
    };

    // 9. 에러 응답 처리
    const errorResponse = query.error
        ? getErrorResponse(query.error)
        : null;


    return {
        // Form 메서드들 (검색/필터용)
        register: form.register,
        watch: form.watch,
        reset: form.reset,
        getValues: form.getValues,
        setValue: form.setValue,
        control: form.control,
        formState: form.formState,

        // 검색, 필터
        onSearch,
        onReset,
        setFilter,

        formValues: form.getValues(),
        appliedFilters,

        // 페이지네이션
        page,
        onPageChange,

        // Query 관련
        data: query.data,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: errorResponse, // ErrorResponse 타입으로 변환된 에러
        refetch: query.refetch,

        // 원본 객체
        form,
        query,
    };
}

// ============================================
// PATCH Form (고정 URL 수정) - useForm + usePatchEntity 결합
// ============================================
export function usePatchEntityForm<
    TData extends FieldValues = FieldValues,
    TResponse = TData,
>(
    endpoint: string,
    options?: {
        formOptions?: UseFormProps<TData>;
        mutationOptions?: Parameters<typeof usePatchEntity>[1];
    },
) {
    const form = useForm<TData>(options?.formOptions);
    const mutation = usePatchEntity<TData, TResponse>(endpoint, options?.mutationOptions);

    const onSubmit = form.handleSubmit((data) => {
        mutation.mutate(data);
    });

    return {
        register: form.register,
        watch: form.watch,
        reset: form.reset,
        getValues: form.getValues,
        setValue: form.setValue,
        control: form.control,
        formState: form.formState,
        handleSubmit: form.handleSubmit,

        onSubmit,
        mutate: mutation.mutate,
        mutateAsync: mutation.mutateAsync,

        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,

        form,
        mutation,
    };
}
