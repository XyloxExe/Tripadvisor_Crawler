import React, { useRef, useState } from 'react'; 
import axios from 'axios';
import { jsPDF } from "jspdf";
import './Form.css'; 
function Form({ onScrape }) {  
  const urlRef = useRef();
  const [data, setData] = useState([]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = urlRef.current.value;
    const response = await axios.get('http://localhost:5000/scrape?url=' + encodeURIComponent(url));
    onScrape(response.data);  
    setData(response.data);  
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.text('Liste des restaurants:', 10, y);
    data.forEach((restaurant, index) => {
      y = y + 10;
      if (y > 280) {  
        doc.addPage(); 
        y = 10;  
      }

      doc.text(`${index + 1}. ${restaurant.name} - ${restaurant.phone}`, 10, y);
    });

    doc.save('liste des restaurant.pdf');
};

  return (
    <form onSubmit={handleSubmit}>
      <input ref={urlRef} type="text" placeholder="Enter URL" required />
      <button type="submit" className="scrape-button">Scrape</button>
      <button type="button" onClick={handleDownload} className="download-button">Télécharger PDF</button>
    </form>
  );
}

export default Form;
