/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
} from "@tanstack/react-query";
import { type AxiosInstance } from "axios";
import apiClient from "@/lib/axios/instance";

// ============================================
// GET - 단일 조회
// ============================================
interface UseEntityQueryOptions<T> extends Omit<
    UseQueryOptions<T>,
    "queryKey" | "queryFn"
> {
    enabled?: boolean;
}

export function useEntityQuery<T = any>(
    endpoint: string,
    id?: string,
    options?: UseEntityQueryOptions<T>,
    axiosInstance: AxiosInstance = apiClient,
) {
    return useQuery<T>({
        queryKey: id ? [endpoint, id] : [endpoint],
        queryFn: async () => {
            const url = id ? `${endpoint}/${id}` : endpoint;
            const response = await axiosInstance.get(url);
            return response.data;
        },
        staleTime: 0,
        ...options,
    });
}

// ============================================
// GET - 리스트 조회 (검색, 페이징 포함)
// ============================================

type QueryParams = Record<
  string,
  string | number | string[] | undefined
>;


export function useEntityListQuery<T = any>(
    endpoint: string,
    params?: QueryParams,
    options?: UseEntityQueryOptions<T>,
    axiosInstance: AxiosInstance = apiClient,
) {
    return useQuery<T>({
        queryKey: [endpoint, params],
        queryFn: async () => {
            const safeParams = params
                ? Object.fromEntries(
                      Object.entries(params).filter(
                          ([, value]) => value !== undefined,
                      ),
                  )
                : {};
            const queryString = new URLSearchParams(
                safeParams as Record<string, string>,
            ).toString();
            const url = `${endpoint}${queryString ? `?${queryString}` : ""}`;
            const response = await axiosInstance.get(url);
            return response.data;
        },
        staleTime: 0,
        ...options,
    });
}

// ============================================
// POST - 생성
// ============================================
interface UseCreateOptions {
    invalidateKeys?: string[][];
    onSuccessCallback?: (data: any) => void;
    onErrorCallback?: (error: any) => void;
    successMessage?: string | boolean;
}

export function useCreateEntity<TData = any, TResponse = any>(
    endpoint: string,
    options?: UseCreateOptions,
    axiosInstance: AxiosInstance = apiClient,
) {
    const queryClient = useQueryClient();

    return useMutation<TResponse, Error, TData>({
        mutationFn: async (data: TData) => {
            const response = await axiosInstance.post(endpoint, data, {
                successMessage: options?.successMessage ?? true,
            } as any);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [endpoint] });

            // 추가 무효화
            if (options?.invalidateKeys) {
                options.invalidateKeys.forEach((key) => {
                    queryClient.invalidateQueries({ queryKey: key });
                });
            }

            options?.onSuccessCallback?.(data);
        },
        onError: (error) => {
            options?.onErrorCallback?.(error);
        },
    });
}

// ============================================
// PATCH - 수정
// ============================================
interface UseUpdateOptions extends UseCreateOptions {}

export function useUpdateEntity<TData = any, TResponse = any>(
    endpoint: string,
    options?: UseUpdateOptions,
    axiosInstance: AxiosInstance = apiClient,
) {
    const queryClient = useQueryClient();

    return useMutation<TResponse, Error, { id: string; data: TData }>({
        mutationFn: async ({ id, data }) => {
            const response = await axiosInstance.patch(`${endpoint}/${id}`, data, {
                successMessage: options?.successMessage ?? true,
            } as any);
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [endpoint, variables.id],
            });
            // 리스트 캐시 무효화
            queryClient.invalidateQueries({ queryKey: [endpoint] });

            // 추가 무효화
            if (options?.invalidateKeys) {
                options.invalidateKeys.forEach((key) => {
                    queryClient.invalidateQueries({ queryKey: key });
                });
            }

            options?.onSuccessCallback?.(data);
        },
        onError: (error) => {
            options?.onErrorCallback?.(error);
        },
    });
}

// ============================================
// PATCH - 고정 URL에 바로 수정 (id 없이)
// ============================================
export function usePatchEntity<TData = any, TResponse = any>(
    endpoint: string,
    options?: UseCreateOptions,
    axiosInstance: AxiosInstance = apiClient,
) {
    const queryClient = useQueryClient();

    return useMutation<TResponse, Error, TData>({
        mutationFn: async (data: TData) => {
            const response = await axiosInstance.patch(endpoint, data, {
                successMessage: options?.successMessage ?? true,
            } as any);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [endpoint] });

            if (options?.invalidateKeys) {
                options.invalidateKeys.forEach((key) => {
                    queryClient.invalidateQueries({ queryKey: key });
                });
            }

            options?.onSuccessCallback?.(data);
        },
        onError: (error) => {
            options?.onErrorCallback?.(error);
        },
    });
}

// ============================================
// DELETE - 삭제
// ============================================
interface UseDeleteOptions extends UseCreateOptions {}

export function useDeleteEntity<TResponse = any>(
    endpoint: string,
    options?: UseDeleteOptions,
    axiosInstance: AxiosInstance = apiClient,
) {
    const queryClient = useQueryClient();

    return useMutation<TResponse, Error, string>({
        mutationFn: async (id: string) => {
            const response = await axiosInstance.delete(`${endpoint}/${id}`, {
                successMessage: options?.successMessage ?? true,
            } as any);
            return response.data;
        },
        onSuccess: (data) => {
            // 리스트 캐시 무효화
            queryClient.invalidateQueries({ queryKey: [endpoint] });

            // 추가 무효화
            if (options?.invalidateKeys) {
                options.invalidateKeys.forEach((key) => {
                    queryClient.invalidateQueries({ queryKey: key });
                });
            }

            options?.onSuccessCallback?.(data);
        },
        onError: (error) => {
            options?.onErrorCallback?.(error);
        },
    });
}

// ============================================
// PUT - 전체 교체 (필요시)
// ============================================
export function useReplaceEntity<TData = any, TResponse = any>(
    endpoint: string,
    options?: UseUpdateOptions,
    axiosInstance: AxiosInstance = apiClient,
) {
    const queryClient = useQueryClient();

    return useMutation<TResponse, Error, { id: string; data: TData }>({
        mutationFn: async ({ id, data }) => {
            const response = await axiosInstance.patch(`${endpoint}/${id}`, data);
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [endpoint, variables.id],
            });
            queryClient.invalidateQueries({ queryKey: [endpoint] });

            if (options?.invalidateKeys) {
                options.invalidateKeys.forEach((key) => {
                    queryClient.invalidateQueries({ queryKey: key });
                });
            }

            options?.onSuccessCallback?.(data);
        },
        onError: (error) => {
            options?.onErrorCallback?.(error);
        },
    });
}