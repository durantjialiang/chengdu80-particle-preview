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
            {t(b('INTERNATIONAL ACADEMIC EXCHANGE', '国际学术交流'))}
          </p>
          <h2 id="academic-exchange-title">
            {t(
              b(
                'Global minds.\nIn conversation in Chengdu.',
                '与国际学者，\n在成都面对面。',
              ),
            )}
          </h2>
        </div>
        <div className={styles.intro}>
          <p>
            {t(
              b(
                'A Nobel laureate, leading economists and a science storyteller. Meet the people who have joined the academic conversations around Chengdu 80.',
                '诺奖得主、经济学家与科学传播者，共同走进成都八零的学术交流现场。',
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
                <p className={styles.distinction}>{t(person.distinction)}</p>
                <h3>{t(person.name)}</h3>
                {language === 'zh' && (
                  <p className={styles.latinName}>{person.name.en}</p>
                )}
                <p className={styles.affiliation}>{t(person.affiliation)}</p>
                <p className={styles.cardRole}>{t(person.role)}</p>
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
            {t(b('PEOPLE BEHIND THE EXCHANGE', '国际学术交流'))}
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
              'Research, dialogue and shared experience connect Chengdu 80 to a wider academic community. These photographs record talks and conversations at the SWUFE & CDAR 2019 International FinTech Forum and its associated activities.',
              '研究、对话与经验分享，连接成都八零与更广泛的国际学术社群。这组照片记录了SWUFE & CDAR 2019国际金融科技论坛及同期活动中的演讲与交流。',
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
              <p className={styles.distinction}>{t(person.distinction)}</p>
              <h3>{t(person.name)}</h3>
              {language === 'zh' && (
                <p className={styles.latinName}>{person.name.en}</p>
              )}
              <p className={styles.profileAffiliation}>
                {t(person.affiliation)}
              </p>
              <p className={styles.profileRole}>{t(person.role)}</p>
              <p className={styles.biography}>{t(person.biography)}</p>
              <ul className={styles.honors}>
                {person.highlights.map((item) => (
                  <li key={item.en}>{t(item)}</li>
                ))}
              </ul>
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
