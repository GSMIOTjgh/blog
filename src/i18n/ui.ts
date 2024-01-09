export const languages = {
  en: "English"
} as const;

export type Language = keyof typeof languages;

export const defaultLang = 'en';

export const ui = {
  en: {
    '404.desc': '관련된 문서를 찾을 수 없습니다.',
    'nav.title': '나의 공간',
    'nav.note': 'Archive',
    'nav.note.desc': '필요할 때 꺼내보는',
    'nav.craft': '공방',
    'nav.craft.desc': '무언가 흥미로운 것을 만드는 공간',
    'index.name': '진건희',
    'index.desc':
      `<p>항상 사람과 <b>교류</b>하고 <b>성장</b>에 기쁨을 느끼는 개발자 진건희입니다.</p>` +
      `<p>남들과 소통하며 얻는 <b>새로운</b> 지식을 경험하고, 공유하며 성장합니다.</p>`,
    'index.currentWork':
      `<p>프론트 엔드 개발자이며 디자인에도 관심을 두고 있습니다,</p>` +
      `<p>현재 <b><a class="external-link" href="https://github.com/kody-gsm" target="_blank">Kody</a></b>에 소속되어 있습니다.</p>`,
  },
} satisfies Record<Language, { [key: string]: string }>;
