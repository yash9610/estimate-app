const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());  // To handle JSON bodies

// MongoDB connection
mongoose.connect('mongodb+srv://yashmittal964:Yash%40123@cluster1.53tz1.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('MongoDB connection error: ', err));

// Define a schema for the chat interactions
const ChatSchema = new mongoose.Schema({
  category: { type: String, required: true },
  platform: { type: String, required: true },
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Create a model based on the schema
const Chat = mongoose.model('Chat', ChatSchema);

// Endpoint to get price estimate and store chat history
app.get('/estimate/:platform', async (req, res) => {
  const { platform } = req.params;
  const priceData = {
    android: 40000,
    ios: 50000,
    mac: 100000,
    linux: 70000,
    windows: 35000,
  };

  const price = priceData[platform.toLowerCase()];

  if (price) {
    // Save chat interaction to MongoDB
    const newChat = new Chat({
      category: platform === 'android' || platform === 'ios' ? 'mobile' : 'desktop',
      platform: platform,
      price: price,
    });

    await newChat.save();

    res.json({ price });
  } else {
    res.status(404).json({ error: 'Platform not found' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
