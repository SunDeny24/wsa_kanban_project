'use client';

import {
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form';
import { type ProjectCreateRequest } from '@/features/project/types';

interface ProjectFormProps {
  register: UseFormRegister<ProjectCreateRequest>;
  errors: FieldErrors<ProjectCreateRequest>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
  onCancel: () => void;
  submitLabel?: string;
  pendingLabel?: string;
  stacked?: boolean;
}

const inputClassName =
  'w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black';

// 선택 입력의 빈 문자열은 요청 body에서 undefined로 처리합니다.
const optionalValue = (value: string) => value === '' ? undefined : value;

export const ProjectForm = ({
  register,
  errors,
  onSubmit,
  isPending,
  onCancel,
  submitLabel = '생성하기',
  pendingLabel = '생성 중...',
  stacked = false,
}: ProjectFormProps) => {
  // 에러 있는 경우 폼필드 스타일 수정
  const fieldClassName = (hasError: boolean) =>
    `${inputClassName} ${hasError ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">

      {/* 프로젝트 명 */}
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
          프로젝트명 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          maxLength={256}
          aria-invalid={!!errors.name}
          className={`${fieldClassName(!!errors.name)} h-10`}
          {...register('name', {
            required: '프로젝트명은 필수입니다.',
            maxLength: { value: 256, message: '프로젝트명은 256자 이하로 입력해주세요.' },
          })}
        />
        {errors.name?.message && <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      {/* 고객사 */}
      <div>
        <label htmlFor="customer" className="mb-1.5 block text-sm font-medium text-gray-700">
          고객사 <span className="text-red-500">*</span>
        </label>
        <input
          id="customer"
          type="text"
          maxLength={256}
          aria-invalid={!!errors.customer}
          className={`${fieldClassName(!!errors.customer)} h-10`}
          {...register('customer', {
            required: '고객사는 필수입니다.',
            maxLength: { value: 256, message: '고객사는 256자 이하로 입력해주세요.' },
          })}
        />
        {errors.customer?.message && <p className="mt-1.5 text-xs text-red-600">{errors.customer.message}</p>}
      </div>

      {/* 설명 */}
      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">설명</label>
        <textarea
          id="description"
          rows={5}
          maxLength={2048}
          aria-invalid={!!errors.description}
          className={`${fieldClassName(!!errors.description)} resize-y py-2.5`}
          {...register('description', {
            maxLength: { value: 2048, message: '설명은 2048자 이하로 입력해주세요.' },
            setValueAs: optionalValue,
          })}
        />
        {errors.description?.message && <p className="mt-1.5 text-xs text-red-600">{errors.description.message}</p>}
      </div>

      {/* 시작일 및 종료일 */}
      <div className={`grid grid-cols-1 gap-5 ${stacked ? '' : 'sm:grid-cols-2'}`}>
        <div>
          <label htmlFor="startDate" className="mb-1.5 block text-sm font-medium text-gray-700">시작일</label>
          <input
            id="startDate"
            type="date"
            className={`${fieldClassName(!!errors.startDate)} h-10`}
            {...register('startDate', { setValueAs: optionalValue })}
          />
          {errors.startDate?.message && <p className="mt-1.5 text-xs text-red-600">{errors.startDate.message}</p>}
        </div>

        <div>
          <label htmlFor="endDate" className="mb-1.5 block text-sm font-medium text-gray-700">종료일</label>
          <input
            id="endDate"
            type="date"
            className={`${fieldClassName(!!errors.endDate)} h-10`}
            {...register('endDate', { setValueAs: optionalValue })}
          />
          {errors.endDate?.message && <p className="mt-1.5 text-xs text-red-600">{errors.endDate.message}</p>}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="h-10 rounded-md border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="h-10 rounded-md bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
};
