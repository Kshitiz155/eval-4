const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("./blacklist");


const auth = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        let existingToken = await BlacklistModel.find({
         blacklist:{$in:token}
        });

        if(existingToken){
            res.status(200).send({msg:"Please login again"})
        }
        else{
            jwt.verify(token,"token",(err,decode)=>{
                if(err){
                    res.status(400).send({msg:err.message})
                }else{                    
                    req.body.username= decode.username;
                    req.body.userId= decode.userId;
                    next();
                }
            })
        }
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

module.exports ={auth}
