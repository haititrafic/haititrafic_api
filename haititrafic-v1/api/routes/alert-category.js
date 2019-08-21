const express = require('express');
const router = express.Router();

router.get('/', tokenvalidate, (req, res, next) => {
	jwt.verify(req.token, key, (err, authData)=>{
		if(err){
			res.sendStatus(403);
		}else{
            var sql = "SELECT * FROM category_alert";
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
                        renderResult.push({"category": element.id_categoryalert, "value": element.value_categoryalert, "description": element.desc_categoryalert, "icone": element.icone_categoryalert})
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
            var sql = "SELECT * FROM category_alert WHERE id_categoryalert = ?";
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
                        renderResult.push({"category": element.id_categoryalert, "value": element.value_categoryalert, "description": element.desc_categoryalert, "icone": element.icone_categoryalert})
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
            var sql = "INSERT INTO category_alert (id_categoryalert, value_categoryalert, desc_categoryalert, icone_categoryalert) VALUES ('', ?, ?, ?)";
            const infocategory = {
                category: req.body.category,
                descrition: req.body.description,
                icone: req.body.icone
            }
            //console.log("TYPE: "+JSON.stringify(req.body))
            db.query(sql, [infocategory.category, infocategory.descrition, infocategory.icone], function (error, results, fields) {
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
                        message = "CATEGORY CREATE SUCCESSFULLY"
                    }else{
                        message = "FAILED TO CREATE A NEW CATEGORY, TRY AGAIN"
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
		}
    });
});

module.exports = router;
