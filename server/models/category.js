const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const categorySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'No puede repetir la categoría']
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
module.exports = mongoose.model('Category', categorySchema);