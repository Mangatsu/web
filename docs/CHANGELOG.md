# Changelog

All notable changes of this project will be documented in this file. Unreleased changes reside in the main branch.

> The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.2] - 2023-05-30

**Released packages also on GHCR (GitHub Container Registry) alongside DockerHub:**

- [ghcr.io/mangatsu/server](https://github.com/Mangatsu/server/pkgs/container/server)
- [ghcr.io/mangatsu/web](https://github.com/Mangatsu/server/pkgs/container/server)

### Fixed

- A warning about page title-element

## [0.5.1] - 2023-05-28

### Added

- Add a new preference for including serialized galleries to randomized galleries

### Fixed

- JSON serialization error on Series page
- Broken API URLs
- Rare client side crash on non-200 server response

### Changed

- Refactor Library fetching

## [0.5.0] - 2023-05-28

### Added

- Support for multiple Library layouts
  - Currently: Thumbnail and Detailed
- NSFW badge to the Series page
- New login page
- Expires local storage object
- Function to parser cookie headers

### Fixed

- Next.js deprecations
  - Removed `next/image` objectFit props
  - Removed nested `<a>` tags inside `next/link` tags
- Local storage objects are now properly removed when logged out
- Logout expiry

### Changed

- JWT Authorization header authentication to JWT cookie (httpOnly) authentication
- Refactored API integration to the backend
- Refactored many pages such as admin and personal
- Refactored logout process
- Random gallery button to a game die (🎲)
- Enabled SWR's keepPreviousData option which eliminates blinking on Library page
- Wording on 500 page
- Minimized SVGs for performance
- Upgrade NodeJS to 18
- Upgrade packages
  - e.g. Next.js v13, TypeScript v5, heroicons v2
- next.config.js to next.config.mjs

### Removed

- next-auth
- next-auth environmentals
- Fetching serverInfo explicitly on 404 page
- ServerInfo file cache

## [0.4.2] - 2022-04-17

### Added

- Logout automatically when session expires
- Logout immediately when clicking `Logout`

### Fixed

- Logout HTTP method
  - Now logging out properly deletes the session

## [0.4.1] - 2022-04-16

### Added

- Gallery Shuffle
- More information to the Series page

### Changed

- Update SWR to 2.0.0 beta
- Remove unnecessary tooltip from `Library` button
- Show `Web vX.Y.Z` in the session name instead of `next-auth-session`

## [0.4.0] - 2022-04-15

### Added

- Spinner to indicate if the page is loading longer
  - Usually when the backend is extracting the requested gallery if it's not in the cache already
- Tooltips to icon buttons on gallery pages
- Numbered placeholders for page thumbnails
- Blur placeholders for covers

### Fixed

- Show "Loading…" instead of "No pages found" when clicking thumbnails on gallery pages
- Library layout on small screens
- Nav overflowing on small screens
- Typos

### Changed

- Update dependencies
  - Most notably React 17 -> 18
- Icon of 'Shift pages' button
- Color of nav icons (black -> white)
- Change Random button to Heart icon
- Remove old placeholder Login button on Library page

## [0.3.0] - 2022-03-20

### Added

- Support for EHDL and Hath parsers
- Support for grouping galleries together by series
- Series pages (/series/[name])
- Dark theming (scrollbars and other native elements)
- Animations to popups

### Fixed

- Layout shifting when scroll bar appears
- Fetching with SWR resulting in fatal error if token is undefined
- Random gallery throwing an error when no galleries returned
- Catch network errors of the User API endpoint and when updating galleries
- Checkbox styles in forms and login screen

### Changed

- Updated dependencies
- Disabled background scroll when large popup is open

## [0.2.1] - 2022-02-27

### Fixed

- Docker image starting command
- Static dir was not copied to the Docker image
- Image hostname was not being whitelisted in the Docker image
  - NEXT_MANGATSU_IMAGE_HOSTNAME wasn't embedded in the server.js when using Next.js standalone output
- Sessions and Users tables might get mixed
- Fetching with SWR resulting in fatal error if token is undefined

## [0.2.0] - 2022-02-27

### Added

- Support for UpdateGallery API method
  - Can only be used by admins
  - Can be found on individual gallery pages
- New button icons (Heroicons)

### Changed

- Upgraded packages
  - Most notably Next.js 12.1
- Made Docker images smaller by using Next.js 12.1's outputStandalone
- Renamed PopupSmall to NavPopup

### Removed

- Artists and Circle columns from Gallery

## [0.1.1] - 2022-02-03

### Added

- Support for favorite groups
- Link to random gallery
- Link to GitHub

## [0.1.0] - 2022-01-31

### Added

- Initial release
