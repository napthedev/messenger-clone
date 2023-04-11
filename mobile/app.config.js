import "dotenv/config";

module.exports = {
  name: "Messenger Clone",
  slug: "messenger-clone",
  owner: "naptest",
  privacy: "public",
  scheme: `fb${process.env.FACEBOOK_APP_ID}`,
  facebookScheme: `fb${process.env.FACEBOOK_APP_ID}`,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    package: "com.naptest.messengerclone",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    [
      "expo-media-library",
      {
        photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
        savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
        isAccessMediaLocationEnabled: true,
      },
    ],
  ],
  extra: {
    serverURL: process.env.API_URL || "http://localhost:3000",
    facebookAppId: process.env.FACEBOOK_APP_ID,
    imgbbAPIKey: process.env.IMGBB_API_KEY,
  },
};
