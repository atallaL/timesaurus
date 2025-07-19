import { useState } from 'react'
import './App.css'

//translations
import en from "./i18/en.json";
import fr from "./i18/fr.json";
const translations = {en, fr};

function App() {

  //states
  const [lang, setLang] = useState("en");

  //language switching handler
  const handleLangSwitch = () => {
    const newLang = lang === "en" ? "fr" : "en";
    setLang(newLang);
    document.documentElement.lang = newLang;
  }

  //function to switch content on page language
  const trans = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <>
      <div className="headerSection">
        <div className="headerText">
          <h1>TimeSaurus</h1>
          <p>{trans("dashboardDesc")}</p>
        </div>
        <div className="headerButton">
          <button onClick={handleLangSwitch}>
            {lang === "en" ? "FR" : "EN"}
          </button>
        </div>
      </div>

    </>
  )
}

export default App
