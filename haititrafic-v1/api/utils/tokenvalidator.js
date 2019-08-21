//FORMAT OF TOKEN 
//Authorization: Bearer <access_token>
//verify token
global.tokenvalidate = function tokenvalidate(req, res, next){
	//Get auth header value
	const bearerHeader = req.headers['authorization'];
	//check if bearer is undefined
	if(typeof bearerHeader !== 'undefined'){
		//split at the space 
		const bearer = bearerHeader.split(' ');
		//get token from array
		const bearerToken = bearer[1];
		req.token = bearerToken;
		//call next middleware
		next();
	}else{
		//Forbiden
		res.sendStatus(403);
	}

}
