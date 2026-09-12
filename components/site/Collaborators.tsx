import { useState } from 'react';
import { ArrowUpRight, Expand } from 'lucide-react';
import { bilingual as b } from '@/content/competition';
import type { ArchiveImage } from '@/content/archive-media';
import {
  collaborators,
  publicCollaboratorImages,
} from '@/content/collaborators';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { Photo, Viewer } from './ArchiveGallery';
import styles from './Collaborators.module.css';

export function FeaturedCollaborators() {
  const { t, href, language } = useSiteLanguage();
  return (
    <section
      className={styles.section}
      id="academic-exchange"
      data-particle-reading-region
      aria-labelledby="academic-exchange-title"
    >
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>
            {t(b('PAST INTERNATIONAL EXCHANGES', '往届交流 · 2019 / 2021'))}
          </p>
          <h2 id="academic-exchange-title">
            {t(b('Academic exchange in Chengdu', '往届国际学术交流'))}
          </h2>
        </div>
        <div className={styles.intro}>
          <p>
            {t(
              b(
                'Documented forum speakers and a science communicator from Chengdu 80’s associated academic exchange.',
                '记录与成都八零相关的往届国际学术交流：论坛嘉宾与科学传播者。',
              ),
            )}
          </p>
          <a
            className={styles.textLink}
            href={href('/partners/#academic-collaborators')}
          >
            {t(b('Meet our collaborators', '了解学术伙伴与交流嘉宾'))}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </header>
      <div className={styles.featuredGrid}>
        {collaborators.map((person) => {
          const image = publicCollaboratorImages.find(
            (item) => item.id === person.photoIds[0],
          )!;
          return (
            <a
              key={person.id}
              className={styles.featuredCard}
              href={href(`/partners/#${person.id}`)}
              data-featured-collaborator={person.id}
            >
              <div className={styles.featuredPhoto}>
                <Photo image={image} />
              </div>
              <div className={styles.featuredCopy}>
                <div className={styles.honorBadge}>
                  <p className={styles.honorLabel}>
                    {t(
                      person.id === 'brady-haran'
                        ? b('Creative work', '创作身份')
                        : person.id === 'robert-anderson'
                          ? b('Academic role', '学术职务')
                          : b('Honors', '荣誉'),
                    )}
                  </p>
                  <p className={styles.distinction}>{t(person.distinction)}</p>
                </div>
                <h3>{t(person.name)}</h3>
                {language === 'zh' && (
                  <p className={styles.latinName}>{person.name.en}</p>
                )}
                <p className={styles.affiliation}>{t(person.affiliation)}</p>
                <p className={styles.cardRole}>{t(person.role)}</p>
                <div className={styles.activityPreview}>
                  <p className={styles.activityLabel}>
                    {t(b('Participation', '交流活动'))}
                  </p>
                  <ul className={styles.activityList}>
                    {person.activities.map((activity) => (
                      <li key={`${activity.year}-${activity.event.en}`}>
                        <span className={styles.activityYear}>
                          {activity.year}
                        </span>
                        <div>
                          <strong className={styles.activityFormat}>
                            {t(activity.format)}
                          </strong>
                          <span className={styles.activityEvent}>
                            {t(activity.event)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <span className={styles.cardLink}>
                  {t(b('Profile & photographs', '人物介绍与现场照片'))}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default function Collaborators() {
  const { t, language } = useSiteLanguage();
  const [selected, setSelected] = useState<{
    items: readonly ArchiveImage[];
    index: number;
  } | null>(null);
  const photo = (id: string, ids: readonly string[], primary = false) => {
    const items = ids.flatMap((imageId) =>
      publicCollaboratorImages.filter((image) => image.id === imageId),
    );
    const index = items.findIndex((item) => item.id === id);
    const item = items[index];
    if (!item) return null;
    return (
      <button
        type="button"
        className={styles.photo}
        onClick={() => setSelected({ items, index })}
        aria-label={`${t(b('View photo', '查看照片'))} · ${t(item.caption)}`}
      >
        <Photo image={item} full={primary} />
        <span className={styles.photoControl}>
          {primary && <span>{t(b('2019 · On site', '2019 · 交流现场'))}</span>}
          <Expand size={18} aria-hidden="true" />
        </span>
      </button>
    );
  };
  return (
    <section
      id="academic-collaborators"
      className={styles.section}
      data-particle-reading-region
      aria-labelledby="academic-collaborators-title"
    >
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>
            {t(b('PAST INTERNATIONAL EXCHANGES', '往届交流 · 2019 / 2021'))}
          </p>
          <h2 id="academic-collaborators-title">
            {t(
              b(
                'Academic partners\n& visiting voices.',
                '学术伙伴与\n交流嘉宾。',
              ),
            )}
          </h2>
        </div>
        <p className={styles.intro}>
          {t(
            b(
              'These profiles separate documented activities from academic honors. All supplied photographs shown here are from the 2019 exchange.',
              '以下人物档案将有据可查的活动与学术荣誉分开呈现；这里的现有照片均为2019年交流现场。',
            ),
          )}
        </p>
      </header>
      <nav
        className={styles.peopleNav}
        aria-label={t(b('Collaborator profiles', '人物介绍导航'))}
      >
        {collaborators.map((person) => (
          <a key={person.id} href={`#${person.id}`}>
            {t(person.name)}
          </a>
        ))}
        <a href="#international-partners">
          {t(b('Partner institutions', '查看合作单位'))} ↗
        </a>
      </nav>
      <div className={styles.profileList}>
        {collaborators.map((person) => (
          <article
            key={person.id}
            id={person.id}
            className={styles.profile}
            data-collaborator={person.id}
          >
            <div className={styles.profileImages}>
              {photo(person.photoIds[0], person.photoIds, true)}
              <div className={styles.photoStrip}>
                {person.photoIds.slice(1).map((id) => (
                  <div key={id}>{photo(id, person.photoIds)}</div>
                ))}
              </div>
              <p className={styles.photoNote}>
                {t(
                  b(
                    'Photographs from the 2019 exchange · Click to enlarge',
                    '2019交流现场 · 点击照片查看大图',
                  ),
                )}
              </p>
            </div>
            <div className={styles.profileCopy}>
              <div className={styles.honorBadge}>
                <p className={styles.honorLabel}>
                  {t(
                    person.id === 'brady-haran'
                      ? b('Creative work', '创作身份')
                      : person.id === 'robert-anderson'
                        ? b('Academic role', '学术职务')
                        : b('Honors', '荣誉'),
                  )}
                </p>
                <p className={styles.distinction}>{t(person.distinction)}</p>
              </div>
              <h3>{t(person.name)}</h3>
              {language === 'zh' && (
                <p className={styles.latinName}>{person.name.en}</p>
              )}
              <p className={styles.profileAffiliation}>
                {t(person.affiliation)}
              </p>
              <p className={styles.profileRole}>{t(person.role)}</p>
              <p className={styles.biography}>{t(person.biography)}</p>
              <section
                className={styles.activities}
                aria-labelledby={`${person.id}-activities`}
              >
                <h4 id={`${person.id}-activities`}>
                  {t(b('Participation', '交流活动'))}
                </h4>
                <ul className={styles.activityList}>
                  {person.activities.map((activity) => (
                    <li key={`${activity.year}-${activity.event.en}`}>
                      <span className={styles.activityYear}>
                        {activity.year}
                      </span>
                      <div>
                        <strong className={styles.activityFormat}>
                          {t(activity.format)}
                        </strong>
                        <p className={styles.activityEvent}>
                          {t(activity.event)}
                        </p>
                        <a
                          className={styles.activitySource}
                          href={activity.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t(activity.source.label)}
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
              <section
                className={styles.honorsBlock}
                aria-labelledby={`${person.id}-honors`}
              >
                <h4 id={`${person.id}-honors`}>
                  {t(b('Appointments & honors', '任职与荣誉'))}
                </h4>
                <ul className={styles.honors}>
                  {person.highlights.map((item) => (
                    <li key={item.en}>{t(item)}</li>
                  ))}
                </ul>
              </section>
              <div className={styles.connection}>
                <h4>{t(b('With Chengdu 80', '与成都八零的交流'))}</h4>
                <p>{t(person.connection)}</p>
              </div>
              <div className={styles.sources}>
                {person.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t(source.label)}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      <figure className={styles.groupPhoto}>
        {photo('collab-2019-forum-group', ['collab-2019-forum-group'], true)}
        <figcaption>
          {t(
            b(
              'SWUFE & CDAR 2019 International FinTech Forum · Participants together in Chengdu',
              'SWUFE & CDAR 2019国际金融科技论坛 · 相聚成都',
            ),
          )}
        </figcaption>
      </figure>
      {selected !== null && (
        <Viewer
          items={selected.items}
          initial={selected.index}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
