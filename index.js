import fs from 'fs';
import path from 'path';
import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import csvParser from 'csv-parser';  // ספריית csv-parser

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// טוען את קובץ ה-CSV ומבצע עיבוד
let cities = [];

// קריאת קובץ ה-CSV עם רשימת הערים
fs.createReadStream(path.join(__dirname, 'geolocations-il-master', 'cities.csv'))
    .pipe(csvParser())
    .on('data', (row) => {
        cities.push({
            name: row.City,  // שם העיר
            latitude: parseFloat(row.Latitude),  // קואורדינטות latitude
            longitude: parseFloat(row.Longitude) // קואורדינטות longitude
        });
    })
    .on('end', () => {
        console.log(`Successfully loaded ${cities.length} cities from the CSV file.`);
    });

// API לחיפוש ערים
app.get('/search', (req, res) => {
    const query = req.query.q?.toLowerCase() || '';
    const results = cities.filter(city => city.name.toLowerCase().startsWith(query));
    res.json(results.slice(0, 10).map(city => ({
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude  // הוספתי את הקואורדינטות
    })));
});

// API לקבלת זמני שבת לפי עיר
app.get('/shabbat-times', async (req, res) => {
    const cityName = req.query.city;
    
    // מציאת העיר מתוך רשימת הערים
    const city = cities.find(c => c.name === cityName);
    if (!city) {
        return res.status(400).json({ error: 'City not found' });
    }

    const { latitude, longitude } = city;  // קואורדינטות העיר

    try {
        // בקשת API ל-Hebcal לקבלת זמני שבת לפי הקואורדינטות
        const response = await axios.get('https://www.hebcal.com/shabbat', {
            params: {
                cfg: 'json',
                latitude: latitude,
                longitude: longitude,
                tzid: 'Asia/Jerusalem',  // אזור הזמן של ירושלים
                M: 'on',  // Havdalah בלילה (tzeit hakochavim)
                b: 18     // דלקת נרות 18 דקות לפני השקיעה
            }
        });

        console.log('Hebcal Response:', response.data);  // הדפסת תוצאות ה-API כולה

        const data = response.data;

        // בדוק אם יש תוצאות בתשובה
        if (data.items && data.items.length > 0) {
            // הדפסת כל פריט במערך items
            data.items.forEach(item => {
                console.log(`Category: ${item.category}, Time: ${item.time}`);
            });
        } else {
            console.log('לא נמצאו תוצאות עבור זמני שבת');
        }

        const times = {
            candleLighting: data.items.find(item => item.category === 'candles')?.title.split(': ')[1],  // מחפש את השעה מתוך ה-title
            havdalah: data.items.find(item => item.category === 'havdalah')?.title.split(': ')[1],   // מחפש את השעה מתוך ה-title
            parasha: data.items.find(item => item.category === 'parashat')?.hebrew || 'לא זמין'  // מחפש את פרשת השבוע בעברית
        };

        console.log('Candle Lighting Time:', times.candleLighting); // הדפסת זמן הדלקת נרות
        console.log('Havdalah Time:', times.havdalah); // הדפסת זמן הבדלה
        console.log('Parasha:', times.parasha); // הדפסת שם הפרשה

        res.json(times);  // מחזירים את זמני השבת כולל פרשת השבוע
    } catch (error) {
        console.error('Error fetching Shabbat times:', error);
        res.status(500).json({ error: 'Error fetching Shabbat times' });
    }
});

// דף הבית
app.get('/', (req, res) => {
    res.render('index');
});

// התחלת השרת
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
