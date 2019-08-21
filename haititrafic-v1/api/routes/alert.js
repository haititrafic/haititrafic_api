const express = require('express');
const router = express.Router();

router.get('/', tokenvalidate, (req, res, next) => {
	jwt.verify(req.token, key, (err, authData)=>{
		if(err){
			res.sendStatus(403);
		}else{
            var sql = "SELECT * FROM alert_info "+
            "INNER JOIN status_alert ON status_alert.id_statalert = alert_info.alertStatID "+
            "INNER JOIN category_alert ON category_alert.id_categoryalert = alert_info.alertCatID "+
            "INNER JOIN commune ON commune.id_commune = alert_info.alertComuID "+
            "LEFT JOIN departement ON commune.communeDeptID=departement.id_departement "+
            "ORDER BY date_alert DESC LIMIT 50";
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
                        renderResult.push(
                            {
                                "alert": element.id_alert,
                                "image": element.image_alert,
                                "caption": element.caption_alert,
                                "title": element.title_alert,
                                "publish_date": element.date_alert,
                                "latitude": element.lat_alert,
                                "longitude": element.long_alert,
                                "persistance": element.persistans_alert,
                                "status_info":{
                                            "status":element.id_statalert,
                                            "description":element.desc_statalert,
                                            "color_name":element.color_statalert,
                                            "color_code":element.code_statalert
                                         },
                                "category_info":{
                                            "category":element.id_categoryalert,
                                            "value":element.value_categoryalert,
                                            "description":element.desc_categoryalert,
                                            "icone":element.icone_categoryalert
                                         },
                                "commune_info":{
                                            "commune":element.id_commune,
                                            "value":element.value_commune,
                                            "zipcode":element.zipcode_commune,
                                            "icone":element.icone_categoryalert,
                                            "departement_info":{
                                                "departement": element.id_departement,
                                                "value": element.value_departement
                                            }
                                         }
                            })
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
            var sql = "INSERT INTO alert_info (id_alert, image_alert, caption_alert, title_alert, date_alert, alertStatID, alertCatID, alertTypID, alertLevID, alertUserID, alertComuID, persistans_alert, lat_alert, long_alert) VALUES ('', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const info = {
                image: req.body.image,
                caption: req.body.caption,
                title: req.body.title,
                date: req.body.date,
                longitude: req.body.longitude,
                latitude: req.body.latitude,
                image: req.body.image,
                descrition: req.body.description,
                persistance: req.body.persistance,
                statusid: req.body.idstatus,
                categoryid: req.body.idcategory,
                typeid: req.body.idtype,
                userid: req.body.iduser,
                levelid: req.body.idlevel,
                communeid: req.body.idcommune
            }

            db.query(sql, [info.image, info.caption, info.title, info.date, info.statusid, info.categoryid, info.typeid, info.levelid, info.userid, info.communeid, info.persistance, info.latitude, info.longitude], function (error, results, fields) {
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
                        message = "ALERT CREATE SUCCESSFULLY"
                    }else{
                        message = "FAILED TO CREATE A NEW ALERT, TRY AGAIN"
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


/*
// Thumbnail
https://www.instagram.com/p/BI0BQkfh0ed/media/?size=t
// Medium
https://www.instagram.com/p/BI0BQkfh0ed/media/?size=m
// Large
https://www.instagram.com/p/BI0BQkfh0ed/media/?size=l


"SELECT * FROM alert_info, commune "+
            "LEFT JOIN status_alert ON status_alert.id_statalert = alert_info.alertStatID "+
            "LEFT JOIN category_alert ON category_alert.id_categoryalert = alert_info.alertCatID "+
            "LEFT JOIN type_alert ON type_alert.id_typealert = alert_info.alertTypID "+
            "LEFT JOIN level_alert ON level_alert.id_levelalert = alert_info.alertLevID "+
            "INNER JOIN departement ON departement.id_departement = commune.communeDeptID "+
            "WHERE commune.communeDeptID=alert_info.alertComuID"+
            "ORDER BY date_alert DESC LIMIT 50"
            */