import { type FC, useMemo, useState } from 'react';

import { FabricCard } from '@/components/FabricCard/FabricCard';
import { FabricGridSkeleton } from '@/components/FabricGridSkeleton/FabricGridSkeleton';
import { Link } from '@/components/Link/Link';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Page } from '@/components/Page';
import { StaffEntryButton } from '@/components/StaffEntryButton/StaffEntryButton';
import { classNames } from '@/css/classnames';
import { useFabrics } from '@/hooks/useFabrics';
import btn from '@/ui/Button.module.scss';
import chip from '@/ui/Chip.module.scss';
import empty from '@/ui/EmptyState.module.scss';
import grid from '@/ui/FabricGrid.module.scss';
import page from '@/ui/Page.module.scss';
import { Placeholder } from '@telegram-apps/telegram-ui';

export const FabricsPage: FC = () => {
  const { fabrics, loading, error } = useFabrics();
  const [materialFilter, setMaterialFilter] = useState<string | null>(null);

  const materials = useMemo(
    () => [...new Set(fabrics.map((f) => f.material))].sort(),
    [fabrics],
  );

  const filtered = useMemo(() => {
    if (!materialFilter) {
      return fabrics;
    }
    return fabrics.filter((f) => f.material === materialFilter);
  }, [fabrics, materialFilter]);

  if (loading) {
    return (
      <Page>
        <div className={page.page}>
          <PageHeader
            title="Каталог тканей"
            lead="Крупные образцы — оцените фактуру и оттенок перед выбором"
          />
          <FabricGridSkeleton />
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Placeholder
          header="Не удалось загрузить каталог"
          description="Проверьте интернет и обновите страницу. Если ошибка останется, напишите мастеру."
        />
      </Page>
    );
  }

  if (fabrics.length === 0) {
    return (
      <Page>
        <Placeholder
          header="Каталог пока пуст"
          description="Скоро здесь появятся образцы тканей. Пока можно оставить заявку и обсудить варианты с мастером."
        />
      </Page>
    );
  }

  return (
    <Page>
      <div className={page.page}>
        <StaffEntryButton />
        <PageHeader
          title="Каталог тканей"
          lead="Крупные образцы — оцените фактуру и оттенок перед выбором"
          compact={materials.length > 1}
        />

        {materials.length > 1 && (
          <div className={chip.chipRow} role="tablist" aria-label="Фильтр по материалу">
            <button
              type="button"
              role="tab"
              aria-selected={materialFilter === null}
              className={classNames(chip.chip, materialFilter === null && chip.chipActive)}
              onClick={() => setMaterialFilter(null)}
            >
              Все
            </button>
            {materials.map((material) => (
              <button
                key={material}
                type="button"
                role="tab"
                aria-selected={materialFilter === material}
                className={classNames(
                  chip.chip,
                  materialFilter === material && chip.chipActive,
                )}
                onClick={() => setMaterialFilter(material)}
              >
                {material}
              </button>
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className={grid.grid} role="list">
            {filtered.map((fabric) => (
              <div key={fabric.id} role="listitem">
                <FabricCard fabric={fabric} />
              </div>
            ))}
          </div>
        ) : (
          <div className={empty.empty}>
            <p className={empty.emptyTitle}>В этой категории пока нет тканей</p>
            <p className={empty.emptyText}>
              Выберите другой материал или посмотрите весь каталог
            </p>
            <Link
              to="/order"
              className={classNames(btn.btn, btn.btnSecondaryOutlined, empty.emptyAction)}
            >
              Оставить заявку
            </Link>
          </div>
        )}
      </div>
    </Page>
  );
};
