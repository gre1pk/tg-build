import { type ChangeEvent, type FC, useId, useRef } from 'react';

import { classNames } from '@/css/classnames';
import form from '@/ui/Form.module.scss';

const MAX_BYTES = 10 * 1024 * 1024;

interface ImageUploadFieldProps {
  label: string;
  hint?: string;
  imageUrl: string | null;
  onFileSelect: (file: File) => void;
  error?: string | null;
}

export const ImageUploadField: FC<ImageUploadFieldProps> = ({
  label,
  hint,
  imageUrl,
  onFileSelect,
  error,
}) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      return;
    }
    if (file.size > MAX_BYTES) {
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className={form.field}>
      <label htmlFor={inputId} className={form.fieldLabel}>
        {label}
      </label>
      {hint && <p className={form.fieldHint}>{hint}</p>}

      {imageUrl ? (
        <div className={form.photoPreview}>
          <img src={imageUrl} alt="" className={form.photoPreviewImage} />
          <button
            type="button"
            className={classNames(form.photoPreviewChange, form.fieldHint)}
            onClick={() => inputRef.current?.click()}
          >
            Заменить фото
          </button>
        </div>
      ) : (
        <label htmlFor={inputId} className={form.photoUpload}>
          <span className={form.photoUploadTitle}>Выбрать фото</span>
          <span className={form.photoUploadMeta}>JPG, PNG, WEBP · до 10 МБ</span>
        </label>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className={form.photoUploadInput}
        onChange={handleChange}
      />

      {error && <p className={form.fieldError}>{error}</p>}
    </div>
  );
};
