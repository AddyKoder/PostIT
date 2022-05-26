import mongoose from 'mongoose';
const params = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

mongoose.connect('mongodb://localhost:27017/posty', params);

