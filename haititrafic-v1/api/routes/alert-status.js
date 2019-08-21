const express = require('express');
const router = express.Router();

router.get('/', tokenvalidate, (req, res, next) => {
	jwt.verify(req.token, key, (err, authData)=>{
		if(err){
			res.sendStatus(403);
		}else{
            var sql = "SELECT * FROM status_alert";
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
                        renderResult.push({"status": element.id_statalert, "description": element.desc_statalert, "color": element.color_statalert, "code": element.code_statalert})
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
		}
	});
});

router.get('/:categoriID', tokenvalidate, (req, res, next) => {
	const id = req.params.categoriID;
	jwt.verify(req.token, key, (err, authData)=>{
		if(err){
			res.sendStatus(403);
		}else{
            var sql = "SELECT * FROM status_alert WHERE id_statalert = ?";
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
                        renderResult.push({"status": element.id_statalert, "description": element.desc_statalert, "color": element.color_statalert, "code": element.code_statalert})
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
		}
	});
});

router.post('/', tokenvalidate, (req, res, next) => {
    jwt.verify(req.token, key, (err, authData)=>{
		if(err){
			res.sendStatus(403);
		}else{
            var sql = "INSERT INTO status_alert (id_statalert, desc_statalert, color_statalert, code_statalert) VALUES ('', ?, ?, ?)";
            const info = {
                descrition: req.body.descrition,
                color: req.body.color,
                code: req.body.color_code
            }
            //console.log("TYPE: "+JSON.stringify(req.body))
            db.query(sql, [info.descrition, info.color, info.code], function (error, results, fields) {
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
                        message = "ALERT STATUS CREATE SUCCESSFULLY"
                    }else{
                        message = "FAILED TO CREATE A NEW ALERT STATUS, TRY AGAIN"
                    }

                    res.status(200).json({
                        "status": 200,
                        "success": true, 
                        "error": null, 
                        "length": results.affectedRows,
                        "message": message,
                        "response": null
                    });
                }
            });
		}
    });
});

module.exports = router;
