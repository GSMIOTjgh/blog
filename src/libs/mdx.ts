import { getCollection, type CollectionEntry } from 'astro:content';

import type { Language } from '~/i18n/ui';

import { isDev } from './utils';

/** utils */

export const isDraft = (post: CollectionEntry<'post'>) => {
  return isDev || !post.data.draft;
};

export const isWriting = (post: { slug: string }) => {
  return post.slug.includes('/writing/');
};

export const isNote = (post: { slug: string }) => {
  return post.slug.includes('/note/');
};

export const getPostType = (post: { slug: string }) => {
  if (isWriting(post)) return 'writing';
  if (isNote(post)) return 'note';

  Error('post slug is invalid...');
};

// 최신순
export const sortCollectionDateDesc = (
  a: CollectionEntry<'post'>,
  b: CollectionEntry<'post'>,
) => {
  return new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf();
};

export const sortDateDesc = (
  a: { date: string | Date | number },
  b: { date: string | Date | number },
) => {
  return new Date(b.date).valueOf() - new Date(a.date).valueOf();
};

export const sortCollectionDateAsc = (
  a: CollectionEntry<'post'>,
  b: CollectionEntry<'post'>,
) => {
  return new Date(a.data.date).valueOf() - new Date(b.data.date).valueOf();
};

/**
 * 글 경로 조정
 * @example ko/note/svelte-useEffect -> svelte-useEffect
 * @example en/note/svelte-useEffect -> en/svelte-useEffect
 */
export const resolveSlug = (slug: string) => {
  let result = slug.replace('/', '');

  if (slug.startsWith('/')) {
    result = result.replace('/', '');
  }

  return result;
};

/** 전체 글 정보 */
export const getPostCollection = async () => {
  return (await getCollection('post'))
    .filter(isDraft)
    .sort(sortCollectionDateDesc);
};

export type PostInfo = {
  title: string;
  description: string;
  href: string;
  date: string | Date;
  lang: Language;
  isExternal?: boolean;
};

/** table-of-content */
export type TOCSection = TOCSubSection & {
  subSections: TOCSubSection[];
};

export type TOCSubSection = {
  slug: string;
  text: string;
};

export const parseToc = (source: string) => {
  return source
    .split('\n')
    .filter((line) => line.match(/(^#{1,3})\s/))
    .reduce<TOCSection[]>((ac, rawHeading) => {
      const nac = [...ac];
      const removeMdx = rawHeading
        .replace(/^##*\s/, '')
        .replace(/[\*,\~]{2,}/g, '')
        .replace(/(?<=\])\((.*?)\)/g, '')
        .replace(/(?<!\S)((http)(s?):\/\/|www\.).+?(?=\s)/g, '');

      const section = {
        slug: removeMdx
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣 -]/g, '')
          .replace(/\s/g, '-'),
        text: removeMdx,
      };

      const isSubTitle = rawHeading.split('#').length - 1 === 3;

      if (ac.length && isSubTitle) {
        nac.at(-1)?.subSections.push(section);
      } else {
        nac.push({ ...section, subSections: [] });
      }

      return nac;
    }, []);
};

/** 글 파싱 */
export const contentToDescription = (content: string) => {
  const parsedContent = content
    .replace(/(?<=\])\((.*?)\)/g, '')
    .replace(/(?<!\S)((http)(s?):\/\/|www\.).+?(?=\s)/g, '')
    .replace(/[#*\|\[\]]|(\-{3,})|(`{3})(\S*)(?=\s)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 157);

  return `${parsedContent}...`;
};
