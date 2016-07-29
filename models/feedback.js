var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Feed = new Schema({

	comments:{
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type:String,
		required: true
	},
	telephone: {
		type:Number,
		required: false
	},
	email: {
		type:String,
		required: false,
		default:''
	},
	tel:{
		areaCode:{
			type: Number,
			required:false
		},
		number:{
			type:Number,
			required:false
		}
	}
	
},{
	timestamps:true
});



Feed.methods.getTel = function() {
	return (this.areaCode+' '+this.number);
}

var Feedbacks = mongoose.model('Feedbacks',Feed);

module.exports = Feedbacks;