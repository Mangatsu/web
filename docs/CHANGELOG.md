# Changelog

All notable changes of this project will be documented in this file. Unreleased changes reside in the main branch.

> The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
