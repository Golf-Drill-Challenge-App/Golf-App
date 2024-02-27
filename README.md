# Golf-App

Cross Platform Mobile app for the OSU Men's Golf Team.

## Tech Stack

- [React Native](https://reactnative.dev/)
- [React Native Paper](https://reactnativepaper.com/)
- [React Native SVG Charts](https://www.npmjs.com/package/react-native-svg-charts)
- [Expo Go](https://expo.dev/)
- [Firestore](https://firebase.google.com/docs/firestore)

See [package.json](package.json) for more details on libraries used

## Design References

- [Figma](https://www.figma.com/file/8fP7vgmQ9kNhYeyFIS5guP/OSU-Golf-App-Prototype?type=design&node-id=1840%3A1676&mode=design&t=vQ8CIjrhrU7uoO9z-1)
  - Mock-ups of overall visual styling of each page, as well as how navigation is intended to work
  - Currently on "Prototype V2" of the Figma prototype
- Golf Coach's Spreadsheets (sample golf drills / calculations)
  - [Approach Shots / Line Tests](https://docs.google.com/spreadsheets/d/1ZufXjRCTzbIqJln_fJ5NDvNo0ahHIM-bkv9ZB8a6Drw/edit#gid=259638677)
  - [Putting](https://docs.google.com/spreadsheets/d/12gnHaMyzP0eGAi3MGVBYaG5obCJ0xri9d0RiqiWKfuA/edit#gid=865463318)
- [Data Golf](https://datagolf.com/player-profiles?dg_id=18841)
  - Example of graph logic / styling, for golf stats

## Database Specifications

Info below subject to change

- Database Schema: [db_spec.jsonc](db_spec.jsonc)
  - The current database on Firestore, as well as the local test data in [drill_data.json](drill_data.json), follows the schema starting on line 29 ("teams" object) of `db_spec.jsonc`
    - May be moving drill attempts out of `teams` and into a separate data object soon
- Currently, some pages in profile, team, drill submission still use the local data from `drill_data.json`, but the rest are connected to Firestore
- Login / Signup functionality is not implemented yet on the main `layout` branch

## Commands

### Install dependencies

- `yarn`

### Running App on a Physical Mobile Device

- Install Expo Go mobile app to run the app dev build
  - [iOS](https://apps.apple.com/us/app/expo-go/id982107779)
  - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&gl=US)
- `yarn start`
  - If on OSU school wifi (or any other wifi that doesn't support peer-to-peer), use `yarn start --tunnel`
  - Run app, scan QR code on physical phone

### Running App on Android Emulator (Windows PC or MacOS)

- Note that Expo Go will be automatically installed on the emulated mobile device for you
- Create an Android Emulator AVD (simulated phone): https://developer.android.com/studio/run/managing-avds
- You need to run the Android Emulator from command line due to a bug with Vulkan
  - More info: https://developer.android.com/studio/run/emulator-troubleshooting#error:-%60vulkan-1.dll
- Command to run Android Emulator:
  - `C:\Users\<username>\AppData\Local\Android\Sdk\emulator\emulator -avd <emulated phone name> -feature -Vulkan`
    - Example: `C:\Users\solde\AppData\Local\Android\Sdk\emulator\emulator -avd Pixel_3a_API_34_extension_level_7_x86_64 -feature -Vulkan`
- `yarn android` to run the app
  - If on OSU school wifi (or any other wifi that doesn't support peer-to-peer), use `yarn android --tunnel`

### Running App in iOS Emulator (MacOS)

- Note that Expo Go will be automatically installed on the emulated mobile device for you
- Documentation: https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device
- Should be more straightforwards than Android, you shouldn't need to use command line to open iOS emulator
- `yarn ios` to run the app
  - If on OSU school wifi (or any other wifi that doesn't support peer-to-peer), use `yarn ios --tunnel`

### Formatting Script

- `yarn pretty`
  - Run Prettier script to reformat code (standardize indents etc)

### App Compilation Troubleshooting

- Hot Reload is enabled by default whenever you edit a page on the app, and you can also manually trigger a reload by entering "r" into command line
- If reloading isn't working for some reason, double swipe up on your mobile device to exit Expo Go, and restart the app from command line

## Last Year's Codebase

A different team of students worked on this projects last year, linked here for reference.

- Last year's codebase (JavaScript): https://github.com/efmmoncada/golf-drill-challenge-app
  - Check this repo's README for other useful tips on software stack
- Last year's codebase (TypeScript): https://github.com/efmmoncada/golf-app-ts
  - We are basing our codebase more on the TypeScript version from last year, but it's lacking a README
