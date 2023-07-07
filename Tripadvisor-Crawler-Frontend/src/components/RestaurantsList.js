import React from 'react';
import { jsPDF } from "jspdf";
import './RestaurantsList.css';

class RestaurantsList extends React.Component {
  handleDownload = () => {
    const doc = new jsPDF();
    let y = 10;  

    doc.text('Liste des restaurants:', 10, y);
    this.props.restaurants.forEach((restaurant, index) => {
      y = y + 10;
      if (y > 280) {  
        doc.addPage(); 
        y = 10;  
      }

      doc.text(`${index + 1}. ${restaurant.name} - ${restaurant.phone}`, 10, y);
    });

    doc.save("liste des restaurant.pdf");
}

  render() {
    return (
      <div>
        <ul>
          {this.props.restaurants.map((restaurant, index) => (
            <li key={index}>
              {restaurant.name} - {restaurant.phone}
            </li>
          ))}
        </ul>
        {this.props.restaurants.length > 0 && (
          <button onClick={this.handleDownload} className="download-button">Télécharger PDF</button>
        )}
      </div>
    );
  }
}

export default RestaurantsList;
