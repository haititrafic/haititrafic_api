const express = require('express');
const router = express.Router();

router.get('/', tokenvalidate, (req, res, next) => {
	jwt.verify(req.token, key, (err, authData)=>{
		if(err){
			res.sendStatus(403);
		}else{
            var sql = "SELECT * FROM commune INNER JOIN departement ON commune.communeDeptID = departement.id_departement";
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
                        renderResult.push({"commune": element.id_commune, "value": element.value_commune, "zipcode": element.zipcode_commune, "departement": {"id": element.id_departement ,"value":element.value_departement}})
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

router.get('/:communeID', tokenvalidate, (req, res, next) => {
    const params = req.params.communeID;
    const spliter = params.split('=');
    let query = "";
    if(spliter[0]==="com"){
        query = "id_commune = ?" 
    }else if(spliter[0]==="dept"){
        query = "communeDeptID = ?" 
    }
    const id = spliter[1];
	jwt.verify(req.token, key, (err, authData)=>{
		if(err){
			res.sendStatus(403);
		}else{
            var sql = "SELECT * FROM commune  INNER JOIN departement ON commune.communeDeptID = departement.id_departement WHERE "+query;
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
                        renderResult.push({"commune": element.id_commune, "value": element.value_commune, "zipcode": element.zipcode_commune, "departement": {"id": element.id_departement ,"value":element.value_departement}})
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
            var sql = "INSERT INTO commune (id_commune, value_commune, communeDeptID, zipcode_commune) VALUES ('', ?, ?, ?)";
            const info = {
                commune: req.body.commune,
                deptId: req.body.departmentID,
                zipcode: req.body.zipcode
            }
            
            db.query(sql, [info.commune, info.deptId, info.zipcode], function (error, results, fields) {
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
                        message = "COMMUNE CREATE SUCCESSFULLY"
                    }else{
                        message = "FAILED TO CREATE A COMMUNE, TRY AGAIN"
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
