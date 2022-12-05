module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      minWidth: {
        sidebar: "10rem",
      },
      maxWidth: {
        imageModal: "70%",
      },
      maxHeight: {
        imageModal: "calc(100% - 40px - 4rem)",
      },
      aspectRatio: {
        reverse: "9 / 16",
      },
    },
  },
  plugins: [],
};
