export const getTranslations = async (lang: string) => {
  let menu;
  try {
    menu = await import(`../../config/menu.${lang}.json`);
  } catch {
    menu = await import(`../../config/menu.en.json`);
  }

  return { ...menu.default };
};
