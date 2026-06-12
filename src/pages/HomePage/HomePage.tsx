import { type FC, useState } from 'react';

import { useAuth } from '@/auth/useAuth';
import { FabricGridSkeleton } from '@/components/FabricGridSkeleton/FabricGridSkeleton';
import { FabricPreviewCard } from '@/components/FabricPreviewCard/FabricPreviewCard';
import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';
import { PortfolioCard } from '@/components/PortfolioCard/PortfolioCard';
import { classNames } from '@/css/classnames';
import {
  MasterContactNotConfiguredError,
  openMasterContact,
} from '@/helpers/openMasterContact';
import { useFabrics } from '@/hooks/useFabrics';
import { usePortfolio } from '@/hooks/usePortfolio';
import btn from '@/ui/Button.module.scss';
import page from '@/ui/Page.module.scss';
import scroll from '@/ui/ScrollRow.module.scss';
import section from '@/ui/Section.module.scss';
import sk from '@/ui/Skeleton.module.scss';
import textLink from '@/ui/TextLink.module.scss';
import { Placeholder } from '@telegram-apps/telegram-ui';

import preview from '@/components/FabricPreviewCard/FabricPreviewCard.module.scss';
import home from './HomePage.module.scss';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80';

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

  const handleAskMaster = () => {
    setContactError(null);
    try {
      openMasterContact('Здравствуйте! Хочу перетянуть мебель. Подскажите, с чего начать?');
    } catch (error) {
      if (error instanceof MasterContactNotConfiguredError) {
        setContactError('Контакт мастера ещё не настроен. Пока оставьте заявку через форму.');
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
          description="Закройте приложение и откройте его снова из Telegram. Если ошибка повторится, напишите мастеру."
        />
      </Page>
    );
  }

  const greeting = user ? `${user.firstName}, обновим мебель` : 'Обновим вашу мебель';
  const previewFabrics = fabrics.slice(0, 4);

  return (
    <Page back={false}>
      <div className={page.page}>
        <section className={home.hero} aria-label="Перетяжка мебели">
          <img
            src={HERO_IMAGE}
            alt="Интерьер с мягкой мебелью и текстилем"
            className={home.heroImage}
            width={800}
            height={480}
          />
          <div className={home.heroContent}>
            <p className={home.heroEyebrow}>Перетяжка мебели</p>
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
          <button
            type="button"
            className={classNames(textLink.textLink, home.heroContactLink)}
            onClick={handleAskMaster}
          >
            Задать вопрос в Telegram
          </button>
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
              Каталог скоро появится — пока можно написать мастеру.
            </p>
          )}
        </section>

        <section className={section.section} aria-labelledby="portfolio-heading">
          <h2 id="portfolio-heading" className={section.sectionTitle}>
            Примеры работ
          </h2>
          <p className={section.sectionLead}>
            До и после перетяжки — так может выглядеть результат
          </p>
          {portfolioLoading ? (
            <div className={scroll.scrollRow} aria-hidden>
              {[1, 2, 3].map((n) => (
                <div key={n} className={sk.card} style={{ flex: '0 0 min(300px, 85vw)' }}>
                  <div className={`${sk.block} ${sk.line}`} />
                  <div className={`${sk.block} ${sk.square}`} style={{ marginTop: 8 }} />
                </div>
              ))}
            </div>
          ) : portfolio.length > 0 ? (
            <div className={scroll.scrollRow}>
              {portfolio.map((item) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
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
