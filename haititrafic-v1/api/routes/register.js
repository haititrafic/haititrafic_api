const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
	//login admin or login user const type = req.params.type;
	var sql = "INSERT INTO users (id_users, tel_users, pssword_users, fullname_users, created_users, updated_users, userTypeID, actif_users, verifier_users, email_users, photo_users) VALUES ('', ?, ?, ?, now(), '', ?, '1', '0', ?, 'default.jpg')";
	const inforegister = {
		telephone: req.body.telephone,
		password: req.body.password,
		fullname: req.body.fullname,
		type: req.body.typeid,
		email: req.body.email
	}

	db.query(sql, [inforegister.telephone, inforegister.password, inforegister.fullname, inforegister.type, inforegister.email], function (error, results, fields) {
	  	if(error){
			res.status(500).json({
				"status": 500,
				"success": false,
				"user": inforegister.telephone,
				"error":{"code": error.code},
				"message": error.sqlMessage,
				"length": 0
			});
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
				let message = "";
				if(results.affectedRows>0){
					message = "ACCOUNT CREATE SUCCESSFULLY"
				}else{
					message = "FAILED TO CREATE NEW ACCOUNT, VERIFY YOUR INFORMATION AND TRY AGAIN"
				}
				res.status(200).json({
					"status": 200,
					"success": true, 
					"user": inforegister.telephone,
					"error": null, 
					"message": message,
					"length": results.affectedRows
				});
			// jwt.sign({info: inforegister.telephone, id:results.insertId}, 's&creth@iti', {expiresIn: '300 days'},(err, token)=>{
			// 	console.log(JSON.stringify(results))
				
			// });
	  	}
  	});
});

module.exports = router;
