import { string, z } from "zod"

export enum HttpMethod {
  CONNECT = "CONNECT",
  DELETE = "DELETE",
  GET = "GET",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  PATCH = "PATCH",
  POST = "POST",
  PUT = "PUT",
  TRACE = "TRACE"
}

export enum FrameSize {
  MOBILE = "MOBILE",
  DESKTOP = "DESKTOP"
}

export const FONTS = [
  "Alfa Slab One",
  "Archivo Black",
  "Arvo",
  "Bebas Neue",
  "Bitter",
  "Comfortaa",
  "Cookie",
  "Creepster",
  "Federo",
  "Fugaz One",
  "Homemade Apple",
  "Inter",
  "Merriweather",
  "Montserrat",
  "Neuton",
  "Open Sans",
  "Pacifico",
  "Parisienne",
  "Permanent Marker",
  "Playfair Display",
  "Poiriet One",
  "Raleway",
  "Roboto Slab",
  "Roboto",
  "Sacramento",
  "Send Flowers",
  "Source Sans Pro",
  "Source Serif Pro",
  "Space Grotesk",
  "Space Mono",
  "Special Elite",
  "Square Peg"
]

export const COLORS = [
  "#f6e58d",
  "#f9ca24",
  "#ffbe76",
  "#ff7979",
  "#eb4d4b",
  "#badc58",
  "#6ab04c",
  "#7ed6df",
  "#22a6b3",
  "#e056fd",
  "#be2edd",
  "#686de0",
  "#4834d4",
  "#30336b",
  "#130f40",
  "#636e72",
  "#2d3436",
  "#ffffff"
]

export const FONT_SIZES = [12, 14, 16, 18, 20, 24, 30, 36]

export const orgSchema = z.object({
  id: z.string().cuid().optional(),
  name: z
    .string({ required_error: "Nombre es requerido" })
    .min(3, { message: "Nombre muy corto" })
    .max(100, { message: "Nombre muy largo" }),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  banner: z.string().url().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "DUE"]),
  plan: z.enum(["BASIC", "PRO"]),
  subdomain: z
    .string()
    .min(3, { message: "Subdominio muy corto" })
    .trim()
    .regex(/^[a-z0-9-]+$/i, {
      message: "Solo letras, números y guiones son permitidos"
    })
})

export const locationSchema = z.object({
  id: z.string().cuid().optional(),
  name: z
    .string({
      required_error: "Nombre es requerido"
    })
    .min(3, { message: "Nombre muy corto" })
    .max(100),
  description: z.string().optional(),
  address: z
    .string({
      required_error: "Dirección es requerida"
    })
    .min(3, { message: "Dirección no es válida" }),
  phone: z
    .string()
    .regex(/^\d{10}$/, {
      message: "Número de teléfono inválido"
    })
    .optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  tiktok: z.string().optional(),
  whatsapp: z.string().optional(),
  website: z.string().url().optional(),
  organizationId: z.string().cuid().optional()
})

export const variantSchema = z.object({
  id: z.string().cuid().optional(),
  name: z
    .string({
      required_error: "Nombre es requerido"
    })
    .min(3, { message: "Nombre muy corto" })
    .max(100, { message: "Nombre muy largo" }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, {
    message: "Precio no puede ser negativo"
  }),
  menuItemId: z.string().cuid().optional()
})

export const menuItemSchema = z.object({
  id: z.string().cuid().optional(),
  name: z
    .string({
      required_error: "Nombre es requerido"
    })
    .min(3, { message: "Nombre muy corto" })
    .max(100, { message: "Nombre muy largo" }),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
  description: z.string().optional(),
  image: z.string().url().optional(),
  categoryId: z.string().cuid().optional(),
  organizationId: z.string().cuid().optional(),
  variants: z.array(variantSchema).nonempty()
})

export const categorySchema = z.object({
  id: z.string().cuid().optional(),
  name: z
    .string({
      required_error: "Nombre es requerido"
    })
    .min(3, { message: "Nombre muy corto" })
    .max(100, { message: "Nombre muy largo" }),
  organizationId: z.string().cuid().optional()
})

export const menuSchema = z.object({
  id: z.string().cuid().optional(),
  name: z
    .string({
      required_error: "Nombre es requerido"
    })
    .min(3, { message: "Nombre muy corto" })
    .max(100, { message: "Nombre muy largo" }),
  description: z.string().optional(),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  organizationId: z.string().cuid().optional(),
  serialData: string().optional()
})

export type MenuItemQueryFilter = {
  status?: string
  category?: string
  start?: string
  end?: string
  take?: number
}

export const enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DUE = "DUE"
}

export const enum Plan {
  BASIC = "BASIC",
  PRO = "PRO"
}

export const enum ImageType {
  LOGO = "LOGO",
  BANNER = "BANNER",
  MENUITEM = "MENUITEM"
}

export const enum MembershipRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  OWNER = "OWNER"
}

export const enum ActionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}

export const enum MenuItemStatus {
  ACTIVE = "ACTIVE",
  DRAFT = "DRAFT",
  ARCHIVED = "ARCHIVED"
}

