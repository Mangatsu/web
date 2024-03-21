export interface OrderedMap<T> {
  Keys: string[]
  Map: Record<string, T>
}

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
export interface GalleryResponse {
  Data: GalleryMeta[]
  Count: number
}

export interface Gallery {
  Meta: GalleryMeta
  Files: string[]
  Count: number
}

export type GroupedGalleries = Map<string, GalleryMeta[]>

export interface GalleryMeta {
  UUID: string
  Title: string
  TitleNative?: string
  TitleTranslated?: string
  Released?: string
  Series?: string
  Category?: string
  Language?: string
  Translated?: boolean
  ImageCount?: number
  ArchiveSize?: number
  ArchiveHash?: string
  Thumbnail?: string
  Nsfw: boolean
  Tags: Record<string, string[]>
  Reference: Reference
  GalleryPref?: GalleryPref
  SubGalleryCount?: number
  CreatedAt: string
  UpdatedAt: string
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
  grouped?: boolean
  seed?: number
}

// Users
export interface MangatsuSession {
  ID: string
  UserUUID: string
  Name: string | null
  ExpiresAt: string | null
}

export interface MangatsuUser {
  UUID: string
  Username: string
  Role: number
  CreatedAt: string
  UpdatedAt: string
}

export interface LoginResponse {
  UUID: string | null
  Role: string | null
  ExpiresIn: number
}

// Processing status
export interface ProcessingStatus {
  Scan: ScanResult
  Thumbnails: ThumbnailResult
  Metadata: MetadataResult
}

export interface ScanResult {
  Running: boolean
  FoundGalleries: string[]
  SkippedGalleries: string[]
  Errors: ProcessingError[]
}

export interface ThumbnailResult {
  Running: boolean
  TotalCovers: number
  TotalPages: number
  GeneratedCovers: number
  GeneratedPages: number
  Errors: ProcessingError[]
}

export interface MetadataResult {
  Running: boolean
  Errors: ProcessingError[]
}

export interface ProcessingError {
  UUIDOrPath: string
  Error: string
  Details: Map<string, string>
}
