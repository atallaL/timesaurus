import { useState } from 'react'
import './App.css'

//translations
import en from "./i18/en.json";
import fr from "./i18/fr.json";

const translations = {en, fr};

import enData from "./data/english_freq_pmw.json";
import frData from "./data/french_freq_pmw.json";

//React chart handling library
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer} from 'recharts';

//React autosuggestion library
import {useCombobox} from "downshift";

const DECADES = [1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010]; //possible decades

function App() {

  const selectedWordsEN = ["the", "of", "and", "to", "a"];
  const selectedWordsFR = ["être", "je", "de", "ne", "la"];

  //states
  const [lang, setLang] = useState("en");
  const [curData, setCurData] = useState(enData);
  const [inputItems, setInputItems] = useState([]);
  const [selectedWords, setSelectedWords] = useState(selectedWordsEN);
  const [suggestions, setSuggestions] = useState([]);

  //language switching handler
  const handleLangSwitch = () => {
    const newLang = lang === "en" ? "fr" : "en";
    setLang(newLang);
    setCurData(newLang === "en" ? enData : frData);
    setSelectedWords(newLang === "en" ? selectedWordsEN : selectedWordsFR) 
    document.documentElement.lang = newLang;
    
  }

  //function to switch content on page language
  const trans = (key) => {
    return translations[lang][key] || key;
  };



 
  //transform data from json to format that recharts will understand
  const getBarData = (words, data, decade) => {
    return words.map(word => ({
      word,
      value: data[word]?.[decade] ?? 0
    }));
  }

  /* BAR CHART STUFF */
  const [selectedDecade, setSelectedDecade] = useState(2010);
  const barChartData = getBarData(selectedWords, curData, selectedDecade);

  //autocomplete handling

  const [inputValue, setInputValue] = useState([...selectedWords]);

  //input in field handling
  const handleInputChange = (e, index) => {
    const value = e.target.value;

    //update word
    const newWords = [...inputValue];
    newWords[index] = value;
    setInputValue(newWords);

    //update suggestions so we're not searching in the entire list of 5000 every time
    if (value.length === 0) {
      setSuggestions([]);
    } else {
      const filtered = Object.keys(curData).filter((word) => word.toLowerCase().startsWith(value.toLowerCase())).slice(0, 5);
      setSuggestions(filtered);
    }
  };

  //actually change word if its valid
  const handleWordChange = (index) => {
      const word = inputValue[index];

      //check if word exists
      if (curData.hasOwnProperty(word)) {
        const newWords = [...selectedWords];
        newWords[index] = word;
        setSelectedWords(newWords);
      } else {
        const correctedInputs = [...inputValue];
        correctedInputs[index] = selectedWords[index];
        setInputValue(correctedInputs);
      }
  }

  //check if word can actually be changed and then change it on enter keypress
  const handleEnterPressed = (e, index) => {
    if (e.key === "Enter") {
      handleWordChange(index);
      e.target.blur(); 
    }
  };

  //check if word can actually be changed and then change it on unfocus
  const handleBlur = (index) => {
    handleWordChange(index);
  };

  return (
    <>
      <div className="main">
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
        <div className="graphContainer">
          <div className="bargraphContainer">
            <div className="bargraphTop">

              <h2>{trans("barchartTitle")}</h2>

              <div className="bargraphInteract">
                <div className="bargraphDropdown">
                  <p>{trans("decade")}:</p>
                  <select value={selectedDecade} onChange={(e) => setSelectedDecade(parseInt(e.target.value))}>
                    {DECADES.map((decade) => (
                      <option key={decade} value={decade}>{decade} - {decade + 9}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            




            {/* barchart created using recharts stuff */}
            <ResponsiveContainer width="100%" height={300}> 
              <BarChart className="barchart" data={barChartData} margin={{top: 20, right: 40, bottom: 20, left: 40}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="word">
                  <Label value={trans("barchartXAxis")} offset={-15} position="insideBottom"/>
                </XAxis>
                <YAxis>
                  <Label value={trans("barchartYAxis")} angle={-90} style={{ textAnchor:'middle'}} position="insideLeft" offset={-15}/>
                </YAxis>
                <Tooltip />
                <Bar dataKey="value" fill="#63df32ff" />
              </BarChart>
            </ResponsiveContainer>





            {/* barchart input stuff */}

            <div className="bargraphInputs"> 
              {selectedWords.map((word, index) => (
                <div className="bargraphWordInput">
                  <label>Word {index + 1}</label>
                  <input
                    key={index}
                    list="wordSuggestions"
                    value={inputValue[index]}
                    onChange={(e) => handleInputChange(e, index)}
                    onKeyDown={(e) => handleEnterPressed(e, index)}
                    onBlur={() => handleBlur(index)}
                  />
                </div>
              ))}

              
              <datalist id="wordSuggestions">
                {suggestions.map((word) => (
                  <option key={word} value={word} />
                ))}
              </datalist>
            </div>





          </div>
          <div className="linegraphContainer">
            
          </div>
        </div>
      </div>
    </>
  )
}

export default App
