const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
	//login admin or login user
	//const type = req.params.type;
	var sql = 'SELECT * FROM users INNER JOIN user_type ON user_type.iduser_type = users.userTypeID WHERE tel_users = ? AND pssword_users = ? AND actif_users = 1';
	const infologin = {
		telephone: req.body.telephone,
		password: req.body.password
	}

	db.query(sql, [infologin.telephone,infologin.password], function (error, results, fields) {
	  	if(error){
			res.status(500).json({
				"status": 500,
				"success": false,
				"error":{"code": error.code},
				"length": 0,
				"message": error.sqlMessage,
				"response": null
			});
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
			let renderResult = [];
            results.forEach(element => {
                renderResult.push({
					"user": element.id_users, 
					"telephone": element.tel_users,
					"fullname": element.fullname_users,
					"email": element.email_users,
					"created": element.created_users,
					"updated": element.updated_users,
					"photo": element.photo_users,
					"actif": element.actif_users,
					"verifier": element.verifier_users,
					"type": {
						"id": element.iduser_type,
						"value": element.value_type
					}
				})
			});
			let mess = "";
			if(renderResult.length>0){
				mess = "SUCCESS LOGIN, GET YOUR TOKEN"
			}else{
				mess = "FAILED TO CONNECT, VERIFY YOUR INFORMATION OR CREATE A NEW ACCOUNT"
			}
			var id=0;
			if(renderResult.length > 0){
				id = renderResult[0].user;
			}
			jwt.sign({info: infologin.email, id: id}, key, {expiresIn: '150 days'},(err, token)=>{
				res.status(200).json({
					"status": 200,
					"success": true, 
					"token": token, 
					"telephone": infologin.telephone, 
					"error": null, 
					"length": results.length,
					"message": mess,
					"response": renderResult
				});
			});
  			//res.send(JSON.stringify({"status": 200, "user": infologin.email, "-error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

module.exports = router;
