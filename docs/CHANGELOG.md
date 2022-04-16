# Changelog

All notable changes of this project will be documented in this file. Unreleased changes reside in the main branch.

> The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.1] - 2022-04-16

## Added

- Gallery Shuffle
- More information to the Series page

## Changed

- Update SWR to 2.0.0 beta
- Remove unnecessary tooltip from `Library` button
- Show `Web vX.Y.Z` in the session name instead of `next-auth-session`

## [0.4.0] - 2022-04-15

## Added

- Spinner to indicate if the page is loading longer
  - Usually when the backend is extracting the requested gallery if it's not in the cache already
- Tooltips to icon buttons on gallery pages
- Numbered placeholders for page thumbnails
- Blur placeholders for covers

## Fixed

- Show "Loading…" instead of "No pages found" when clicking thumbnails on gallery pages
- Library layout on small screens
- Nav overflowing on small screens
- Typos

## Changed

- Update dependencies
  - Most notably React 17 -> 18
- Icon of 'Shift pages' button
- Color of nav icons (black -> white)
- Change Random button to Heart icon
- Remove old placeholder Login button on Library page

## [0.3.0] - 2022-03-20

## Added

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

## Changed

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
