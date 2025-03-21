import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";

type Language = {
  code: string;
  name: string;
  font: string;
  scale: number;
};

const indianLanguages: Language[] = [
  { code: "hi", name: "Hindi", font: "Noto Sans Devanagari", scale: 1.1 },
  { code: "bn", name: "Bengali", font: "Noto Sans Bengali", scale: 1.15 },
  { code: "te", name: "Telugu", font: "Noto Sans Telugu", scale: 1.2 },
  { code: "mr", name: "Marathi", font: "Noto Sans Devanagari", scale: 1.1 },
  { code: "ta", name: "Tamil", font: "Noto Sans Tamil", scale: 1.15 },
  { code: "ur", name: "Urdu", font: "Noto Sans Arabic", scale: 1.2 },
  { code: "gu", name: "Gujarati", font: "Noto Sans Gujarati", scale: 1.1 },
  { code: "ml", name: "Malayalam", font: "Noto Sans Malayalam", scale: 1.2 },
  { code: "kn", name: "Kannada", font: "Noto Sans Kannada", scale: 1.2 },
  { code: "or", name: "Odia", font: "Noto Sans Oriya", scale: 1.1 },
  { code: "pa", name: "Punjabi", font: "Noto Sans Gurmukhi", scale: 1.1 },
  { code: "as", name: "Assamese", font: "Noto Sans Bengali", scale: 1.15 },
];

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>(i18n.language);

  const currentLang = indianLanguages.find((lang) => lang.code === language);
  const fontFamily = currentLang?.font || "Arial, sans-serif";
  const fontScale = currentLang?.scale || 1.0;

  const translateText = async (lang: string) => {
    setLoading(true);

    const translations = i18n.store.data.en.translation as Record<string, string>;
    const keys = Object.keys(translations);
    const values = keys.map((key) => translations[key]); // Extract values only

    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(
          values.join("\n")
        )}`
      );
      const data = await response.json();

      // Extract translated values from response
      const translatedValues: string[] = data[0].map((item: [string]) => item[0]);

      // Reconstruct JSON with original keys
      const translatedJSON = keys.reduce<Record<string, string>>((acc, key, index) => {
        acc[key] = translatedValues[index];
        return acc;
      }, {});

      i18n.addResourceBundle(lang, "translation", {}, true, true);
      i18n.addResourceBundle(lang, "translation", translatedJSON, true, true);

      await i18n.changeLanguage(lang);
      setLanguage(lang);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-[100vh] bg-white text-black dark:bg-gray-900 dark:text-white py-8"
      style={{ fontFamily }}
    >
      <Header />
      <div
        className="container text-center max-w-2xl mt-28"
        style={{ fontSize: `${fontScale}em`, lineHeight: `${fontScale + 0.3}em` }}
      >
        <h1 className="text-4xl font-bold">{t("greeting")}</h1>
        <p className="mt-8">{t("detail.line1")}</p>
        <p className="mt-2">{t("detail.line2")}</p>
      </div>

      {/* Language Dropdown */}
      <div className="mt-4 flex justify-center">
        <select
          value={language}
          onChange={(e) => translateText(e.target.value)}
          disabled={loading}
          className="px-4 py-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white"
        >
          <option value="en">English</option>
          {indianLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default App;
