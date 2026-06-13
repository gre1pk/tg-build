import { type FC, useState } from 'react';

import { useAuth } from '@/auth/useAuth';
import { BeforeAfterCompare } from '@/components/BeforeAfterCompare/BeforeAfterCompare';
import { FabricGridSkeleton } from '@/components/FabricGridSkeleton/FabricGridSkeleton';
import { FabricPreviewCard } from '@/components/FabricPreviewCard/FabricPreviewCard';
import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';
import { StaffEntryButton } from '@/components/StaffEntryButton/StaffEntryButton';
import { PortfolioCard } from '@/components/PortfolioCard/PortfolioCard';
import { isMasterContactConfigured } from '@/config/brand';
import { classNames } from '@/css/classnames';
import { MasterContactOpenError, openMasterContact } from '@/helpers/openMasterContact';
import { useFabrics } from '@/hooks/useFabrics';
import { usePortfolio } from '@/hooks/usePortfolio';
import btn from '@/ui/Button.module.scss';
import page from '@/ui/Page.module.scss';
import scroll from '@/ui/ScrollRow.module.scss';
import section from '@/ui/Section.module.scss';
import sk from '@/ui/Skeleton.module.scss';
import textLink from '@/ui/TextLink.module.scss';
import { Placeholder } from '@telegram-apps/telegram-ui';

import { HERO_AFTER_IMAGE, HERO_BEFORE_IMAGE } from '@/content/marketingImagery';
import preview from '@/components/FabricPreviewCard/FabricPreviewCard.module.scss';
import home from './HomePage.module.scss';

const STEPS = [
  {
    title: 'Фото мебели',
    text: 'Оставьте заявку с фото дивана или кресла — мастер оценит объём работ.',
  },
  {
    title: 'Выбор ткани',
    text: 'Посмотрите каталог и укажите понравившийся образец в заявке.',
  },
  {
    title: 'Согласование',
    text: 'Мастер напишет в Telegram со сроками и стоимостью.',
  },
] as const;