export const enum MenuStatus {
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT"
}

export const fontThemes = [
  {
    name: "DEFAULT",
    fontDisplay: "Inter",
    fontText: "Inter"
  },
  {
    name: "MONACO",
    fontDisplay: "DM Serif Display",
    fontText: "DM Sans"
  },
  {
    name: "PORTLAND",
    fontDisplay: "Quicksand",
    fontText: "Quicksand"
  },
  {
    name: "BERLIN",
    fontDisplay: "Work Sans",
    fontText: "Merriweather"
  },
  {
    name: "AMSTERDAM",
    fontDisplay: "Playfair Display",
    fontText: "Lato"
  },
  {
    name: "GAZA",
    fontDisplay: "Yeseva One",
    fontText: "Josefin Sans"
  },
  {
    name: "OSLO",
    fontDisplay: "Raleway",
    fontText: "Libre Baskerville"
  },
  {
    name: "ROMA",
    fontDisplay: "Cinzel",
    fontText: "Fauna One"
  },
  {
    name: "PARIS",
    fontDisplay: "Poiret One",
    fontText: "Montserrat"
  },
  {
    name: "KIEV",
    fontDisplay: "Montserrat",
    fontText: "Open Sans"
  },
  {
    name: "TUCSON",
    fontDisplay: "Outfit",
    fontText: "Outfit"
  },
  {
    name: "CHICAGO",
    fontDisplay: "Oswald",
    fontText: "Merriweather"
  },
  {
    name: "ORLANDO",
    fontDisplay: "Bubblegum Sans",
    fontText: "Open Sans"
  },
  {
    name: "MADRID",
    fontDisplay: "Bungee",
    fontText: "Outfit"
  },
  {
    name: "FLORENCIA",
    fontDisplay: "Caveat",
    fontText: "Montserrat"
  },
  {
    name: "LISBOA",
    fontDisplay: "Pacifico",
    fontText: "QuickSand"
  },
  {
    name: "MILAN",
    fontDisplay: "Orelega One",
    fontText: "Merriweather"
  },
  {
    name: "ALAMO",
    fontDisplay: "Rye",
    fontText: "Lora"
  },
  {
    name: "SACRAMENTO",
    fontDisplay: "Sacramento",
    fontText: "Playfair Display"
  },
  {
    name: "MICHIGAN",
    fontDisplay: "Arvo",
    fontText: "Montserrat"
  },
  {
    name: "GOTHAM",
    fontDisplay: "Satisfy",
    fontText: "Open Sans"
  },
  {
    name: "AUSTIN",
    fontDisplay: "Unica One",
    fontText: "Crimson Text"
  },
  {
    name: "SEATTLE",
    fontDisplay: "Mulish",
    fontText: "Space Mono"
  },
  {
    name: "OAKLAND",
    fontDisplay: "Teko",
    fontText: "Montserrat"
  }
]

export const colorThemes = [
  {
    name: "DEFAULT",
    surfaceColor: "#ffffff",
    brandColor: "#131313",
    accentColor: "#424242",
    textColor: "#131313",
    mutedColor: "#636363"
  },
  {
    name: "TERRA",
    surfaceColor: "##fff8f6",
    brandColor: "#231917",
    accentColor: "#8f4c38",
    textColor: "#231917",
    mutedColor: "#6f5600"
  },
  {
    name: "TERRA_DARK",
    surfaceColor: "#271d1b",
    brandColor: "#f1dfda",
    accentColor: "#ffb5a0",
    textColor: "#f1dfda",
    mutedColor: "#f5e1a7"
  },
  {
    name: "FLORA",
    surfaceColor: "#f9faef",
    brandColor: "#1a1c16",
    accentColor: "#4c662b",
    textColor: "#1a1c16",
    mutedColor: "#006c65"
  },
  {
    name: "FLORA_DARK",
    surfaceColor: "#1e201a",
    brandColor: "#e2e3d8",
    accentColor: "#b1d18a",
    textColor: "#e2e3d8",
    mutedColor: "#bcece7"
  },
  {
    name: "AZURE",
    surfaceColor: "#f9f9ff",
    brandColor: "#191c20",
    accentColor: "#415f91",
    textColor: "#191c20",
    mutedColor: "#6a327a"
  },
  {
    name: "AZURE_DARK",
    surfaceColor: "#1d2024",
    brandColor: "#dedee4",
    accentColor: "#aac7ff",
    textColor: "#dedee4",
    mutedColor: "#fad8fd"
  },
  {
    name: "HELIOS",
    surfaceColor: "#fff9ee",
    brandColor: "#1e1b13",
    accentColor: "#6d5e0f",
    textColor: "#1e1b13",
    mutedColor: "#365944"
  },
  {
    name: "HELIOS_DARK",
    surfaceColor: "#222017",
    brandColor: "#e8e2d4",
    accentColor: "#dbc66e",
    textColor: "#e8e2d4",
    mutedColor: "#bce3c6"
  }
]
