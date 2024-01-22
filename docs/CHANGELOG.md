# Changelog

All notable changes of this project will be documented in this file. Unreleased changes reside in the main branch.

> The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.4] - 2024-01-23

### Added

- Cursors (while hovering) to various buttons such as Save and Update
- Confirming password when changing own password
- Clicking 漫月 (top left) takes the user to the main page
- Autocomplete props to password and username fields
- Uneditable UUID field when editing a Gallery

### Fixed

- Search filter buttons now showing
- 404 page flashing when accessing Galleries and Series
- Mobile style layout on Personal page

### Changed

- Username can now start with a number as well
- Unify styling all across the page

## [0.6.3] - 2024-01-22

### Added

- Ability to delete admins

### Fixed

- Login page on mobile

### Changed

- Refactor OnOffSwitch

## [0.6.2] - 2024-01-22

### Added

- Validations for all the user forms (login, edit user, edit personal settings)
- Remember username and remember status on failed login
- Cursor pointers to login page buttons
- 404 for not existing Gallery and Series pages
- Message when no galleries were found

### Fixed

- Typos
- Error when trying to update or delete users
- Remember login values on Login page

### Changed

- Removed white space on the bottom of the gallery page
- Refactored gallery grid
- Trim whitespaces when searching
- Now the task status is only being refresh on the status page or if the status popup is open

## [0.6.1] - 2024-01-21

### Added

- Web version to User menu

### Fixed

- A bug with found galleries on the Status page
- Various issue with login states
- Automatic logout on token expiring
- Trying to access pages not available when logged in anonymously would cause flashing

### Changed

- **Rehauled Login page**
- Upgraded dependencies

## [0.6.0] - 2024-01-09

### Added

- **New processing status page**
- Close nav's user menu when clicking admin or personal
- New-password attribute where applicable to accommodate password managers

### Fixed

- Only show favorite groups when logged in as a user
- Anonymous user check
- Double navigation on the admin and series page
- React hydration error on personal settings page
- Make the nav's user menu buttons consistent in size
- Error when gallery was not found

### Changed

- **Rehauled the task menu**
- Require minimum of Node.js v20 and npm v10
- Upgrade dependencies (such as Next.js 14)
- Refactor to use Next.js's App router
- Wider search box
- Nav to be narrower and rounder
- Github link to be more obvious
- Shadow to user menu
- Temporarily disabled loading icon (cause: a fundamental change in Next.js's router)

## [0.5.2] - 2023-05-30

**Released packages also on GHCR (GitHub Container Registry) alongside DockerHub:**

- [ghcr.io/mangatsu/server](https://github.com/Mangatsu/server/pkgs/container/server)
- [ghcr.io/mangatsu/web](https://github.com/Mangatsu/server/pkgs/container/server)

### Fixed

- A warning about page title-element

## [0.5.1] - 2023-05-28

### Added

- A new preference for including serialized galleries to randomized galleries

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
