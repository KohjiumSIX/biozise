export type GameStat = {
  label: string;
  value: string;
};

export type GameHighlight = {
  title: string;
  description?: string;
  videoUrl?: string;
  poster?: string;
};

export type GameConfig =
  | {
      label: string;
      type?: "text";
      value: string;
    }
  | {
      label: string;
      type: "copy";
      value: string;
      copyValue: string;
    }
  | {
      label: string;
      type: "link";
      value: string;
      href: string;
    };

export type GameLink = {
  label: string;
  href: string;
};

export type RankShowcase = {
  current: {
    title: string;
    rr: string;
    placement: string;
    act: string;
    icon: string;
  };
  peak: {
    title: string;
    rr: string;
    placement?: string;
    act: string;
    icon: string;
  };
};

export type GamePageData = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  accentClass: string;
  heroVideo: string;
  stats: GameStat[];
  highlights: GameHighlight[];
  config: GameConfig[];
  heroCaptionEyebrow?: string;
  heroCaptionTitle?: string;
  contentSectionEyebrow?: string;
  contentSectionTitle?: string;
  linksSectionEyebrow?: string;
  linksSectionTitle?: string;
  heroBadge?: string;
  links: GameLink[];
  rankShowcase?: RankShowcase;
};

export const gamesData: Record<string, GamePageData> = {
  valorant: {
    slug: "valorant",
    title: "Valorant",
    eyebrow: "Competitive FPS",
    description:
      "Minha página dedicada ao Valorant, com informações principais, conteúdo e contas competitivas que uso no jogo.",
    accentClass: "game-page-red",
    heroVideo: "/games/valorant.mp4",
    stats: [
      { label: "Role", value: "Flex" },
      { label: "Training", value: "Biomechanic" },
      { label: "Style", value: "Aggressive Control" },
      { label: "Content", value: "VOD + Settings" },
    ],
    highlights: [
      {
        title: "Sessão principal",
        description: "VOD principal desta página.",
        videoUrl:
          "https://www.youtube.com/embed/8-rOkM-fiU8?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1&start=310",
        poster: "https://i.ytimg.com/vi/8-rOkM-fiU8/maxresdefault.jpg",
      },
    ],
    config: [
      {
        label: "Crosshair",
        type: "copy",
        value: "Copiar código",
        copyValue: "0;P;d;1;f;0;0l;2;0v;2;0g;1;0o;1;0f;0;1b;0",
      },
      { label: "DPI", value: "1600" },
      { label: "Sens", value: "0.18" },
      { label: "Polling Rate", value: "8000" },
      { label: "Mouse RT", value: "1" },
      {
        label: "Config de vídeo",
        type: "link",
        value: "Abrir imagem",
        href: "https://prnt.sc/QrwCbEZHrHPl",
      },
      { label: "Key RT", value: "0.001ms" },
    ],
    linksSectionEyebrow: "Contas",
    linksSectionTitle: "Riot IDs / Tracker",
    links: [
      {
        label: "Need#Demon",
        href: "https://tracker.gg/valorant/profile/riot/Need%23Demon/overview?platform=pc&playlist=competitive&season=3ea2b318-423b-cf86-25da-7cbb0eefbe2d",
      },
      {
        label: "Vgg#444",
        href: "https://tracker.gg/valorant/profile/riot/vgg%23444/overview?platform=pc&playlist=competitive&season=3ea2b318-423b-cf86-25da-7cbb0eefbe2d",
      },
      {
        label: "ファンティーニ#0101",
        href: "https://tracker.gg/valorant/profile/riot/%E3%83%95%E3%82%A1%E3%83%B3%E3%83%86%E3%82%A3%E3%83%BC%E3%83%8B%230101/overview?platform=pc&playlist=competitive&season=9d85c932-4820-c060-09c3-668636d4df1b",
      },
    ],
    rankShowcase: {
      current: {
        title: "Immortal 2",
        rr: "146RR",
        placement: "#670",
        act: "V25: A6",
        icon: "/imt2.png",
      },
      peak: {
        title: "Radiant",
        rr: "434rr",
        act: "V25: A6 - #60",
        icon: "/radiante.png",
      },
    },
  },

  lol: {
    slug: "lol",
    title: "League of Legends",
    eyebrow: "MOBA",
    description:
      "Minha página dedicada ao League of Legends, focada no meu perfil competitivo, champion pool e principais informações de jogo.",
    accentClass: "game-page-gold",
    heroVideo: "/games/lol.mp4",
    heroCaptionEyebrow: "Perfil competitivo",
    heroCaptionTitle: "Champion pool, estilo e informações",
    contentSectionEyebrow: "Perfil",
    contentSectionTitle: "Player profile",
    heroBadge: "Ex pro player pela Vital Academy",
    stats: [
      { label: "Role", value: "Mid" },
      { label: "Second Role", value: "ADC" },
      { label: "Style", value: "Passive Control" },
      { label: "Peak", value: "Challenger Top 87" },
    ],
    highlights: [
      {
        title: "Main Role",
        description:
          "Atuo principalmente como Mid, com foco em controle de wave, scaling e decisões consistentes ao longo da partida.",
      },
      {
        title: "Champion Pool",
        description:
          "Meus campeões principais são Vladimir e Aurora, priorizando picks com impacto progressivo, boa pressão lateral e teamfight sólida.",
      },
    ],
    config: [
      { label: "Role", value: "Mid" },
      { label: "Second Role", value: "ADC" },
      { label: "Main Champions", value: "Vladimir, Aurora" },
      { label: "Style", value: "Passive Control" },
      { label: "Resolution", value: "1920x1080" },
      {
        label: "OP.GG",
        type: "link",
        value: "Abrir perfil",
        href: "https://op.gg/pt/lol/summoners/br/Need-Demon",
      },
    ],
    linksSectionEyebrow: "Conta",
    linksSectionTitle: "Acesso rápido",
    links: [],
  },
};

export function getGameBySlug(slug: string) {
  return gamesData[slug];
}