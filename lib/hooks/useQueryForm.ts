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

// ============================================
// CREATE Form (새로 만들기)
// ============================================
export function useCreateEntityForm<
    TData extends FieldValues = FieldValues,
    TResponse = TData,
>(
    endpoint: string,
    options?: {
        formOptions?: UseFormProps<TData>;
        mutationOptions?: {
            onSuccessCallback?: (data: TResponse) => void;
        };
        axiosInstance?: AxiosInstance;
    },
) {
    const form = useForm<TData>(options?.formOptions);
    const mutation = useCreateEntity<TData, TResponse>(
        endpoint,
        options?.mutationOptions,
        options?.axiosInstance,
    );

    const onSubmit = form.handleSubmit((data: TData) => {
        mutation.mutate(data);
    });

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
        axiosInstance?: AxiosInstance;
    },
) {
    // 1. Query로 기존 데이터 가져오기 (GET)
    const query = useEntityQuery<TData>(endpoint, id, options?.queryOptions, options?.axiosInstance);

    // 2. useForm 초기화
    const form = useForm<TData>(options?.formOptions);

    // 3. 데이터 로드되면 form에 자동으로 채우기
    useEffect(() => {
        if (query.data) {
            form.reset(query.data);
        }
    }, [query.data, form]);

    // 4. Update mutation (PATCH)
    const mutation = useUpdateEntity<TData, TResponse>(
        endpoint,
        options?.mutationOptions,
        options?.axiosInstance,
    );

    // 5. Submit handler
    const onSubmit = form.handleSubmit((data) => {
        mutation.mutate({ id, data });
    });

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

        // 원본 객체 (필요시 직접 접근)
        query,
        form,
        mutation,
    };
}

// ============================================
// LIST Form (목록 + 검색/필터) - useQuery + useForm 결합
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

    },
) {
    // 1. 검색/필터 폼
    const form = useForm<TFilterData>(options?.formOptions);

    // 2. api 요청에 사용될 필터 데이터를 상태로 관리
    const [appliedFilters, setAppliedFilters] =
        useState<TFilterData>(
            (options?.formOptions?.defaultValues ?? {}) as TFilterData,
        );

    // 3. 목록 조회
    const query = useEntityListQuery<TData>(
        endpoint,
        appliedFilters as any,
        options?.queryOptions,
    );

    // 4. 검색/필터 제출 핸들러
    const onSearch = form.handleSubmit((data) => {
        setAppliedFilters(data);
    });

    // 5. 검색조건 초기화 핸들러
    const onReset = () => {
        form.reset(
            (options?.formOptions?.defaultValues ?? {}) as TFilterData,
        );

        setAppliedFilters(
            (options?.formOptions?.defaultValues ?? {}) as TFilterData,
        );
    };

    // 6. 특정 검색 조건 변경 
    const setFilter = <K extends Path<TFilterData>>(
        key: K,
        value: PathValue<TFilterData, K>,
    ) => {
        form.setValue(key, value);

        const nextFilters = {
            ...form.getValues(),
            [key]: value,
        } as TFilterData;

        setAppliedFilters(nextFilters);
    };

    return {
        // Form 메서드들 (검색/필터용)
        register: form.register,
        watch: form.watch,
        reset: form.reset,
        getValues: form.getValues,
        setValue: form.setValue,
        control: form.control,
        formState: form.formState,

        onSearch,
        onReset,
        setFilter,

        // 현재 Form 값
        formValues: form.getValues(),

        // 실제 API에 적용된 검색 조건
        appliedFilters,

        // Query 관련
        data: query.data,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
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