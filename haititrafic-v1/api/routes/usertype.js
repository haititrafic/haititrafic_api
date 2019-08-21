const express = require('express');
const router = express.Router();

router.get('/', tokenvalidate, (req, res, next) => {
	jwt.verify(req.token, key, (err, authData)=>{
		if(err){
			res.sendStatus(403);
		}else{
            var sql = "SELECT * FROM user_type";
            db.query(sql, function (error, results, fields) {
                if(error){
                    res.status(500).json({
                        "status": 500,
                        "success": false,
                        "error":{"code": error.code},
                        "message": error.sqlMessage,
                        "length": 0,
                        "response": null
                    });
                    //If there is error, we send the error in the error section with 500 status
                } else {
                    let renderResult = [];
                    results.forEach(element => {
                        renderResult.push({"type": element.iduser_type, "value": element.value_type})
                    });

                    res.status(200).json({
                        "status": 200,
                        "success": true,
                        "error": null,
                        "message": null,
                        "length": renderResult.length,
                        "response": renderResult
                    });
                    //If there is no error, all is good and response is 200OK.
                }
            });
            db.end();
		}
	});
});

router.get('/:typeID', tokenvalidate, (req, res, next) => {
	const id = req.params.typeID;
	jwt.verify(req.token, key, (err, authData)=>{
		if(err){
			res.sendStatus(403);
		}else{
            var sql = "SELECT * FROM user_type WHERE iduser_type = ?";
            db.query(sql, [id], function (error, results, fields) {
                if(error){
                    res.status(500).json({
                        "status": 500,
                        "success": false,
                        "error":{"code": error.code},
                        "message": error.sqlMessage,
                        "length": 0,
                        "response": null
                    });
                    //If there is error, we send the error in the error section with 500 status
                } else {
                    let renderResult = [];
                    results.forEach(element => {
                        renderResult.push({"type": element.iduser_type, "value": element.value_type})
                    });

                    res.status(200).json({
                        "status": 200,
                        "success": true,
                        "error": null,
                        "message": null,
                        "length": renderResult.length,
                        "response": renderResult
                    });
                    //If there is no error, all is good and response is 200OK.
                }
            });
            db.end();
		}
	});
});

router.post('/', tokenvalidate, (req, res, next) => {
    jwt.verify(req.token, key, (err, authData)=>{
		if(err){
			res.sendStatus(403);
		}else{
            var sql = "INSERT INTO user_type (iduser_type, value_type) VALUES ('', ?)";
            const infotype = {
                type: req.body.type
            }
            //console.log("TYPE: "+JSON.stringify(req.body))
            db.query(sql, [infotype.type], function (error, results, fields) {
                if(error){
                    res.status(500).json({
                        "status": 500,
                        "success": false,
                        "error":{"code": error.code},
                        "message": error.sqlMessage,
                        "length": 0,
                        "response": null
                    });
                    //If there is error, we send the error in the error section with 500 status
                } else {
                    let message = "";
                    if(results.affectedRows>0){
                        message = "TYPE CREATE SUCCESSFULLY"
                    }else{
                        message = "FAILED TO CREATE A TYPE, TRY AGAIN"
                    }

                    res.status(200).json({
                        "status": 200,
                        "success": true, 
                        "error": null, 
                        "length": results.affectedRows,
                        "message": message,
                        "response": null
                    });
                    //If there is no error, all is good and response is 200OK.
                }
            });
            db.end();
		}
    });
});

module.exports = router;