export const HomePage: FC = () => {
  const { user, loading, error } = useAuth();
  const { fabrics, loading: fabricsLoading } = useFabrics();
  const { items: portfolio, loading: portfolioLoading } = usePortfolio();
  const [contactError, setContactError] = useState<string | null>(null);

  const masterContactAvailable = isMasterContactConfigured();

  const handleAskMaster = () => {
    setContactError(null);
    try {
      openMasterContact('Здравствуйте! Хочу перетянуть мебель. Подскажите, с чего начать?');
    } catch (error) {
      if (error instanceof MasterContactOpenError) {
        setContactError(error.message);
        return;
      }
      throw error;
    }
  };

  if (loading) {
    return (
      <Page back={false}>
        <div className={page.page}>
          <div className={sk.hero}>
            <div className={`${sk.block} ${sk.square}`} />
          </div>
          <FabricGridSkeleton count={4} />
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page back={false}>
        <Placeholder
          header="Не удалось войти"
          description="Закройте приложение и откройте его снова из Telegram. Если ошибка повторится, попробуйте позже или оставьте заявку через форму."
        />
      </Page>
    );
  }

  const greeting = user ? `${user.firstName}, обновим мебель` : 'Обновим вашу мебель';
  const previewFabrics = fabrics.slice(0, 4);

  return (
    <Page back={false}>
      <div className={page.page}>
        <StaffEntryButton />
        <section className={home.hero} aria-label="Перетяжка мебели">
          <BeforeAfterCompare
            beforeImageUrl={HERO_BEFORE_IMAGE}
            afterImageUrl={HERO_AFTER_IMAGE}
            beforeAlt="Изношенное кресло до перетяжки"
            afterAlt="Обновлённый диван после перетяжки"
            variant="hero"
            imageWidth={400}
            imageHeight={300}
          />
          <div className={home.heroContent}>
            <p className={home.heroEyebrow}>Ручная перетяжка</p>
            <h1 className={home.heroTitle}>{greeting}</h1>
            <p className={home.heroSubtitle}>
              Подберём ткань и вернём мебели аккуратный вид — без долгих звонков и объяснений
            </p>
          </div>
        </section>

        <div className={home.heroActions}>
          <Link
            to="/fabrics"
            className={classNames(btn.btn, btn.btnPrimary, home.heroBtnPrimary)}
          >
            Каталог тканей
          </Link>
          <Link
            to="/order"
            className={classNames(btn.btn, btn.btnSecondary, home.heroBtnSecondary)}
          >
            Оставить заявку
          </Link>
          {masterContactAvailable && (
            <button
              type="button"
              className={classNames(textLink.textLink, home.heroContactLink)}
              onClick={handleAskMaster}
            >
              Задать вопрос в Telegram
            </button>
          )}
          {contactError && (
            <p className={home.heroContactError} role="alert">
              {contactError}
            </p>
          )}
        </div>

        <section
          className={classNames(section.section, section.sectionPrimary)}
          aria-labelledby="preview-heading"
        >
          <h2 id="preview-heading" className={section.sectionTitle}>
            Ткани
          </h2>
          <p className={section.sectionLead}>Крупные образцы — оцените фактуру до выбора</p>
          {fabricsLoading ? (
            <div className={scroll.scrollRow} aria-busy="true" aria-label="Загрузка тканей">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className={classNames(preview.card, preview.skeleton)}>
                  <div className={`${sk.block} ${sk.square} ${preview.previewSkeleton}`} />
                  <div className={`${sk.block} ${sk.line} ${sk.previewLine}`} />
                  <div className={`${sk.block} ${sk.line} ${sk.short}`} />
                </div>
              ))}
            </div>
          ) : previewFabrics.length > 0 ? (
            <>
              <div className={scroll.scrollRow}>
                {previewFabrics.map((fabric) => (
                  <FabricPreviewCard key={fabric.id} fabric={fabric} />
                ))}
              </div>
              <Link to="/fabrics" className={section.sectionLink}>
                Смотреть весь каталог →
              </Link>
            </>
          ) : (
            <p className={section.sectionLead}>
              Каталог скоро появится —{' '}
              <Link to="/order" className={section.sectionLink}>
                оставьте заявку через форму
              </Link>
              .
            </p>
          )}
        </section>

        <section className={section.section} aria-labelledby="portfolio-heading">
          <h2 id="portfolio-heading" className={section.sectionTitle}>
            Примеры работ
          </h2>
          <p className={section.sectionLead}>
            Сравнение «до / после» — так выглядит перетяжка на практике
          </p>
          {portfolioLoading ? (
            <div className={home.portfolioStack} aria-hidden>
              <div className={sk.card}>
                <div className={`${sk.block} ${sk.line}`} />
                <div className={`${sk.block} ${sk.square}`} style={{ marginTop: 8, aspectRatio: '5/2' }} />
              </div>
            </div>
          ) : portfolio.length > 0 ? (
            <div className={home.portfolioStack}>
              <PortfolioCard item={portfolio[0]} variant="featured" />
              {portfolio.length > 1 && (
                <ul className={home.portfolioMore}>
                  {portfolio.slice(1, 3).map((item) => (
                    <li key={item.id}>
                      <PortfolioCard item={item} variant="compact" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className={section.sectionLead}>
              Примеры работ скоро появятся — пока можно посмотреть каталог тканей.
            </p>
          )}
        </section>

        <section className={section.section} aria-labelledby="steps-heading">
          <h2 id="steps-heading" className={section.sectionTitle}>
            Как мы работаем
          </h2>
          <ol className={home.steps}>
            {STEPS.map((step, index) => (
              <li key={step.title} className={home.step}>
                <span className={home.stepNum} aria-hidden>
                  {index + 1}
                </span>
                <p className={home.stepText}>
                  <strong>{step.title}</strong>
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className={classNames(section.section, section.sectionCta)}
          aria-labelledby="cta-heading"
        >
          <h2 id="cta-heading" className={section.sectionTitle}>
            Готовы начать?
          </h2>
          <p className={section.sectionLead}>
            Пришлите фото мебели — мастер оценит работу и подскажет по тканям.
          </p>
          <Link
            to="/order"
            className={classNames(btn.btn, btn.btnPrimary, section.sectionCtaBtn)}
          >
            Оставить заявку
          </Link>
        </section>
      </div>
    </Page>
  );
};
