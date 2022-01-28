// Server meta
export enum Visibility {
  Public = "public",
  Restricted = "restricted",
  Private = "private",
}

export interface ServerInfo {
  APIVersion?: number
  ServerVersion?: string
  Visibility?: Visibility
  Registrations?: boolean
}

// Galleries
export interface Gallery {
  Meta: GalleryMeta
  Files: string[]
  Count: number
}

export interface GalleryMeta {
  UUID: string
  Title: string
  TitleNative?: string
  TitleShort?: string
  Released?: string
  Circle?: string
  Artists?: string
  Series?: string
  Category?: string
  Language?: string
  Translated?: boolean
  ImageCount?: number
  ArchiveSize?: number
  ArchiveHash?: string
  Thumbnail?: string
  Nsfw: boolean
  Tags: Tags
  Reference: Reference
  GalleryPref?: GalleryPref
  CreatedAt: string
  UpdatedAt: string
}

interface Tags {
  [key: string]: [string]
}

interface Reference {
  ExhToken?: string
  ExhGid?: number
  Urls: string
}

interface GalleryPref {
  FavoriteGroup?: string
  Progress: number
  UpdatedAt: string
}

export interface LibraryFilters {
  searchTerm?: string
  order?: string
  sortBy?: string
  limit?: number
  offset?: number
  category?: string
  favoriteGroup?: string
  nsfwHidden?: boolean
  tags?: string
}

// Users
export interface MangatsuSession {
  Token: string
  Passphrase: string
}

export interface MangatsuUser {
  UUID: string
  Username: string
  Role: number
  CreatedAt: string
  UpdatedAt: string
}