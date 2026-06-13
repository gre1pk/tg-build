import { type FC, type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AdminTopActions } from '@/components/AdminTopActions/AdminTopActions';
import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { classNames } from '@/css/classnames';
import {
  createFabric,
  type FabricInput,
  updateFabric,
  uploadAdminImage,
} from '@/data/api/adminApi';
import { useFabric } from '@/hooks/useFabrics';
import actions from '@/ui/Actions.module.scss';
import btn from '@/ui/Button.module.scss';
import form from '@/ui/Form.module.scss';
import page from '@/ui/Page.module.scss';
import { Placeholder } from '@telegram-apps/telegram-ui';

import { AdminGate } from './AdminGate';
import { ImageUploadField } from './ImageUploadField';

const emptyForm: FabricInput = {
  name: '',
  material: '',
  color: '',
  pricePerMeter: 0,
  imageUrl: '',
  description: '',
  petFriendly: false,
};

export const AdminFabricFormPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { fabric, loading: fabricLoading } = useFabric(isEdit ? id : undefined);

  const [values, setValues] = useState<FabricInput>(emptyForm);
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (fabric) {
      setValues({
        name: fabric.name,
        material: fabric.material,
        color: fabric.color,
        pricePerMeter: fabric.pricePerMeter,
        imageUrl: fabric.imageUrl,
        description: fabric.description ?? '',
        petFriendly: Boolean(fabric.petFriendly),
      });
    }
  }, [fabric]);

  const handleImage = async (file: File) => {
    setImageError(null);
    setUploading(true);
    try {
      const url = await uploadAdminImage('fabric-images', file);
      setValues((prev) => ({ ...prev, imageUrl: url }));
    } catch (err: unknown) {
      setImageError(err instanceof Error ? err.message : 'Не удалось загрузить фото');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (!values.imageUrl) {
      setImageError('Добавьте фото образца');
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await updateFabric(id, values);
        navigate('/admin/fabrics');
      } else {
        await createFabric(values);
        navigate('/admin/fabrics');
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Не удалось сохранить');
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && fabricLoading) {
    return (
      <AdminGate>
        <Page>
          <Placeholder header="Загрузка…" description="Получаем данные ткани" />
        </Page>
      </AdminGate>
    );
  }

  if (isEdit && !fabricLoading && !fabric) {
    return (
      <AdminGate>
        <Page>
          <Placeholder header="Ткань не найдена" description="Вернитесь к списку" />
        </Page>
      </AdminGate>
    );
  }

  return (
    <AdminGate>
      <Page>
        <div className={classNames(page.page, page.pageForm)}>
          <PageHeader
            title={isEdit ? 'Редактировать ткань' : 'Новая ткань'}
            lead="Фото, название, материал и цена за метр"
          />

          <AdminTopActions backTo="/admin/fabrics" />

          <form className={form.orderForm} onSubmit={(e) => void handleSubmit(e)}>
            <ImageUploadField
              label="Фото образца"
              imageUrl={values.imageUrl || null}
              onFileSelect={(file) => void handleImage(file)}
              error={imageError}
              hint={uploading ? 'Загрузка…' : undefined}
            />

            <div className={form.field}>
              <label className={form.fieldLabel} htmlFor="fabric-name">
                Название
              </label>
              <input
                id="fabric-name"
                className={form.fieldInput}
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                required
              />
            </div>

            <div className={form.field}>
              <label className={form.fieldLabel} htmlFor="fabric-material">
                Материал
              </label>
              <input
                id="fabric-material"
                className={form.fieldInput}
                value={values.material}
                onChange={(e) => setValues((v) => ({ ...v, material: e.target.value }))}
                required
              />
            </div>

            <div className={form.field}>
              <label className={form.fieldLabel} htmlFor="fabric-color">
                Цвет
              </label>
              <input
                id="fabric-color"
                className={form.fieldInput}
                value={values.color}
                onChange={(e) => setValues((v) => ({ ...v, color: e.target.value }))}
                required
              />
            </div>

            <div className={form.field}>
              <label className={form.fieldLabel} htmlFor="fabric-price">
                Цена за метр, ₽
              </label>
              <input
                id="fabric-price"
                type="number"
                min={0}
                className={form.fieldInput}
                value={values.pricePerMeter || ''}
                onChange={(e) =>
                  setValues((v) => ({ ...v, pricePerMeter: Number(e.target.value) || 0 }))
                }
                required
              />
            </div>

            <div className={form.field}>
              <label className={form.fieldLabel} htmlFor="fabric-description">
                Описание
              </label>
              <textarea
                id="fabric-description"
                className={form.fieldTextarea}
                value={values.description ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className={form.field}>
              <label className={form.fieldLabel}>
                <input
                  type="checkbox"
                  checked={Boolean(values.petFriendly)}
                  onChange={(e) => setValues((v) => ({ ...v, petFriendly: e.target.checked }))}
                />{' '}
                Подходит для домашних животных
              </label>
            </div>

            {submitError && <p className={form.fieldError}>{submitError}</p>}

            <div className={actions.actions}>
              <button
                type="submit"
                className={classNames(btn.btn, btn.btnPrimary)}
                disabled={submitting || uploading}
              >
                {submitting ? 'Сохранение…' : 'Сохранить'}
              </button>
              <Link to="/admin/fabrics" className={classNames(btn.btn, btn.btnSecondary)}>
                Отмена
              </Link>
            </div>
          </form>
        </div>
      </Page>
    </AdminGate>
  );
};
