const express = require('express');
const router = express.Router();

router.get('/', tokenvalidate, (req, res, next) => {
	jwt.verify(req.token, key, (err, authData)=>{
		if(err){
			res.sendStatus(403);
		}else{
            var sql = "SELECT * FROM level_alert";
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
                        renderResult.push({"level": element.id_levelalert, "value": element.value_levelalert, "description": element.desc_levelalert, "icone": element.icone_levelalert})
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
            var sql = "SELECT * FROM level_alert WHERE id_levelalert = ?";
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
                        renderResult.push({"level": element.id_levelalert, "value": element.value_levelalert, "description": element.desc_levelalert, "icone": element.icone_levelalert})
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
            var sql = "INSERT INTO level_alert (id_levelalert, value_levelalert, desc_levelalert, icone_levelalert) VALUES ('', ?, ?, ?)";
            const info = {
                category: req.body.level,
                descrition: req.body.description,
                icone: req.body.icone
            }
            //console.log("TYPE: "+JSON.stringify(req.body))
            db.query(sql, [info.level, info.descrition, info.icone], function (error, results, fields) {
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
                        message = "LEVEL ALERT CREATE SUCCESSFULLY"
                    }else{
                        message = "FAILED TO CREATE A NEW LEVEL ALERT, TRY AGAIN"
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
