import { type ChangeEvent, type FC, type FormEvent, useId, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { classNames } from '@/css/classnames';
import { MasterContactNotConfiguredError } from '@/helpers/openMasterContact';
import { submitOrderRequest } from '@/helpers/submitOrderRequest';
import { useFabric } from '@/hooks/useFabrics';
import actions from '@/ui/Actions.module.scss';
import btn from '@/ui/Button.module.scss';
import empty from '@/ui/EmptyState.module.scss';
import form from '@/ui/Form.module.scss';
import page from '@/ui/Page.module.scss';
import sk from '@/ui/Skeleton.module.scss';
import textLink from '@/ui/TextLink.module.scss';

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

export const OrderRequestPage: FC = () => {
  const [searchParams] = useSearchParams();
  const fabricId = searchParams.get('fabricId');
  const { fabric, loading: fabricLoading, error: fabricError } = useFabric(fabricId ?? undefined);

  const photoInputId = useId();
  const commentId = useId();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedVia, setSubmittedVia] = useState<'shared' | 'telegram' | null>(null);

  const clearPhoto = () => {
    setPhoto(null);
    setPhotoError(null);
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }
    setPhotoPreviewUrl(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPhotoError(null);
    setSubmittedVia(null);

    if (!file) {
      clearPhoto();
      return;
    }

    if (!ACCEPTED_PHOTO_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
      setPhotoError('Выберите фото в формате JPG, PNG или WEBP.');
      clearPhoto();
      return;
    }

    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError('Файл слишком большой. Максимум — 10 МБ.');
      clearPhoto();
      return;
    }

    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    setPhoto(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmittedVia(null);

    if (!photo && !comment.trim()) {
      setSubmitError('Добавьте фото мебели или коротко опишите, что нужно перетянуть.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitOrderRequest({
        photo,
        comment,
        fabric: fabric ?? null,
      });
      setSubmittedVia(result);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      if (error instanceof MasterContactNotConfiguredError) {
        setSubmitError(
          'Контакт мастера ещё не настроен. Сохраните заявку и напишите мастеру, когда связь будет готова.',
        );
        return;
      }
      setSubmitError('Не удалось открыть чат с мастером. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  if (fabricId && fabricLoading) {
    return (
      <Page>
        <div className={page.page}>
          <PageHeader title="Заявка на перетяжку" lead="Загружаем выбранную ткань…" />
          <div className={`${sk.block} ${sk.line} ${sk.orderLine}`} />
        </div>
      </Page>
    );
  }

  if (fabricId && (fabricError || !fabric)) {
    return (
      <Page>
        <div className={page.page}>
          <PageHeader title="Заявка на перетяжку" />
          <div className={empty.empty}>
            <p className={empty.emptyTitle}>Ткань не найдена</p>
            <p className={empty.emptyText}>
              Образец мог быть удалён из каталога. Оставьте заявку без привязки к ткани или
              выберите другой образец.
            </p>
            <Link
              to="/order"
              className={classNames(btn.btn, btn.btnPrimary, empty.emptyAction)}
            >
              Оставить заявку
            </Link>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className={classNames(page.page, page.pageForm)}>
        <PageHeader
          title="Заявка на перетяжку"
          lead="Добавьте фото мебели и комментарий — откроем чат с мастером с готовым текстом."
        />

        <form className={form.orderForm} onSubmit={handleSubmit} noValidate>
          {fabric && (
            <div className={form.fabricSummary} aria-label="Выбранная ткань">
              <img
                src={fabric.imageUrl}
                alt={`Образец ${fabric.name}`}
                className={form.fabricImage}
                width={48}
                height={48}
              />
              <div>
                <p className={form.fabricLabel}>Выбранная ткань</p>
                <p className={form.fabricName}>
                  {fabric.name} · {fabric.material}, {fabric.color}
                </p>
              </div>
            </div>
          )}

          <div className={form.field}>
            <label className={form.fieldLabel} htmlFor={photoInputId}>
              Фото мебели
            </label>
            <p className={form.fieldHint} id={`${photoInputId}-hint`}>
              Снимите диван или кресло целиком — так мастеру проще оценить объём работ.
            </p>

            {photoPreviewUrl ? (
              <div className={form.photoPreview}>
                <img
                  src={photoPreviewUrl}
                  alt="Выбранное фото мебели"
                  className={form.photoPreviewImage}
                />
                <button
                  type="button"
                  className={classNames(textLink.textLink, form.photoPreviewChange)}
                  onClick={clearPhoto}
                >
                  Выбрать другое фото
                </button>
              </div>
            ) : (
              <label className={form.photoUpload} htmlFor={photoInputId}>
                <span className={form.photoUploadTitle}>Добавить фото</span>
                <span className={form.photoUploadMeta}>JPG, PNG или WEBP · до 10 МБ</span>
              </label>
            )}

            <input
              ref={photoInputRef}
              id={photoInputId}
              type="file"
              accept="image/*"
              capture="environment"
              className={form.photoUploadInput}
              aria-describedby={`${photoInputId}-hint`}
              onChange={handlePhotoChange}
            />
            {photoError && (
              <p className={form.fieldError} role="alert">
                {photoError}
              </p>
            )}
          </div>

          <div className={form.field}>
            <label className={form.fieldLabel} htmlFor={commentId}>
              Комментарий
            </label>
            <p className={form.fieldHint} id={`${commentId}-hint`}>
              Необязательно. Например: «угловой диван», «нужна ткань для кошек».
            </p>
            <textarea
              id={commentId}
              className={form.fieldTextarea}
              rows={4}
              maxLength={500}
              placeholder="Что перетягиваем и есть ли пожелания?"
              value={comment}
              aria-describedby={`${commentId}-hint`}
              onChange={(event) => {
                setComment(event.target.value);
                setSubmittedVia(null);
              }}
            />
          </div>

          {submitError && (
            <p className={classNames(form.fieldError, form.submitError)} role="alert">
              {submitError}
            </p>
          )}

          {submittedVia === 'telegram' && (
            <p className={form.success} role="status">
              Чат с мастером открыт. Если фото не прикрепилось автоматически, отправьте его
              следующим сообщением.
            </p>
          )}

          {submittedVia === 'shared' && (
            <p className={form.success} role="status">
              Заявка отправлена. Мастер ответит в Telegram.
            </p>
          )}

          <div className={classNames(actions.actions, actions.actionsSticky)}>
            <button
              type="submit"
              className={classNames(btn.btn, btn.btnPrimary)}
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? 'Открываем чат…' : 'Отправить заявку мастеру'}
            </button>
          </div>
        </form>
      </div>
    </Page>
  );
};
