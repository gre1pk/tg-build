import type { FC } from 'react';
import { useParams } from 'react-router-dom';

import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';
import { classNames } from '@/css/classnames';
import { formatPricePerMeter } from '@/helpers/formatPrice';
import { useFabric } from '@/hooks/useFabrics';
import actions from '@/ui/Actions.module.scss';
import btn from '@/ui/Button.module.scss';
import page from '@/ui/Page.module.scss';
import sk from '@/ui/Skeleton.module.scss';
import tag from '@/ui/Tag.module.scss';
import { Placeholder } from '@telegram-apps/telegram-ui';

import detail from './FabricDetailPage.module.scss';

export const FabricDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fabric, loading, error } = useFabric(id);

  if (loading) {
    return (
      <Page>
        <div className={page.page}>
          <div className={`${sk.block} ${sk.square} ${detail.image}`} />
          <div className={detail.body}>
            <div className={`${sk.block} ${sk.line} ${sk.detailTitle}`} />
            <div className={`${sk.block} ${sk.line} ${sk.short} ${sk.detailPrice}`} />
            <div className={`${sk.block} ${sk.line} ${sk.detailDesc}`} />
          </div>
        </div>
      </Page>
    );
  }

  if (error || !fabric) {
    return (
      <Page>
        <Placeholder
          header="Ткань не найдена"
          description={
            error ?? 'Образец мог быть удалён из каталога. Вернитесь к списку и выберите другую ткань.'
          }
        />
      </Page>
    );
  }

  return (
    <Page>
      <div className={classNames(page.page, page.pageDetail)}>
        <img
          src={fabric.imageUrl}
          alt={`Образец ткани ${fabric.name}, ${fabric.color}`}
          className={detail.image}
          width={600}
          height={450}
        />
        <div className={detail.body}>
          <h1 className={detail.title}>{fabric.name}</h1>
          <p className={detail.price}>{formatPricePerMeter(fabric.pricePerMeter)}</p>
          <div className={detail.tags} aria-label="Характеристики">
            <span className={tag.tag}>{fabric.material}</span>
            <span className={tag.tag}>{fabric.color}</span>
            {fabric.petFriendly && (
              <span className={tag.tag}>Подходит для дома с питомцами</span>
            )}
          </div>
          {fabric.description && <p className={detail.desc}>{fabric.description}</p>}
        </div>
        <div className={classNames(actions.actions, actions.actionsSticky)}>
          <Link to={`/order?fabricId=${fabric.id}`} className={classNames(btn.btn, btn.btnPrimary)}>
            Оставить заявку с этой тканью
          </Link>
        </div>
      </div>
    </Page>
  );
};
