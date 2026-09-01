export type WorldId = "barberia" | "fries" | "slush" | "arepas" | "rent" | "licores" | "vapers";

export interface WorldTheme {
  bg: string;
  bgAlt: string;
  accent: string;
  accentSoft: string;
  text: string;
  textMuted: string;
  border: string;
}

export interface WorldMedia {
  heroVideo?: string;
  heroImage: string;
  cardImage: string;
}

export interface WorldContact {
  addresses?: { label: string; line: string; mapsUrl?: string }[];
  phone?: string;
  hours?: string;
  whatsapp?: string;
  instagram: { handle: string; url: string };
}

export interface WorldConfig {
  id: WorldId;
  slug: `/${string}`;
  name: string;
  shortName: string;
  emoji: string;
  tagline: string;
  description: string;
  theme: WorldTheme;
  media: WorldMedia;
  contact: WorldContact;
  cta: { label: string; href?: string };
  /** Hotspot position on the portal map image, as % of image width/height */
  hotspot: { x: number; y: number; w: number; h: number };
  status: "live" | "comingSoon";
}

export const MASTER_GRADIENT = {
  from: "#a855f7",
  via: "#ec4899",
  to: "#f59e0b",
} as const;

export const worlds: Record<WorldId, WorldConfig> = {
  barberia: {
    id: "barberia",
    slug: "/barberia",
    name: "Trinity Barbería",
    shortName: "Barbería",
    emoji: "✂️",
    tagline: "Cortes de otro nivel",
    description:
      "Barbería premium en Bucaramanga. Cortes clásicos y modernos, luces cálidas y una experiencia que se siente distinta desde que te sientas en la silla.",
    theme: {
      bg: "#0a0a0a",
      bgAlt: "#151515",
      accent: "#d4af37",
      accentSoft: "rgba(212, 175, 55, 0.16)",
      text: "#f5f5f5",
      textMuted: "#9c9c9c",
      border: "rgba(245, 245, 245, 0.14)",
    },
    media: {
      heroImage: "/media/barberia/hero-team.png",
      cardImage: "/media/barberia/hero-team.png",
    },
    contact: {
      addresses: [
        {
          label: "Cabecera",
          line: "Cra 38 #46-147, Cabecera",
          mapsUrl:
            "https://www.google.com/maps/place/Trinity/@7.1173249,-73.1082259,3a,75y,90t/data=!3m8!1e2!3m6!1sCIHM0ogKEICAgMCA8PDykgE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAHRPTWl9znJ8WrcZ4FTY0Xy7-FvsvcrBgQTdB20c_7Z5rNzIcnQl6gS8_M0Z-Gfoyivu2hL9iR_6kaShjO5Z3bRGgahHZ3auQqIIdUd0OPssdnDcxXOz_2ErVtkFTh0v6Lw9E7octleM%3Dw203-h270-k-no!7i3024!8i4032!4m11!1m2!2m1!1sCra+38+%2346-147,+Cabecera,+Bucaramanga,+Colombia!3m7!1s0x8e683f9aba468c63:0x9df03bff51bb399e!8m2!3d7.1173242!4d-73.1081634!10e5!15sCi9DcmEgMzggIzQ2LTE0NywgQ2FiZWNlcmEsIEJ1Y2FyYW1hbmdhLCBDb2xvbWJpYZIBC2JhcmJlcl9zaG9w4AEA!16s%2Fg%2F11x1zck1w1?hl=es&entry=ttu",
        },
      ],
      phone: "3246027086",
      hours: "Lunes a Sábado · 10am – 8pm",
      whatsapp: "573246027086",
      instagram: { handle: "@trinity_bga", url: "https://instagram.com/trinity_bga" },
    },
    cta: { label: "Agenda tu cita" },
    hotspot: { x: 9, y: 0, w: 40, h: 34 },
    status: "live",
  },
  fries: {
    id: "fries",
    slug: "/fries",
    name: "TriniFries",
    shortName: "Fries",
    emoji: "🍟",
    tagline: "Crispy. Golden. Perfect.",
    description:
      "Papas fritas premium, doradas y crujientes, con toppings y salsas de la casa. La energía del universo Trinity en cada bocado.",
    theme: {
      bg: "#1a0f05",
      bgAlt: "#241407",
      accent: "#e8442a",
      accentSoft: "rgba(232, 68, 42, 0.18)",
      text: "#fff8e1",
      textMuted: "#d9b98c",
      border: "rgba(255, 200, 87, 0.18)",
    },
    media: {
      heroImage: "/media/fries/hero.png",
      cardImage: "/media/fries/hero.png",
    },
    contact: {
      addresses: [
        {
          label: "Av. La Rosita",
          line: "Av. La Rosita, Barrio Bolívar",
          mapsUrl:
            "https://www.google.com/maps/place/Trinifries/@7.1175445,-73.1183064,3a,75y,290.37h,90.71t/data=!3m7!1e1!3m5!1s4YzvM9RUencFD8YfnZa9NA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-0.7084320010136906%26panoid%3D4YzvM9RUencFD8YfnZa9NA%26yaw%3D290.3682531820629!7i16384!8i8192!4m6!3m5!1s0x8e683f6fd7b527d1:0xa617f0478e4ed074!8m2!3d7.1174616!4d-73.1184393!16s%2Fg%2F11xrvmlsq5?hl=es&entry=ttu",
        },
      ],
      whatsapp: "573125532900",
      instagram: { handle: "@trinifries_bga", url: "https://instagram.com/trinifries_bga" },
    },
    cta: { label: "Pedir ahora" },
    hotspot: { x: 56, y: 0, w: 44, h: 33 },
    status: "live",
  },
  slush: {
    id: "slush",
    slug: "/slush",
    name: "TriniSlush",
    shortName: "Slush",
    emoji: "🥤",
    tagline: "Refréscate distinto",
    description:
      "Bebidas heladas y refrescantes, hechas para el calor de Bucaramanga. Cristales de hielo, sabores intensos y una sensación que despierta.",
    theme: {
      bg: "#051423",
      bgAlt: "#08213a",
      accent: "#38bdf8",
      accentSoft: "rgba(56, 189, 248, 0.18)",
      text: "#eaf6ff",
      textMuted: "#8fb7cc",
      border: "rgba(148, 217, 255, 0.18)",
    },
    media: {
      heroImage: "/media/slush/hero.png",
      cardImage: "/media/slush/hero.png",
    },
    contact: {
      instagram: { handle: "@trinislush", url: "https://instagram.com/trinislush" },
    },
    cta: { label: "Síguenos" },
    hotspot: { x: 0, y: 33, w: 34, h: 44 },
    status: "live",
  },
  arepas: {
    id: "arepas",
    slug: "/arepas",
    name: "TriniArepas",
    shortName: "Arepas",
    emoji: "🌮",
    tagline: "Tradición con estilo",
    description:
      "Arepas con sabor a casa, en un ambiente que mezcla tradición colombiana con diseño moderno. Comfort food, elevado.",
    theme: {
      bg: "#1b120a",
      bgAlt: "#24170d",
      accent: "#c9812f",
      accentSoft: "rgba(201, 129, 47, 0.18)",
      text: "#f5ead9",
      textMuted: "#bfa07e",
      border: "rgba(201, 129, 47, 0.2)",
    },
    media: {
      heroImage: "/media/arepas/hero.png",
      cardImage: "/media/arepas/hero.png",
    },
    contact: {
      addresses: [
        {
          label: "Av. La Rosita",
          line: "Av. La Rosita N22-99, Barrio Bolívar",
          mapsUrl:
            "https://www.google.com/maps/place/TriniArepas/@7.1173374,-73.1187748,3a,63.7y,15.66h,94.67t/data=!3m7!1e1!3m5!1s6mwDgX1hpBZeM3aBiXi3zA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-4.667024438757508%26panoid%3D6mwDgX1hpBZeM3aBiXi3zA%26yaw%3D15.6635104183276!7i16384!8i8192!4m10!1m2!2m1!1striny+arepas!3m6!1s0x8e683f00793503cd:0xaec1b81becadce30!8m2!3d7.1175545!4d-73.1186345!15sCgx0cmlueSBhcmVwYXNaDiIMdHJpbnkgYXJlcGFzkgEKcmVzdGF1cmFudOABAA!16s%2Fg%2F11z8rp68fc?hl=es&entry=ttu",
        },
      ],
      whatsapp: "573170604705",
      instagram: { handle: "@triniarepas_", url: "https://instagram.com/triniarepas_" },
    },
    cta: { label: "Pedir ahora" },
    hotspot: { x: 69, y: 37, w: 31, h: 37 },
    status: "live",
  },
  rent: {
    id: "rent",
    slug: "/rent",
    name: "Trini Beach Rental",
    shortName: "Beach Rental",
    emoji: "🏖️",
    tagline: "Tu playa te espera",
    description:
      "Trini House y 16 apartamentos frente al mar en Santa Marta. Elige tu alojamiento, consulta disponibilidad real y reserva con el mismo estándar premium del universo Trinity.",
    theme: {
      bg: "#04191c",
      bgAlt: "#07272b",
      accent: "#2dd4bf",
      accentSoft: "rgba(45, 212, 191, 0.18)",
      text: "#e6fbf8",
      textMuted: "#8fc9c1",
      border: "rgba(45, 212, 191, 0.2)",
    },
    media: {
      heroVideo: "/media/rent/hero.mp4",
      heroImage: "/media/rent/hero.png",
      cardImage: "/media/rent/hero.png",
    },
    contact: {
      whatsapp: "573150526068",
      instagram: { handle: "@trinirent_", url: "https://instagram.com/trinirent_" },
    },
    cta: { label: "Reservar" },
    hotspot: { x: 26, y: 65, w: 48, h: 35 },
    status: "live",
  },
  licores: {
    id: "licores",
    slug: "/licores",
    name: "Trini Licores",
    shortName: "Licores",
    emoji: "🥃",
    tagline: "Para brindar como Trinity",
    description:
      "Licores premium con la actitud del universo Trinity. Pide y te lo llevamos, con el mismo estándar de siempre.",
    theme: {
      bg: "#0f0a03",
      bgAlt: "#1a1206",
      accent: "#d4a017",
      accentSoft: "rgba(212, 160, 23, 0.18)",
      text: "#f8f0dc",
      textMuted: "#bfa876",
      border: "rgba(212, 160, 23, 0.2)",
    },
    media: {
      heroImage: "/media/licores/hero.png",
      cardImage: "/media/licores/card.png",
    },
    contact: {
      instagram: { handle: "@trini_bga", url: "https://instagram.com/trini_bga" },
    },
    cta: { label: "Pedir ahora" },
    hotspot: { x: 28, y: 42, w: 15, h: 19 },
    status: "live",
  },
  vapers: {
    id: "vapers",
    slug: "/vapers",
    name: "Trini Vapers",
    shortName: "Vapers",
    emoji: "💨",
    tagline: "Tu vape, tu estilo",
    description:
      "Dispositivos y líquidos con la actitud Trinity. Pide y te lo llevamos, con el mismo estándar de siempre.",
    theme: {
      bg: "#0a0510",
      bgAlt: "#150a1f",
      accent: "#c084fc",
      accentSoft: "rgba(192, 132, 252, 0.18)",
      text: "#f3e8ff",
      textMuted: "#b39ddb",
      border: "rgba(192, 132, 252, 0.2)",
    },
    media: {
      heroImage: "/media/vapers/hero.png",
      cardImage: "/media/vapers/card.png",
    },
    contact: {
      instagram: { handle: "@trini_bga", url: "https://instagram.com/trini_bga" },
    },
    cta: { label: "Pedir ahora" },
    hotspot: { x: 9, y: 63, w: 16, h: 20 },
    status: "live",
  },
};

export const worldList: WorldConfig[] = Object.values(worlds);
export const liveWorlds: WorldConfig[] = worldList.filter((w) => w.status === "live");
