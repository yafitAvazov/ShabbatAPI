
# ShabbatAPI


ShabbatAPI is a web platform that provides Shabbat times (candle lighting, havdalah, and parasha) for cities globally. Users can search for cities and get accurate Shabbat times based on geographical coordinates. This project utilizes the Hebcal API to fetch Shabbat times and is built using Node.js, Express, EJS, HTML, CSS, and JavaScript.

## Features

- **City Search:** Users can search for cities by name and view their respective Shabbat times.
- **Shabbat Times:** Provides candle lighting time, havdalah time, and the name of the weekly parasha in Hebrew.
- **Responsive Design:** The interface is designed to be fully responsive, providing an optimal user experience on both desktop and mobile devices.
## Technologies Used
- **Frontend**:
  - HTML
  - CSS (Bootstrap for responsive design)
  - JavaScript (for dynamic content and fetching data)
  - EJS (for server-side rendering of HTML templates)
- **Backend**:
  - Node.js
  - Express.js
  - Axios (for making HTTP requests to the Hebcal API)
  - CSV Parser (for loading and processing city data)

## How to Run the Project Locally
1. Clone the repository:

```bash
 git clone https://github.com/yourusername/ShabbatAPI.git

```

2. Install dependencies:

```bash
cd shabbat-in-the-world
npm install
```

3. Run the project:

```bash
npm start
```
4. Open your browser and visit http://localhost:3000 to see the application in action.

## Contributing
Feel free to fork the project and submit pull requests with improvements or bug fixes. If you find any issues or have suggestions for new features, please open an issue.

