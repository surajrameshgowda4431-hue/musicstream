const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const app = express();
const path = require("path");

// Serve the "songs" folder publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer config for uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) { cb(null, 'uploads/') },
  filename: function(req, file, cb) { cb(null, file.originalname) }
});
const upload = multer({ storage });

// Songs array
let songs = [
  { title: "Danza Kuduro", artist: "Don Omar", cover: "/uploads/cover1.jpg", url: "/uploads/danza_kuduro.mp3" },
  { title: "Despacito", artist: "Luis Fonsi", cover: "/uploads/cover2.jpg", url: "/uploads/despacito.mp3" },
  { title: "Fly Away", artist: "Lenny Kravitz", cover: "/uploads/cover3.jpg", url: "/uploads/fly_away.mp3" },
  { title: "Gasolina", artist: "Daddy Yankee", cover: "/uploads/cover4.jpg", url: "/uploads/gasolina.mp3" },
  { title: "Grateful", artist: "DJ Khaled", cover: "/uploads/cover5.jpg", url: "/uploads/grateful.mp3" },
  { title: "I Can Feel It", artist: "DJ Snake", cover: "/uploads/cover6.jpg", url: "/uploads/i_can_feel_it.mp3" },
  { title: "Perfect", artist: "Ed Sheeran", cover: "/uploads/cover7.jpg", url: "/uploads/perfect.mp3" },
  { title: "Shape Of You", artist: "Ed Sheeran", cover: "/uploads/cover8.jpg", url: "/uploads/Shape_Of_You.mp3" }
];

// Get songs
app.get('/api/songs', (req, res) => res.json(songs));

// Upload new song
app.post('/api/upload', upload.fields([{ name: 'song' }, { name: 'cover' }]), (req, res) => {
  const songFile = req.files['song'][0];
  const coverFile = req.files['cover'][0];
  const { title, artist } = req.body;

  const newSong = {
    title,
    artist,
    cover: `/uploads/${coverFile.filename}`,
    url: `/uploads/${songFile.filename}`
  };
  songs.push(newSong);
  res.json({ success: true, song: newSong });
});

// Payment routes
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
