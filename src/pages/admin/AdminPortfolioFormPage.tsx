import { type FC, type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { classNames } from '@/css/classnames';
import {
  createPortfolioItem,
  type PortfolioInput,
  updatePortfolioItem,
  uploadAdminImage,
} from '@/data/api/adminApi';
import { usePortfolio } from '@/hooks/usePortfolio';
import actions from '@/ui/Actions.module.scss';
import btn from '@/ui/Button.module.scss';
import form from '@/ui/Form.module.scss';
import page from '@/ui/Page.module.scss';
import { Placeholder } from '@telegram-apps/telegram-ui';

import { AdminGate } from './AdminGate';
import { ImageUploadField } from './ImageUploadField';

const emptyForm: PortfolioInput = {
  title: '',
  fabricName: '',
  beforeImageUrl: '',
  afterImageUrl: '',
};

export const AdminPortfolioFormPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { items, loading: listLoading } = usePortfolio();
  const existing = isEdit ? items.find((item) => item.id === id) : undefined;

  const [values, setValues] = useState<PortfolioInput>(emptyForm);
  const [beforeError, setBeforeError] = useState<string | null>(null);
  const [afterError, setAfterError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState<'before' | 'after' | null>(null);

  useEffect(() => {
    if (existing) {
      setValues({
        title: existing.title,
        fabricName: existing.fabricName,
        beforeImageUrl: existing.beforeImageUrl,
        afterImageUrl: existing.afterImageUrl,
      });
    }
  }, [existing]);

  const uploadImage = async (field: 'before' | 'after', file: File) => {
    const setFieldError = field === 'before' ? setBeforeError : setAfterError;
    setFieldError(null);
    setUploadingField(field);
    try {
      const url = await uploadAdminImage('portfolio-images', file);
      setValues((prev) =>
        field === 'before'
          ? { ...prev, beforeImageUrl: url }
          : { ...prev, afterImageUrl: url },
      );
    } catch (err: unknown) {
      setFieldError(err instanceof Error ? err.message : 'Не удалось загрузить фото');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (!values.beforeImageUrl || !values.afterImageUrl) {
      if (!values.beforeImageUrl) setBeforeError('Добавьте фото «до»');
      if (!values.afterImageUrl) setAfterError('Добавьте фото «после»');
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await updatePortfolioItem(id, values);
      } else {
        await createPortfolioItem(values);
      }
      navigate('/admin/portfolio');
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Не удалось сохранить');
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && listLoading) {
    return (
      <AdminGate>
        <Page>
          <Placeholder header="Загрузка…" description="Получаем данные работы" />
        </Page>
      </AdminGate>
    );
  }

  if (isEdit && !listLoading && !existing) {
    return (
      <AdminGate>
        <Page>
          <Placeholder header="Работа не найдена" description="Вернитесь к списку" />
        </Page>
      </AdminGate>
    );
  }

  return (
    <AdminGate>
      <Page>
        <div className={classNames(page.page, page.pageForm)}>
          <PageHeader
            title={isEdit ? 'Редактировать работу' : 'Новая работа'}
            lead="Фото до и после перетяжки"
          />

          <form className={form.orderForm} onSubmit={(e) => void handleSubmit(e)}>
            <div className={form.field}>
              <label className={form.fieldLabel} htmlFor="portfolio-title">
                Название
              </label>
              <input
                id="portfolio-title"
                className={form.fieldInput}
                value={values.title}
                onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
                required
              />
            </div>

            <div className={form.field}>
              <label className={form.fieldLabel} htmlFor="portfolio-fabric">
                Ткань (необязательно)
              </label>
              <input
                id="portfolio-fabric"
                className={form.fieldInput}
                value={values.fabricName}
                onChange={(e) => setValues((v) => ({ ...v, fabricName: e.target.value }))}
              />
            </div>

            <ImageUploadField
              label="Фото «до»"
              imageUrl={values.beforeImageUrl || null}
              onFileSelect={(file) => void uploadImage('before', file)}
              error={beforeError}
              hint={uploadingField === 'before' ? 'Загрузка…' : undefined}
            />

            <ImageUploadField
              label="Фото «после»"
              imageUrl={values.afterImageUrl || null}
              onFileSelect={(file) => void uploadImage('after', file)}
              error={afterError}
              hint={uploadingField === 'after' ? 'Загрузка…' : undefined}
            />

            {submitError && <p className={form.fieldError}>{submitError}</p>}

            <div className={actions.actions}>
              <button
                type="submit"
                className={classNames(btn.btn, btn.btnPrimary)}
                disabled={submitting || uploadingField !== null}
              >
                {submitting ? 'Сохранение…' : 'Сохранить'}
              </button>
              <Link to="/admin/portfolio" className={classNames(btn.btn, btn.btnSecondary)}>
                Отмена
              </Link>
            </div>
          </form>
        </div>
      </Page>
    </AdminGate>
  );
};
